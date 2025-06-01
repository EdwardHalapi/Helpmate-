import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Organization } from "../../models/Organization";

const COLLECTION_NAME = "organizations";

class OrganizationsService {
  constructor() {
    this.collection = collection(db, COLLECTION_NAME);
  }

  async getByOrganizerId(organizerId) {
    try {
      const docRef = doc(this.collection, organizerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return new Organization({ id: docSnap.id, ...docSnap.data() });
      }
      return null;
    } catch (error) {
      console.error("Error fetching organization:", error);
      throw error;
    }
  }

  async create(organizationData) {
    try {
      const { organizerId } = organizationData;
      if (!organizerId) {
        throw new Error("organizerId is required");
      }

      const dataToSave = {
        ...organizationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        totalProjects: 0,
        totalVolunteers: 0,
        totalHours: 0
      };

      const docRef = doc(this.collection, organizerId);
      await setDoc(docRef, dataToSave);
      return organizerId;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  }

  async update(organizationId, updates) {
    try {
      const docRef = doc(this.collection, organizationId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  }

  async delete(organizationId) {
    try {
      const docRef = doc(this.collection, organizationId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  }

  async getAll() {
    try {
      const q = query(this.collection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        new Organization({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  }

  async incrementProjectCount(organizationId) {
    try {
      const docRef = doc(this.collection, organizationId);
      const orgDoc = await getDoc(docRef);
      if (orgDoc.exists()) {
        await updateDoc(docRef, {
          totalProjects: (orgDoc.data().totalProjects || 0) + 1,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error incrementing project count:", error);
      throw error;
    }
  }

  async updateVolunteerCount(organizationId, count) {
    try {
      const docRef = doc(this.collection, organizationId);
      await updateDoc(docRef, {
        totalVolunteers: count,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating volunteer count:", error);
      throw error;
    }
  }

  async updateTotalHours(organizationId, hours) {
    try {
      const docRef = doc(this.collection, organizationId);
      await updateDoc(docRef, {
        totalHours: hours,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating total hours:", error);
      throw error;
    }
  }
}

export const organizationsService = new OrganizationsService();
