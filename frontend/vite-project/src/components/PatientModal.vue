<template>
  <transition name="modal">
    <div v-if="patient" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ patient.Name }} {{ patient.Last_Name }}</h2>
          <button class="close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Age:</label>
              <span>{{ patient.Age }}</span>
            </div>
            <div class="detail-item">
              <label>Gender:</label>
              <span>{{ patient.Gender }}</span>
            </div>
            <div class="detail-item">
              <label>Disease:</label>
              <span>{{ patient.Disease }}</span>
            </div>
            <div class="detail-item">
              <label>Date:</label>
              <span>{{ formatDate(patient.Dat) }}</span>
            </div>
            <div class="detail-item" v-if="patient.Phone">
              <label>Phone:</label>
              <span>{{ patient.Phone }}</span>
            </div>
            <div class="detail-item" v-if="patient.Email">
              <label>Email:</label>
              <span>{{ patient.Email }}</span>
            </div>
            <div class="detail-item" v-if="patient.Address">
              <label>Address:</label>
              <span>{{ patient.Address }}</span>
            </div>
            <div class="detail-item" v-if="patient.Blood_Type">
              <label>Blood Type:</label>
              <span>{{ patient.Blood_Type }}</span>
            </div>
            <div class="detail-item" v-if="patient.Allergies">
              <label>Allergies:</label>
              <span>{{ patient.Allergies }}</span>
            </div>
            <div class="detail-item" v-if="patient.Emergency_Contact">
              <label>Emergency Contact:</label>
              <span>{{ patient.Emergency_Contact }}</span>
            </div>
            <div class="detail-item" v-if="patient.Medical_History">
              <label>Medical History:</label>
              <span>{{ patient.Medical_History }}</span>
            </div>
            <div class="detail-item" v-if="patient.Notes">
              <label>Notes:</label>
              <span>{{ patient.Notes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PatientModal',
  props: {
    patient: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>