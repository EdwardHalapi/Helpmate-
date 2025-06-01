import { collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config'; 
import { Task } from '../../models/Task';

class TasksService {
  constructor() {
    this.collection = collection(db, 'tasks');
  }

  async getTasksByVolunteerId(volunteerId) {
    try {
      const q = query(this.collection, where('assignedVolunteerId', '==', volunteerId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => new Task({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching volunteer tasks:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId, newStatus) {
    try {
      const taskRef = doc(this.collection, taskId);
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: new Date(),
        completedAt: newStatus === 'Finalizat' ? new Date() : null
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  async logHours(taskId, hours) {
    try {
      const taskRef = doc(this.collection, taskId);
      await updateDoc(taskRef, {
        actualHours: hours,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error logging hours:', error);
      throw error;
    }
  }
}

export const tasksService = new TasksService();
