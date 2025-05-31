import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Volunteer } from "../../models/Volunteer"; // Import your Volunteer model

const COLLECTION_NAME = "volunteers";

export const volunteerService = {
  // Get all volunteers
  async getAll(filters = {}) {
    try {
      let q = collection(db, COLLECTION_NAME);

      if (filters.status) {
        q = query(q, where("status", "==", filters.status));
      }

      if (filters.organizationId) {
        q = query(q, where("organizationId", "==", filters.organizationId));
      }

      q = query(q, orderBy("lastName"));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => new Volunteer({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      throw error;
    }
  },

  // Get volunteer by ID
  async getById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return new Volunteer({ id: docSnap.id, ...docSnap.data() });
      }
      return null;
    } catch (error) {
      console.error("Error fetching volunteer:", error);
      throw error;
    }
  },

  // Create new volunteer
  async create(volunteerData) {
    try {
      const volunteer = new Volunteer(volunteerData);
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...volunteer,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...volunteer };
    } catch (error) {
      console.error("Error creating volunteer:", error);
      throw error;
    }
  },

  // Update volunteer
  async update(id, updates) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      });
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating volunteer:", error);
      throw error;
    }
  },

  // Delete volunteer
  async delete(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      throw error;
    }
  },

  // Update volunteer rating
  async updateRating(id, newRating) {
    return await this.update(id, { rating: newRating });
  },

  // Get volunteers by status
  async getByStatus(status) {
    return await this.getAll({ status });
  },
};
