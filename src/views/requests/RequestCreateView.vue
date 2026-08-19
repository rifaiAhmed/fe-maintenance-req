<script setup lang="ts">
import { Search } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import { useAppStore } from '../../composables/useAppStore'
import type { RequestPriority } from '../../types'

const router = useRouter()
const { addRequest } = useAppStore()
const machineId = ref('')
const problem = ref('')
const priority = ref<RequestPriority>('Medium')
const priorities: RequestPriority[] = ['Low', 'Medium', 'High', 'Critical']
const submitting = ref(false)
const error = ref('')
async function submit() {
  submitting.value = true
  error.value = ''
  try { const request = await addRequest({ machineId: machineId.value, problem: problem.value, priority: priority.value }); await router.push(`/requests/${request.id}`) }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Unable to create request' }
  finally { submitting.value = false }
}
</script>

<template>
  <section class="form-page">
    <div class="page-heading"><div><h1>Create Maintenance Request</h1><p>Report a machine or equipment problem for review.</p></div></div>
    <form class="card request-form" @submit.prevent="submit">
      <label class="field"><span>Machine / Asset ID <b>*</b></span><span class="input-with-icon"><Search :size="19" /><input v-model.trim="machineId" placeholder="Search or enter Asset ID (e.g., MCH-402)" required /></span><small>Select the specific equipment requiring attention.</small></label>
      <label class="field"><span>Problem Description <b>*</b></span><textarea v-model.trim="problem" maxlength="500" placeholder="Describe the issue, symptoms, and any error codes..." required /><small class="field__helper">Be as detailed as possible to assist technicians.<em>{{ problem.length }}/500</em></small></label>
      <fieldset class="priority-picker"><legend>Priority Level <b>*</b></legend><div><label v-for="item in priorities" :key="item" :class="{ selected: priority === item }"><input v-model="priority" type="radio" :value="item" />{{ item }}</label></div></fieldset>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="form-actions"><BaseButton variant="secondary" @click="router.push('/requests')">Cancel</BaseButton><BaseButton type="submit" :disabled="submitting">{{ submitting ? 'Submitting...' : 'Submit Request' }}</BaseButton></div>
    </form>
  </section>
</template>
