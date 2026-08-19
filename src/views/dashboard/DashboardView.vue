<script setup lang="ts">
import { CheckCircle2, CircleX, ClipboardList, Clock3, Download, Filter, MoreVertical, Plus } from '@lucide/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import RequestTable from '../../components/requests/RequestTable.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import { useAppStore } from '../../composables/useAppStore'

const router = useRouter()
const { state } = useAppStore()
const metrics = computed(() => [
  { label: 'Total Requests', value: state.dashboardCounts.total, trend: 'Live', tone: 'blue', icon: ClipboardList },
  { label: 'Submitted', value: state.dashboardCounts.submitted, trend: 'Live', tone: 'gray', icon: Clock3 },
  { label: 'Approved', value: state.dashboardCounts.approved, trend: 'Live', tone: 'green', icon: CheckCircle2 },
  { label: 'Rejected', value: state.dashboardCounts.rejected, trend: 'Live', tone: 'red', icon: CircleX },
])
</script>

<template>
  <section>
    <div class="page-heading"><div><h1>Dashboard</h1><p>Overview of maintenance requests and activity</p></div><div class="page-actions"><BaseButton variant="secondary" :icon="Download">Export Report</BaseButton><BaseButton :icon="Plus" @click="router.push('/requests/new')">Create Request</BaseButton></div></div>
    <div class="metric-grid">
      <article v-for="metric in metrics" :key="metric.label" class="metric-card" :class="`metric-card--${metric.tone}`">
        <div class="metric-card__top"><span class="metric-card__icon"><component :is="metric.icon" :size="21" /></span><span class="metric-card__trend">{{ metric.trend }}</span></div>
        <p>{{ metric.label }}</p><strong>{{ metric.value }}</strong>
      </article>
    </div>
    <section class="card table-card">
      <header class="card__header"><h2>Recent Maintenance Requests</h2><div><button class="icon-button" aria-label="Filter requests"><Filter :size="19" /></button><button class="icon-button" aria-label="More options"><MoreVertical :size="19" /></button></div></header>
      <RequestTable :requests="state.requests" compact />
      <RouterLink class="card__footer-link" to="/requests">View All Requests</RouterLink>
    </section>
  </section>
</template>
