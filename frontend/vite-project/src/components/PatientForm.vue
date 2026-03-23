<template>
  <transition name="slide-fade">
    <div v-if="visible" class="form-card">
      <h2 class="form-heading">{{ editingPatientId ? 'Edit Patient' : 'New Patient' }}</h2>
      <div class="form-grid">
        <div class="input-group">
          <label>First Name <span class="required">*</span></label>
          <input v-model="formData.name" class="modern-input" placeholder="Name" @keyup.enter="handleSubmit">
          <div v-if="submitted && errors.name" class="error-msg">{{ errors.name }}</div>
        </div>

        <div class="input-group">
          <label>Last Name <span class="required">*</span></label>
          <input v-model="formData.last_name" class="modern-input" placeholder="Last Name" @keyup.enter="handleSubmit">
          <div v-if="submitted && errors.last_name" class="error-msg">{{ errors.last_name }}</div>
        </div>

        <div class="input-group">
          <label>Age <span class="required">*</span></label>
          <input v-model="formData.age" type="number" class="modern-input" placeholder="30" @keyup.enter="handleSubmit">
          <div v-if="submitted && errors.age" class="error-msg">{{ errors.age }}</div>
        </div>

        <div class="input-group">
          <label>Disease <span class="required">*</span></label>
          <input v-model="formData.disease" class="modern-input" placeholder="Disease" @keyup.enter="handleSubmit">
          <div v-if="submitted && errors.disease" class="error-msg">{{ errors.disease }}</div>
        </div>

        <div class="input-group">
          <label>Date <span class="required">*</span></label>
          <input v-model="formData.dat" type="date" class="modern-input" @keyup.enter="handleSubmit">
          <div v-if="submitted && errors.dat" class="error-msg">{{ errors.dat }}</div>
        </div>

        <div class="input-group">
          <label>Gender <span class="required">*</span></label>
          <select v-model="formData.Gender" class="modern-select">
            <option>Male</option>
            <option>Female</option>
          </select>
          <div v-if="submitted && errors.Gender" class="error-msg">{{ errors.Gender }}</div>
        </div>

        <div class="input-group">
          <label>Phone</label>
          <input v-model="formData.phone" class="modern-input" placeholder="Phone Number">
        </div>

        <div class="input-group">
          <label>Email</label>
          <input v-model="formData.email" type="email" class="modern-input" placeholder="Email Address">
        </div>

        <div class="input-group">
          <label>Address</label>
          <textarea v-model="formData.address" class="modern-input" placeholder="Address" rows="2"></textarea>
        </div>

        <div class="input-group">
          <label>Blood Type</label>
          <select v-model="formData.blood_type" class="modern-select">
            <option value="">Select Blood Type</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

        <div class="input-group">
          <label>Allergies</label>
          <textarea v-model="formData.allergies" class="modern-input" placeholder="Allergies" rows="2"></textarea>
        </div>

        <div class="input-group">
          <label>Emergency Contact</label>
          <input v-model="formData.emergency_contact" class="modern-input" placeholder="Emergency Contact">
        </div>

        <div class="input-group">
          <label>Medical History</label>
          <textarea v-model="formData.medical_history" class="modern-input" placeholder="Medical History" rows="3"></textarea>
        </div>

        <div class="input-group">
          <label>Notes</label>
          <textarea v-model="formData.notes" class="modern-input" placeholder="Additional Notes" rows="3"></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button class="action-btn primary" @click="handleSubmit">
          <i class="fas" :class="editingPatientId ? 'fa-save' : 'fa-plus'"></i>
          {{ editingPatientId ? 'Update' : 'Create' }}
        </button>
        <button class="action-btn secondary" @click="$emit('cancel')">
          <i class="fas fa-times"></i>
          Cancel
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { useFormValidation } from '../composables/useFormValidation.js';

export default {
  name: 'PatientForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingPatientId: {
      type: Number,
      default: null
    },
    initialData: {
      type: Object,
      default: () => ({
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
      })
    }
  },
  emits: ['submit', 'cancel'],
  setup() {
    const { errors, submitted, validatePatientForm, resetValidation } = useFormValidation();
    return {
      errors,
      submitted,
      validatePatientForm,
      resetValidation
    };
  },
  data() {
    return {
      formData: { ...this.initialData }
    };
  },
  watch: {
    initialData: {
      handler(newData) {
        this.formData = { ...newData };
        this.resetValidation();
      },
      deep: true
    }
  },
  methods: {
    handleSubmit() {
      if (!this.validatePatientForm(this.formData)) return;
      this.$emit('submit', this.formData);
    }
  }
};
</script>