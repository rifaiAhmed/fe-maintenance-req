<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { MaintenanceRequest } from '../../types'
import StatusBadge from '../ui/StatusBadge.vue'

withDefaults(defineProps<{ requests: MaintenanceRequest[]; compact?: boolean }>(), { compact: false })
</script>

<template>
  <div class="table-scroll">
    <table class="data-table">
      <thead><tr><th>Request ID</th><th>Machine / Asset ID</th><th>Problem Description</th><th>Priority</th><th>Status</th><th v-if="compact">Created By</th><th>Created At</th><th>Action</th></tr></thead>
      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td><RouterLink class="table-link table-id" :to="`/requests/${request.id}`">{{ request.id }}</RouterLink></td>
          <td>{{ request.machineId }}</td>
          <td class="truncate-cell" :title="request.problem">{{ request.problem }}</td>
          <td><StatusBadge :label="request.priority" /></td>
          <td><StatusBadge :label="request.status" /></td>
          <td v-if="compact">{{ request.createdBy }}</td>
          <td>{{ request.createdAt }}</td>
          <td><RouterLink class="table-link" :to="`/requests/${request.id}`">{{ request.status === 'Submitted' ? 'Review' : 'View' }}</RouterLink></td>
        </tr>
        <tr v-if="requests.length === 0"><td :colspan="compact ? 8 : 7" class="empty-state">No requests match your filters.</td></tr>
      </tbody>
    </table>
  </div>
</template>
