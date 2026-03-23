import { ref } from 'vue';
import axios from 'axios';
import { supabase } from '../utils/supabase';

export function usePatients() {
  const patients = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchPatients = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Prefer secure backend proxy status but support direct Supabase fallback
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY) {
        const { data, error: supaError } = await supabase
          .from('patient')
          .select('*')
          .order('id', { ascending: true });

        if (supaError) throw supaError;
        patients.value = data.map((patient) => ({
          Id: patient.id,
          Name: patient.name,
          Last_Name: patient.last_name,
          Age: patient.age,
          Disease: patient.disease,
          Dat: patient.date || patient.dat,
          Gender: patient.gender || patient.Gender,
          Phone: patient.phone,
          Email: patient.email,
          Address: patient.address,
          Blood_Type: patient.blood_type,
          Allergies: patient.allergies,
          Emergency_Contact: patient.emergency_contact,
          Medical_History: patient.medical_history,
          Notes: patient.notes
        }));
      } else {
        const response = await axios.get("http://localhost:5000/getPatients");
        patients.value = response.data;
      }
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
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY) {
        const { data, error: supaError } = await supabase
          .from('patient')
          .select('*')
          .or(`name.ilike.%${query}%,last_name.ilike.%${query}%,disease.ilike.%${query}%,email.ilike.%${query}%`);

        if (supaError) throw supaError;
        patients.value = data.map((patient) => ({
          Id: patient.id,
          Name: patient.name,
          Last_Name: patient.last_name,
          Age: patient.age,
          Disease: patient.disease,
          Dat: patient.date || patient.dat,
          Gender: patient.gender || patient.Gender,
          Phone: patient.phone,
          Email: patient.email,
          Address: patient.address,
          Blood_Type: patient.blood_type,
          Allergies: patient.allergies,
          Emergency_Contact: patient.emergency_contact,
          Medical_History: patient.medical_history,
          Notes: patient.notes
        }));
      } else {
        const response = await axios.get(`http://localhost:5000/searchPatient/${encodeURIComponent(query)}`);
        patients.value = response.data;
      }
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
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY) {
        const { error: supaError } = await supabase
          .from('patient')
          .insert([{
            name: patientData.name,
            last_name: patientData.last_name,
            age: Number.parseInt(patientData.age),
            disease: patientData.disease,
            date: patientData.dat || patientData.date,
            gender: patientData.Gender || patientData.gender,
            phone: patientData.phone,
            email: patientData.email,
            address: patientData.address,
            blood_type: patientData.blood_type,
            allergies: patientData.allergies,
            emergency_contact: patientData.emergency_contact,
            medical_history: patientData.medical_history,
            notes: patientData.notes
          }]);
        if (supaError) throw supaError;
        console.log('✅ Patient added successfully to Supabase');
      } else {
        await axios.post("http://localhost:5001/addPatient", patientData);
      }
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
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY) {
        const { error: supaError } = await supabase
          .from('patient')
          .update({
            name: patientData.name,
            last_name: patientData.last_name,
            age: Number.parseInt(patientData.age),
            disease: patientData.disease,
            date: patientData.dat || patientData.date,
            gender: patientData.Gender || patientData.gender,
            phone: patientData.phone,
            email: patientData.email,
            address: patientData.address,
            blood_type: patientData.blood_type,
            allergies: patientData.allergies,
            emergency_contact: patientData.emergency_contact,
            medical_history: patientData.medical_history,
            notes: patientData.notes
          })
          .eq('id', Number.parseInt(id));
        if (supaError) throw supaError;
        console.log('✅ Patient updated successfully in Supabase');
      } else {
        await axios.put(`http://localhost:5001/editPatient/${id}`, patientData);
      }
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
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY) {
        const { error: supaError } = await supabase
          .from('patient')
          .delete()
          .eq('id', Number.parseInt(id));
        if (supaError) throw supaError;
        console.log('✅ Patient deleted successfully from Supabase');
        patients.value = patients.value.filter(p => p.Id !== id);
      } else {
        await axios.delete(`http://localhost:5001/deletePatient/${id}`);
        patients.value = patients.value.filter(p => p.Id !== id);
      }
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