<template>
  <div class="app-container" :class="{ 'dark-mode': darkMode }">
    <AppHeader
      :dark-mode="darkMode"
      :patient-count="patients.length"
      @add-patient="showAddForm"
      @show-patients="showPatientsList"
      @toggle-dark-mode="toggleDarkMode"
    />

    <main class="main-content">
      <!-- Mobile Navigation Breadcrumb -->
      <div class="mobile-nav-breadcrumb" v-if="isMobile">
        <span class="breadcrumb-item" :class="{ active: !showForm && !showPatients }">
          <i class="fas fa-home"></i>
          Dashboard
        </span>
        <span class="breadcrumb-separator" v-if="showForm || showPatients">></span>
        <span class="breadcrumb-item" :class="{ active: showForm }" v-if="showForm">
          <i class="fas fa-user-plus"></i>
          {{ editingPatientId ? 'Edit Patient' : 'Add Patient' }}
        </span>
        <span class="breadcrumb-item" :class="{ active: showPatients }" v-if="showPatients">
          <i class="fas fa-list-ul"></i>
          Patient List
        </span>
      </div>

      <!-- Stats Container - Always visible on main page -->
      <StatsContainer
        :patients="patients"
        :visible="!showForm && !showPatients"
      />

      <PatientForm
        :visible="showForm"
        :editing-patient-id="editingPatientId"
        :initial-data="formData"
        @submit="handleFormSubmit"
        @cancel="hideForm"
      />

      <PatientList
        :visible="showPatients"
        :patients="patients"
        @view-patient="viewPatient"
        @edit-patient="editPatient"
        @search="handleSearch"
      />

      <PatientModal
        :patient="selectedPatient"
        @close="closeModal"
      />
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import PatientForm from './components/PatientForm.vue';
import PatientList from './components/PatientList.vue';
import PatientModal from './components/PatientModal.vue';
import StatsContainer from './components/StatsContainer.vue';
import { usePatients } from './composables/usePatients.js';

export default {
  name: 'App',
  components: {
    AppHeader,
    PatientForm,
    PatientList,
    PatientModal,
    StatsContainer
  },
  setup() {
    const darkMode = ref(localStorage.getItem('darkMode') === 'true' || false);
    const showForm = ref(false);
    const showPatients = ref(false);
    const editingPatientId = ref(null);
    const selectedPatient = ref(null);
    const isMobile = ref(false);

    const formData = ref({
      name: "",
      last_name: "",
      age: null,
      disease: "",
      dat: "",
      Gender: "Male",
      phone: "",
      email: "",
      address: "",
      blood_type: "",
      allergies: "",
      emergency_contact: "",
      medical_history: "",
      notes: ""
    });

    const { patients, fetchPatients, searchPatients, addPatient, updatePatient } = usePatients();

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    onMounted(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
    });

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem('darkMode', darkMode.value);
    };

    const showAddForm = () => {
      resetForm();
      showForm.value = true;
      showPatients.value = false;
    };

    const showPatientsList = async () => {
      showPatients.value = true;
      showForm.value = false;
      await fetchPatients();
    };

    const hideForm = () => {
      showForm.value = false;
      editingPatientId.value = null;
    };

    const resetForm = () => {
      formData.value = {
        name: "",
        last_name: "",
        age: null,
        disease: "",
        dat: "",
        Gender: "Male",
        phone: "",
        email: "",
        address: "",
        blood_type: "",
        allergies: "",
        emergency_contact: "",
        medical_history: "",
        notes: ""
      };
      editingPatientId.value = null;
    };

    const handleFormSubmit = async (data) => {
      try {
        if (editingPatientId.value) {
          await updatePatient(editingPatientId.value, data);
        } else {
          await addPatient(data);
        }
        hideForm();
        await showPatientsList();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };

    const editPatient = (patient) => {
      formData.value = {
        name: patient.Name,
        last_name: patient.Last_Name,
        age: patient.Age,
        disease: patient.Disease,
        dat: patient.Dat,
        Gender: patient.Gender,
        phone: patient.Phone || "",
        email: patient.Email || "",
        address: patient.Address || "",
        blood_type: patient.Blood_Type || "",
        allergies: patient.Allergies || "",
        emergency_contact: patient.Emergency_Contact || "",
        medical_history: patient.Medical_History || "",
        notes: patient.Notes || ""
      };
      editingPatientId.value = patient.Id;
      showForm.value = true;
      showPatients.value = false;
      selectedPatient.value = null;
    };

    const viewPatient = (patient) => {
      selectedPatient.value = patient;
    };

    const closeModal = () => {
      selectedPatient.value = null;
    };

    const handleSearch = async (query) => {
      if (query.trim()) {
        await searchPatients(query.trim());
      } else {
        await fetchPatients();
      }
    };

    onMounted(() => {
      showPatientsList();
    });

    return {
      darkMode,
      showForm,
      showPatients,
      editingPatientId,
      selectedPatient,
      formData,
      patients,
      isMobile,
      toggleDarkMode,
      showAddForm,
      showPatientsList,
      hideForm,
      handleFormSubmit,
      editPatient,
      viewPatient,
      closeModal,
      handleSearch
    };
  }
};
</script>

<style>
@import './styles/main.css';
</style>