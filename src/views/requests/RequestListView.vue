<script setup lang="ts">
import { CalendarDays, ChevronLeft, ChevronRight, MoreHorizontal, Plus } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import RequestTable from '../../components/requests/RequestTable.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import { useAppStore } from '../../composables/useAppStore'

const router = useRouter()
const { state } = useAppStore()
const status = ref('All')
const priority = ref('All')
const filtered = computed(() => state.requests.filter((item) => (status.value === 'All' || item.status === status.value) && (priority.value === 'All' || item.priority === priority.value)))
</script>

<template>
  <section>
    <div class="page-heading"><div><h1>Maintenance Requests</h1><p>Create, review, and manage factory maintenance requests.</p></div><BaseButton :icon="Plus" @click="router.push('/requests/new')">Create Request</BaseButton></div>
    <div class="filter-bar">
      <select v-model="status" aria-label="Filter by status"><option>All</option><option>Submitted</option><option>Approved</option><option>Rejected</option></select>
      <select v-model="priority" aria-label="Filter by priority"><option>All</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
      <button class="date-filter"><CalendarDays :size="18" /> Date Range</button>
    </div>
    <section class="card table-card">
      <header class="card__header"><h2>Recent Requests</h2><button class="icon-button" aria-label="More options"><MoreHorizontal /></button></header>
      <RequestTable :requests="filtered" />
      <footer class="table-footer"><span>Showing <strong>1-{{ filtered.length }}</strong> of <strong>{{ filtered.length }}</strong></span><div><button disabled aria-label="Previous page"><ChevronLeft /></button><button aria-label="Next page"><ChevronRight /></button></div></footer>
    </section>
  </section>
</template>
