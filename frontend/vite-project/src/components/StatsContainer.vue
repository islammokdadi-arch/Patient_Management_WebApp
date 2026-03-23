<template>
  <div class="stats-container" v-if="visible">
    <div class="stats-grid">
      <!-- Today's Patients -->
      <div class="stat-card today-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ todaysCount }}</div>
          <div class="stat-label">Today's Patients</div>
          <div class="stat-trend" :class="{ 'positive': todaysCount > 0 }">
            <i class="fas" :class="todaysCount > 0 ? 'fa-arrow-up' : 'fa-minus'"></i>
            <span>{{ todaysCount > 0 ? 'Active Day' : 'No Patients Today' }}</span>
          </div>
        </div>
        <div class="stat-decoration">
          <div class="floating-dots">
            <div class="dot dot-1"></div>
            <div class="dot dot-2"></div>
            <div class="dot dot-3"></div>
          </div>
        </div>
      </div>

      <!-- Total Patients -->
      <div class="stat-card total-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalCount }}</div>
          <div class="stat-label">Total Patients</div>
          <div class="stat-trend growth">
            <i class="fas fa-chart-line"></i>
            <span>Growing Database</span>
          </div>
        </div>
        <div class="stat-decoration">
          <div class="progress-ring">
            <svg width="60" height="60">
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="currentColor"
                stroke-width="3"
                fill="none"
                :stroke-dasharray="`${progressValue}, 157`"
                class="progress-circle"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Weekly Growth -->
      <div class="stat-card growth-card">
        <div class="stat-icon">
          <i class="fas fa-chart-bar"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ weeklyGrowth }}%</div>
          <div class="stat-label">Weekly Growth</div>
          <div class="stat-trend" :class="{ 'positive': weeklyGrowth >= 0, 'negative': weeklyGrowth < 0 }">
            <i class="fas" :class="weeklyGrowth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
            <span>{{ weeklyGrowth >= 0 ? 'Increasing' : 'Decreasing' }}</span>
          </div>
        </div>
        <div class="stat-decoration">
          <div class="growth-bars">
            <div class="bar" v-for="i in 7" :key="i" :style="{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.1}s` }"></div>
          </div>
        </div>
      </div>

      <!-- Active Cases -->
      <div class="stat-card active-card">
        <div class="stat-icon">
          <i class="fas fa-stethoscope"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ activeCases }}</div>
          <div class="stat-label">Active Cases</div>
          <div class="stat-trend monitoring">
            <i class="fas fa-eye"></i>
            <span>Under Monitoring</span>
          </div>
        </div>
        <div class="stat-decoration">
          <div class="pulse-effect">
            <div class="pulse-circle pulse-1"></div>
            <div class="pulse-circle pulse-2"></div>
            <div class="pulse-circle pulse-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsContainer',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    patients: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    todaysCount() {
      const today = new Date().toISOString().split('T')[0];
      return this.patients.filter(patient => patient.Dat === today).length;
    },
    totalCount() {
      return this.patients.length;
    },
    weeklyGrowth() {
      // Simple calculation - in a real app, you'd compare with last week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      const thisWeek = this.patients.filter(patient => new Date(patient.Dat) >= weekAgo).length;
      const lastWeek = Math.max(0, this.totalCount - thisWeek);

      if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
      return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    },
    activeCases() {
      // For demo purposes, consider patients from last 30 days as active
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return this.patients.filter(patient => new Date(patient.Dat) >= thirtyDaysAgo).length;
    },
    progressValue() {
      // Progress based on some arbitrary goal (e.g., 100 patients)
      const goal = 100;
      return Math.min((this.totalCount / goal) * 157, 157);
    }
  }
};
</script>