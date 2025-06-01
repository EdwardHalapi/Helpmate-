import { useState, useEffect } from 'react';
import { volunteerService } from '../services/api/volunteers';

export const useVolunteers = (filters = {}) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data = await volunteerService.getAll(filters);
      setVolunteers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [JSON.stringify(filters)]);

  const updateVolunteer = async (id, updates) => {
    try {
      const updatedVolunteer = await volunteerService.update(id, updates);
      setVolunteers(prev => 
        prev.map(v => v.id === id ? updatedVolunteer : v)
      );
      return updatedVolunteer;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVolunteer = async (id) => {
    try {
      await volunteerService.delete(id);
      setVolunteers(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    volunteers,
    loading,
    error,
    refetch: fetchVolunteers,
    updateVolunteer,
    deleteVolunteer
  };
};