import { ref } from 'vue';
import axios from 'axios';

export function usePatients() {
  const patients = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchPatients = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get("http://localhost:5000/getPatients");
      patients.value = response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching patients:", err);
      alert("Failed to load patients");
    } finally {
      loading.value = false;
    }
  };

  const searchPatients = async (query) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`http://localhost:5000/searchPatient/${encodeURIComponent(query)}`);
      patients.value = response.data;
    } catch (err) {
      error.value = err.message;
      console.error("Search error:", err);
      alert("Failed to search patients");
    } finally {
      loading.value = false;
    }
  };

  const addPatient = async (patientData) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.post("http://localhost:5000/addPatient", patientData);
      await fetchPatients(); // Refresh the list
    } catch (err) {
      error.value = err.message;
      console.error("Error adding patient:", err);
      alert("Failed to add patient");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePatient = async (id, patientData) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.put(`http://localhost:5000/editPatient/${id}`, patientData);
      await fetchPatients(); // Refresh the list
    } catch (err) {
      error.value = err.message;
      console.error("Error updating patient:", err);
      alert("Failed to update patient");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deletePatient = async (id) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`http://localhost:5000/deletePatient/${id}`);
      patients.value = patients.value.filter(p => p.Id !== id);
    } catch (err) {
      error.value = err.message;
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient");
    } finally {
      loading.value = false;
    }
  };

  return {
    patients,
    loading,
    error,
    fetchPatients,
    searchPatients,
    addPatient,
    updatePatient,
    deletePatient
  };
}