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
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Presupunem că ai configurat Firebase
import { Project } from "../../models/Project"; // Importăm clasa Project

const COLLECTION_NAME = "projects";

// Structura pentru Firestore
const PROJECT_STRUCTURE = {
  title: "",
  description: "",
  organizationId: null,
  managerId: null,
  status: "Planificat",
  priority: "Medie",
  startDate: null,
  endDate: null,
  maxVolunteers: 0,
  currentVolunteers: 0,
  requiredSkills: [],
  location: "",
  createdAt: null,
  updatedAt: null,
  totalHours: 0,
  completedTasks: 0,
  totalTasks: 0,
  tasks: [],
};

class ProjectsService {
  /**
   * Obține toate proiectele
   * @param {Object} filters - Filtre opționale pentru căutare
   * @returns {Promise<Array<Project>>} Lista de proiecte
   */
  async getAllProjects(filters = {}) {
    try {
      let q = collection(db, COLLECTION_NAME);

      // Aplicăm filtrele
      const conditions = [];

      if (filters.status) {
        conditions.push(where("status", "==", filters.status));
      }

      if (filters.priority) {
        conditions.push(where("priority", "==", filters.priority));
      }

      if (filters.location) {
        conditions.push(where("location", "==", filters.location));
      }

      if (filters.organizationId) {
        conditions.push(where("organizationId", "==", filters.organizationId));
      }

      if (filters.managerId) {
        conditions.push(where("managerId", "==", filters.managerId));
      }

      // Construim query-ul cu condițiile
      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      // Sortare
      if (filters.orderBy) {
        q = query(
          q,
          orderBy(filters.orderBy, filters.orderDirection || "desc")
        );
      } else {
        q = query(q, orderBy("createdAt", "desc"));
      }

      // Limita
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const projects = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push(
          new Project({
            id: doc.id,
            ...data,
            // Convertim timestamp-urile în Date objects
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            startDate: data.startDate?.toDate() || null,
            endDate: data.endDate?.toDate() || null,
          })
        );
      });

      return projects;
    } catch (error) {
      console.error("Eroare la obținerea proiectelor:", error);
      throw new Error("Nu s-au putut încărca proiectele");
    }
  }

  /**
   * Obține un proiect după ID
   * @param {string} projectId - ID-ul proiectului
   * @returns {Promise<Project|null>} Proiectul găsit sau null
   */
  async getProjectById(projectId) {
    try {
      console.log("Getting project document for ID:", projectId);
      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);

      if (projectSnap.exists()) {
        const data = projectSnap.data();
        return new Project({
          id: projectSnap.id,
          ...data,
          // Convert timestamps to Date objects
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          startDate: data.startDate?.toDate() || null,
          endDate: data.endDate?.toDate() || null,
          lastDonationAt: new Date(data.lastDonationAt).toDateString() || null,
        });
      }
      return null;
    } catch (error) {
      console.error("Error in getProjectById:", error);
      throw error;
    }
  }

  /**
   * Creează un proiect nou
   * @param {Object|Project} projectData - Datele proiectului sau instanță Project
   * @returns {Promise<string>} ID-ul proiectului creat
   */
  async createProject(projectData) {
    try {
      // Validăm datele obligatorii
      const requiredFields = [
        "title",
        "description",
        "organizationId",
        "managerId",
        "location",
      ];
      for (const field of requiredFields) {
        if (!projectData[field]) {
          throw new Error(`Câmpul ${field} este obligatoriu`);
        }
      }

      // Pregătim datele pentru salvare
      const projectToSave = {
        ...PROJECT_STRUCTURE,
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        currentVolunteers: projectData.currentVolunteers || 0,
        totalHours: projectData.totalHours || 0,
        completedTasks: projectData.completedTasks || 0,
        totalTasks: projectData.totalTasks || 0,
        requiredSkills: projectData.requiredSkills || [],
      };

      // Eliminăm id-ul dacă există (Firestore îl generează automat)
      delete projectToSave.id;

      // Convertim datele în format Firestore
      if (projectData.startDate) {
        projectToSave.startDate =
          projectData.startDate instanceof Date
            ? projectData.startDate
            : new Date(projectData.startDate);
      }

      if (projectData.endDate) {
        projectToSave.endDate =
          projectData.endDate instanceof Date
            ? projectData.endDate
            : new Date(projectData.endDate);
      }

      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        projectToSave
      );

      return docRef.id;
    } catch (error) {
      console.error("Eroare la crearea proiectului:", error);
      throw new Error("Nu s-a putut crea proiectul: " + error.message);
    }
  }

  /**
   * Actualizează un proiect existent
   * @param {string} projectId - ID-ul proiectului
   * @param {Object} updateData - Datele de actualizat
   * @returns {Promise<boolean>}
   */
  async updateProject(projectId, updateData) {
    try {
      if (!projectId) {
        throw new Error("ID-ul proiectului este necesar");
      }

      // Adăugăm timestamp-ul de actualizare
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };

      // Eliminăm id-ul din datele de update
      delete dataToUpdate.id;

      // Convertim datele dacă este necesar
      if (updateData.startDate) {
        dataToUpdate.startDate =
          updateData.startDate instanceof Date
            ? updateData.startDate
            : new Date(updateData.startDate);
      }

      if (updateData.endDate) {
        dataToUpdate.endDate =
          updateData.endDate instanceof Date
            ? updateData.endDate
            : new Date(updateData.endDate);
      }

      // Actualizăm progresul dacă au fost modificate task-urile
      if (
        updateData.completedTasks !== undefined ||
        updateData.totalTasks !== undefined
      ) {
        const currentProject = await this.getProjectById(projectId);
        if (currentProject) {
          const completedTasks =
            updateData.completedTasks !== undefined
              ? updateData.completedTasks
              : currentProject.completedTasks;
          const totalTasks =
            updateData.totalTasks !== undefined
              ? updateData.totalTasks
              : currentProject.totalTasks;

          // Actualizăm status-ul dacă proiectul e complet
          if (
            totalTasks > 0 &&
            completedTasks >= totalTasks &&
            currentProject.status !== "Finalizat"
          ) {
            dataToUpdate.status = "Finalizat";
          }
        }
      }

      const docRef = doc(db, COLLECTION_NAME, projectId);
      await updateDoc(docRef, dataToUpdate);

      return true;
    } catch (error) {
      console.error("Eroare la actualizarea proiectului:", error);
      throw new Error("Nu s-a putut actualiza proiectul: " + error.message);
    }
  }

  /**
   * Șterge un proiect definitiv
   * @param {string} projectId - ID-ul proiectului
   * @returns {Promise<boolean>}
   */
  async deleteProject(projectId) {
    try {
      if (!projectId) {
        throw new Error("ID-ul proiectului este necesar");
      }

      const docRef = doc(db, COLLECTION_NAME, projectId);
      await deleteDoc(docRef);

      return true;
    } catch (error) {
      console.error("Eroare la ștergerea proiectului:", error);
      throw new Error("Nu s-a putut șterge proiectul");
    }
  }

  /**
   * Adaugă un voluntar la proiect
   * @param {string} projectId - ID-ul proiectului
   * @param {string} volunteerId - ID-ul voluntarului
   * @returns {Promise<boolean>}
   */
  async addVolunteerToProject(projectId, volunteerId) {
    try {
      const project = await this.getProjectById(projectId);

      if (!project) {
        throw new Error("Proiectul nu există");
      }

      if (project.currentVolunteers >= project.maxVolunteers) {
        throw new Error("Proiectul a atins numărul maxim de voluntari");
      }

      const newCurrentVolunteers = project.currentVolunteers + 1;
      const newStatus =
        newCurrentVolunteers >= project.maxVolunteers
          ? "Complet"
          : project.status;

      await this.updateProject(projectId, {
        currentVolunteers: newCurrentVolunteers,
        status: newStatus,
      });

      return true;
    } catch (error) {
      console.error("Eroare la adăugarea voluntarului:", error);
      throw new Error("Nu s-a putut adăuga voluntarul: " + error.message);
    }
  }

  /**
   * Elimină un voluntar de la proiect
   * @param {string} projectId - ID-ul proiectului
   * @param {string} volunteerId - ID-ul voluntarului
   * @returns {Promise<boolean>}
   */
  async removeVolunteerFromProject(projectId, volunteerId) {
    try {
      const project = await this.getProjectById(projectId);

      if (!project) {
        throw new Error("Proiectul nu există");
      }

      if (project.currentVolunteers <= 0) {
        throw new Error("Nu există voluntari de eliminat");
      }

      const newCurrentVolunteers = Math.max(0, project.currentVolunteers - 1);
      const newStatus =
        newCurrentVolunteers < project.maxVolunteers &&
        project.status === "Complet"
          ? "Activ"
          : project.status;

      await this.updateProject(projectId, {
        currentVolunteers: newCurrentVolunteers,
        status: newStatus,
      });

      return true;
    } catch (error) {
      console.error("Eroare la eliminarea voluntarului:", error);
      throw new Error("Nu s-a putut elimina voluntarul: " + error.message);
    }
  }

  /**
   * Actualizează progresul task-urilor pentru un proiect
   * @param {string} projectId - ID-ul proiectului
   * @param {number} completedTasks - Numărul de task-uri completate
   * @param {number} totalTasks - Numărul total de task-uri
   * @returns {Promise<boolean>}
   */
  async updateProjectProgress(projectId, completedTasks, totalTasks = null) {
    try {
      const updateData = { completedTasks };

      if (totalTasks !== null) {
        updateData.totalTasks = totalTasks;
      }

      await this.updateProject(projectId, updateData);
      return true;
    } catch (error) {
      console.error("Eroare la actualizarea progresului:", error);
      throw new Error("Nu s-a putut actualiza progresul: " + error.message);
    }
  }

  /**
   * Actualizează orele totale pentru un proiect
   * @param {string} projectId - ID-ul proiectului
   * @param {number} hours - Orele de adăugat
   * @returns {Promise<boolean>}
   */
  async addHoursToProject(projectId, hours) {
    try {
      const project = await this.getProjectById(projectId);

      if (!project) {
        throw new Error("Proiectul nu există");
      }

      const newTotalHours = project.totalHours + hours;

      await this.updateProject(projectId, {
        totalHours: newTotalHours,
      });

      return true;
    } catch (error) {
      console.error("Eroare la adăugarea orelor:", error);
      throw new Error("Nu s-au putut adăuga orele: " + error.message);
    }
  }

  /**
   * Căutare în timp real pentru proiecte
   * @param {Function} callback - Funcția care va fi apelată la fiecare schimbare
   * @param {Object} filters - Filtre pentru căutare
   * @returns {Function} Funcția de unsubscribe
   */
  subscribeToProjects(callback, filters = {}) {
    try {
      let q = collection(db, COLLECTION_NAME);

      // Aplicăm filtrele
      const conditions = [];

      if (filters.status) {
        conditions.push(where("status", "==", filters.status));
      }

      if (filters.priority) {
        conditions.push(where("priority", "==", filters.priority));
      }

      if (filters.organizationId) {
        conditions.push(where("organizationId", "==", filters.organizationId));
      }

      if (filters.managerId) {
        conditions.push(where("managerId", "==", filters.managerId));
      }

      if (conditions.length > 0) {
        q = query(q, ...conditions, orderBy("createdAt", "desc"));
      } else {
        q = query(q, orderBy("createdAt", "desc"));
      }

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const projects = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            projects.push(
              new Project({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                startDate: data.startDate?.toDate() || null,
                endDate: data.endDate?.toDate() || null,
              })
            );
          });
          callback(projects);
        },
        (error) => {
          console.error("Eroare la subscription:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Eroare la crearea subscription-ului:", error);
      throw new Error("Nu s-a putut crea subscription-ul");
    }
  }

  /**
   * Obține proiectele unui manager specific
   * @param {string} managerId - ID-ul managerului
   * @returns {Promise<Array<Project>>} Lista de proiecte
   */
  async getProjectsByManager(managerId) {
    return this.getAllProjects({ managerId });
  }

  /**
   * Obține proiectele unei organizații specifice
   * @param {string} organizationId - ID-ul organizației
   * @returns {Promise<Array<Project>>} Lista de proiecte
   */
  async getProjectsByOrganization(organizationId) {
    return this.getAllProjects({ organizationId });
  }

  /**
   * Obține statistici pentru proiecte
   * @param {string} organizationId - ID-ul organizației (opțional)
   * @returns {Promise<Object>} Obiect cu statistici
   */
  async getProjectsStats(organizationId = null) {
    try {
      const filters = organizationId ? { organizationId } : {};
      const allProjects = await this.getAllProjects(filters);

      const stats = {
        total: allProjects.length,
        planificate: allProjects.filter((p) => p.status === "Planificat")
          .length,
        active: allProjects.filter((p) => p.status === "Activ").length,
        finalizate: allProjects.filter((p) => p.status === "Finalizat").length,
        anulate: allProjects.filter((p) => p.status === "Anulat").length,
        totalVolunteers: allProjects.reduce(
          (sum, p) => sum + p.currentVolunteers,
          0
        ),
        totalHours: allProjects.reduce((sum, p) => sum + p.totalHours, 0),
        averageProgress:
          allProjects.length > 0
            ? Math.round(
                allProjects.reduce((sum, p) => sum + p.progress, 0) /
                  allProjects.length
              )
            : 0,
        byPriority: {
          Scăzută: allProjects.filter((p) => p.priority === "Scăzută").length,
          Medie: allProjects.filter((p) => p.priority === "Medie").length,
          Ridicată: allProjects.filter((p) => p.priority === "Ridicată").length,
        },
        byStatus: {
          Planificat: allProjects.filter((p) => p.status === "Planificat")
            .length,
          Activ: allProjects.filter((p) => p.status === "Activ").length,
          Finalizat: allProjects.filter((p) => p.status === "Finalizat").length,
          Anulat: allProjects.filter((p) => p.status === "Anulat").length,
        },
      };

      return stats;
    } catch (error) {
      console.error("Eroare la obținerea statisticilor:", error);
      throw new Error("Nu s-au putut obține statisticile");
    }
  }

  /**
   * Căutare proiecte după text
   * @param {string} searchTerm - Termenul de căutare
   * @param {Object} filters - Filtre adiționale
   * @returns {Promise<Array<Project>>} Lista de proiecte găsite
   */
  async searchProjects(searchTerm, filters = {}) {
    try {
      // Obținem toate proiectele cu filtrele aplicate
      const allProjects = await this.getAllProjects(filters);

      if (!searchTerm || searchTerm.trim() === "") {
        return allProjects;
      }

      const searchTermLower = searchTerm.toLowerCase().trim();

      // Filtrăm după termen
      const filteredProjects = allProjects.filter((project) => {
        return (
          project.title.toLowerCase().includes(searchTermLower) ||
          project.description.toLowerCase().includes(searchTermLower) ||
          project.location.toLowerCase().includes(searchTermLower) ||
          project.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(searchTermLower)
          )
        );
      });

      return filteredProjects;
    } catch (error) {
      console.error("Eroare la căutarea proiectelor:", error);
      throw new Error("Nu s-au putut căuta proiectele");
    }
  }

  /**
   * Obține proiectele active (status Activ)
   * @param {Object} filters - Filtre adiționale
   * @returns {Promise<Array<Project>>} Lista de proiecte active
   */
  async getActiveProjects(filters = {}) {
    return this.getAllProjects({ ...filters, status: "Activ" });
  }

  /**
   * Obține proiectele finalizate
   * @param {Object} filters - Filtre adiționale
   * @returns {Promise<Array<Project>>} Lista de proiecte finalizate
   */
  async getCompletedProjects(filters = {}) {
    return this.getAllProjects({ ...filters, status: "Finalizat" });
  }

  /**
   * Marchează un proiect ca finalizat
   * @param {string} projectId - ID-ul proiectului
   * @returns {Promise<boolean>}
   */
  async markProjectAsCompleted(projectId) {
    try {
      await this.updateProject(projectId, {
        status: "Finalizat",
        completedTasks: await this.getProjectById(projectId).then(
          (p) => p?.totalTasks || 0
        ),
      });
      return true;
    } catch (error) {
      console.error("Eroare la marcarea proiectului ca finalizat:", error);
      throw new Error("Nu s-a putut marca proiectul ca finalizat");
    }
  }

  /**
   * Activează un proiect planificat
   * @param {string} projectId - ID-ul proiectului
   * @returns {Promise<boolean>}
   */
  async activateProject(projectId) {
    try {
      await this.updateProject(projectId, {
        status: "Activ",
      });
      return true;
    } catch (error) {
      console.error("Eroare la activarea proiectului:", error);
      throw new Error("Nu s-a putut activa proiectul");
    }
  }

  /**
   * Anulează un proiect
   * @param {string} projectId - ID-ul proiectului
   * @param {string} reason - Motivul anulării (opțional)
   * @returns {Promise<boolean>}
   */
  async cancelProject(projectId, reason = "") {
    try {
      const updateData = { status: "Anulat" };
      if (reason) {
        updateData.cancellationReason = reason;
      }

      await this.updateProject(projectId, updateData);
      return true;
    } catch (error) {
      console.error("Eroare la anularea proiectului:", error);
      throw new Error("Nu s-a putut anula proiectul");
    }
  }
}

// Exportăm doar serviciul și structura, Project vine din models
const projectsService = new ProjectsService();
export default projectsService;

// Exportăm și clasa pentru cazuri speciale
export { ProjectsService, PROJECT_STRUCTURE };
