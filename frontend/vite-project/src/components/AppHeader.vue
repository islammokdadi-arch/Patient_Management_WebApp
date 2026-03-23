<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo-section">
          <img src="/src/assets/1744219640507.gif" alt="Medical Icon" class="gif">
          <div class="title-section">
            <h1 class="app-title">Advanced Patient Hub</h1>
            <p class="subtitle">Comprehensive Healthcare Management</p>
          </div>
        </div>
      </div>

      <!-- Mobile: Show stats below title, Desktop: Show in center -->
      <div class="header-center">
        <div class="stats-bar">
          <div class="stat-item">
            <i class="fas fa-users"></i>
            <span class="stat-text">{{ patientCount }} Patients</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-calendar-check"></i>
            <span class="stat-text">{{ new Date().toLocaleDateString() }}</span>
          </div>
        </div>
      </div>

      <div class="header-controls">
        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu" v-if="isMobile" aria-label="Toggle menu">
          <i class="fas fa-bars"></i>
        </button>

        <div class="actions-group" :class="{ 'mobile-menu-open': mobileMenuOpen && isMobile }">
          <button class="icon-btn circle" @click="handleAction('add-patient')" title="Add Patient" aria-label="Add new patient">
            <i class="fas fa-user-plus"></i>
            <span class="btn-label" v-if="isMobile">Add Patient</span>
          </button>
          <button class="icon-btn circle" @click="handleAction('show-patients')" title="Show Patients" aria-label="Show patient list">
            <i class="fas fa-list-ul"></i>
            <span class="btn-label" v-if="isMobile">Show Patients</span>
          </button>
        </div>

        <button class="icon-btn toggle" @click="$emit('toggle-dark-mode')"
                :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                :aria-label="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <i class="fas" :class="darkMode ? 'fa-sun' : 'fa-moon'"></i>
        </button>
      </div>
    </div>

    <!-- Mobile menu overlay -->
    <div v-if="mobileMenuOpen && isMobile" class="mobile-menu-overlay" @click="toggleMobileMenu"></div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    darkMode: {
      type: Boolean,
      default: false
    },
    patientCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mobileMenuOpen: false,
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
      if (!this.isMobile) {
        this.mobileMenuOpen = false;
      }
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    handleAction(action) {
      if (this.isMobile) {
        this.mobileMenuOpen = false;
      }
      this.$emit(action);
    }
  }
};
</script>