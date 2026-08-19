<script setup lang="ts">
import { ArrowLeft, LockKeyhole, Save } from '@lucide/vue'
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import { useAppStore } from '../../composables/useAppStore'

const route = useRoute()
const router = useRouter()
const { getRequest, updateRequest } = useAppStore()
const request = computed(() => getRequest(String(route.params.id)))
const form = reactive({ problem: request.value?.problem ?? '', technician: request.value?.technician ?? '', targetDate: request.value?.targetDate ?? '' })
async function submit() { if (request.value) { await updateRequest(request.value.id, { ...form }); await router.push(`/requests/${request.value.id}`) } }
</script>

<template>
  <section v-if="request" class="form-page form-page--wide">
    <RouterLink class="back-link" :to="`/requests/${request.id}`"><ArrowLeft :size="16" /> Back to Requests</RouterLink>
    <div class="page-heading"><div class="inline-heading"><h1>Edit Request</h1><code>{{ request.id }}</code></div><StatusBadge :label="request.status" icon /></div>
    <form class="card request-form edit-form" @submit.prevent="submit">
      <div class="form-grid"><label class="field"><span>Machine / Asset ID</span><span class="locked-input"><input :value="request.machineId" disabled /><LockKeyhole :size="16" /></span><small>Asset changes locked after approval.</small></label><label class="field"><span>Priority Level</span><span class="locked-input"><input :value="request.priority" disabled /><LockKeyhole :size="16" /></span></label></div>
      <label class="field form-section"><span>Problem Description</span><textarea v-model="form.problem" maxlength="500" required /></label>
      <div class="form-grid form-section"><label class="field"><span>Assigned Technician</span><select v-model="form.technician"><option>Sarah Jenkins (Hydraulics Spec.)</option><option>Michael Chen</option><option>Alex Morgan</option></select></label><label class="field"><span>Target Completion Date</span><input v-model="form.targetDate" type="date" /></label></div>
      <div class="form-actions"><BaseButton variant="secondary" @click="router.push(`/requests/${request.id}`)">Cancel</BaseButton><BaseButton type="submit" :icon="Save">Save Changes</BaseButton></div>
    </form>
  </section>
</template>
