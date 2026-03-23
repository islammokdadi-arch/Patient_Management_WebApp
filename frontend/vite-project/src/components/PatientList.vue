<template>
  <transition name="slide-fade">
    <div v-if="visible" class="list-container">
      <div class="search-bar">
        <div class="search-wrapper">
          <i class="fas fa-search"></i>
          <input v-model="searchQuery" type="text" class="search-input" placeholder="Search patients..." @input="handleSearch">
          <button class="clear-btn" @click="clearSearch" v-if="searchQuery">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="patients-grid">
        <div v-for="patient in patients" :key="patient.Id" class="patient-card"
             @click="handlePatientClick(patient)"
             @touchstart="handleTouchStart"
             @touchend="handleTouchEnd(patient)"
             :class="{ 'card-pressed': pressedCard === patient.Id }">
          <div class="card-glow"></div>
          <div class="card-header">
            <div class="patient-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="patient-info-compact">
              <h3 class="patient-name">{{ patient.Name }} {{ patient.Last_Name }}</h3>
              <div class="patient-details">
                <span class="detail-chip">
                  <i class="fas fa-birthday-cake"></i>
                  {{ patient.Age }} yrs
                </span>
                <span class="detail-chip">
                  <i class="fas fa-stethoscope"></i>
                  {{ patient.Disease }}
                </span>
                <span class="detail-chip">
                  <i class="fas fa-calendar-alt"></i>
                  {{ formatDate(patient.Dat) }}
                </span>
              </div>
            </div>
            <div class="card-actions">
              <button class="icon-btn edit" @click.stop="handleEditPatient(patient)" title="Edit" aria-label="Edit patient">
                <i class="fas fa-pen"></i>
              </button>
            </div>
          </div>
          <div class="card-footer">
            <span class="view-more">Tap to view full details</span>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PatientList',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    patients: {
      type: Array,
      default: () => []
    }
  },
  emits: ['view-patient', 'edit-patient', 'search'],
  data() {
    return {
      searchQuery: '',
      debounceTimeout: null,
      pressedCard: null,
      touchStartTime: null,
      isMobile: false
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    handleSearch() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$emit('search', this.searchQuery.trim());
      }, 300);
    },
    clearSearch() {
      this.searchQuery = '';
      this.$emit('search', '');
    },
    handlePatientClick(patient) {
      if (!this.isMobile) {
        this.$emit('view-patient', patient);
      }
    },
    handleTouchStart() {
      if (this.isMobile) {
        this.touchStartTime = Date.now();
      }
    },
    handleTouchEnd(patient) {
      if (this.isMobile && this.touchStartTime) {
        const touchDuration = Date.now() - this.touchStartTime;
        if (touchDuration < 300) { // Short tap
          this.pressedCard = patient.Id;
          setTimeout(() => {
            this.pressedCard = null;
            this.$emit('view-patient', patient);
          }, 100);
        }
        this.touchStartTime = null;
      }
    },
    handleEditPatient(patient) {
      this.$emit('edit-patient', patient);
    }
  }
};
</script>