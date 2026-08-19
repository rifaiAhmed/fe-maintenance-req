<script setup lang="ts">
import { CalendarDays, Check, Edit3, History, Info, Trash2, UserRound, X } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseModal from '../../components/ui/BaseModal.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import { useAppStore } from '../../composables/useAppStore'

const route = useRoute()
const router = useRouter()
const { state, getRequest, fetchRequest, reviewRequest, deleteRequest } = useAppStore()
const request = computed(() => getRequest(String(route.params.id)))
const canReview = computed(() => state.currentUser.role === 'Admin' || state.currentUser.role === 'Supervisor')
const canDelete = computed(() => state.currentUser.role === 'Admin')
const canEdit = computed(() => state.currentUser.role === 'Admin' || (request.value?.status === 'Submitted' && request.value.createdBy === state.currentUser.name))
const modal = ref<'approve' | 'reject' | 'delete' | null>(null)
onMounted(() => fetchRequest(String(route.params.id)))
async function confirmAction() {
  if (!request.value || !modal.value) return
  if (modal.value === 'delete') { await deleteRequest(request.value.id); await router.push('/requests') }
  else await reviewRequest(request.value.id, modal.value === 'approve' ? 'Approved' : 'Rejected')
  modal.value = null
}
</script>

<template>
  <section v-if="request">
    <div class="breadcrumbs"><RouterLink to="/requests">Requests</RouterLink><span>›</span><span>Details</span></div>
    <div class="detail-heading">
      <div><h1>{{ request.id }}</h1><StatusBadge :label="request.status" icon /><StatusBadge :label="request.priority" /></div>
      <div class="page-actions"><BaseButton v-if="canEdit" variant="secondary" :icon="Edit3" @click="router.push(`/requests/${request.id}/edit`)">Edit</BaseButton><BaseButton v-if="canReview" :icon="Check" :disabled="request.status === 'Approved'" @click="modal = 'approve'">Approve</BaseButton><BaseButton v-if="canReview" variant="secondary" :icon="X" :disabled="request.status === 'Rejected'" @click="modal = 'reject'">Reject</BaseButton><BaseButton v-if="canDelete" variant="danger" :icon="Trash2" @click="modal = 'delete'">Delete</BaseButton></div>
    </div>
    <div class="detail-grid">
      <div class="detail-grid__main">
        <section class="card detail-card"><header><Info :size="21" /><h2>Request Information</h2></header><div class="info-grid"><div><span>Machine ID</span><strong>{{ request.machineId }}</strong></div><div><span>Status</span><strong>{{ request.status }}</strong></div><div class="info-grid__wide"><span>Problem Description</span><p>{{ request.problem }}</p></div></div></section>
        <section class="card detail-card"><header><History :size="21" /><h2>Activity History</h2></header><ol class="timeline"><li v-for="activity in request.activities" :key="activity.id" :class="`timeline--${activity.type}`"><span class="timeline__dot"><Check v-if="activity.type === 'approved'" :size="13" /><X v-else-if="activity.type === 'rejected'" :size="13" /><span v-else>+</span></span><div><strong>{{ activity.title }}</strong><p>{{ activity.description }}</p><time>{{ activity.timestamp }}</time></div></li></ol></section>
      </div>
      <aside class="card metadata"><h2>Metadata</h2><div><span><UserRound :size="15" /> Created by</span><strong>{{ request.createdBy }}</strong></div><div><span><CalendarDays :size="15" /> Created at</span><strong>{{ request.createdAt }}</strong></div><div v-if="request.reviewedBy"><span><Check :size="15" /> Last reviewed by</span><strong>{{ request.reviewedBy }}</strong></div></aside>
    </div>
    <BaseModal :open="modal !== null" :tone="modal === 'delete' || modal === 'reject' ? 'danger' : 'primary'" :title="modal === 'delete' ? 'Delete Maintenance Request?' : `${modal === 'approve' ? 'Approve' : 'Reject'} Maintenance Request?`" :description="modal === 'delete' ? `Are you sure you want to delete ${request.id}? This action cannot be undone.` : `Are you sure you want to ${modal} ${request.id}? This will update the request status and activity history.`" :confirm-label="modal === 'delete' ? 'Delete' : `${modal === 'approve' ? 'Approve' : 'Reject'} Request`" @close="modal = null" @confirm="confirmAction" />
  </section>
  <section v-else class="empty-page"><h1>Request not found</h1><BaseButton @click="router.push('/requests')">Back to Requests</BaseButton></section>
</template>
