<script setup lang="ts">
import { ChevronLeft, ChevronRight, Plus, Search, X } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import { useAppStore } from '../../composables/useAppStore'
import type { UserRole, UserStatus } from '../../types'

const router = useRouter()
const { state, createUser } = useAppStore()
const query = ref('')
const role = ref('All')
const status = ref('All')
const filtered = computed(() => state.users.filter((user) => (role.value === 'All' || user.role === role.value) && (status.value === 'All' || user.status === status.value) && `${user.name} ${user.email}`.toLowerCase().includes(query.value.toLowerCase())))

const showModal = ref(false)
const submitting = ref(false)
const formError = ref('')
const form = reactive<{ name: string; email: string; password: string; role: UserRole; status: UserStatus }>({ name: '', email: '', password: '', role: 'Operator', status: 'Active' })

function openModal() {
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = 'Operator'
  form.status = 'Active'
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  if (submitting.value) return
  showModal.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (showModal.value && event.key === 'Escape') closeModal()
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

async function submit() {
  formError.value = ''
  submitting.value = true
  try {
    await createUser({ name: form.name, email: form.email, password: form.password, role: form.role, status: form.status })
    showModal.value = false
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Failed to create user'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <div class="page-heading"><div><h1>User Management</h1><p>Manage system users and access levels.</p></div><BaseButton :icon="Plus" @click="openModal">Add User</BaseButton></div>
    <section class="card table-card users-card">
      <div class="user-filters"><label class="input-with-icon"><Search :size="19" /><input v-model="query" type="search" placeholder="Search users by name or email..." /></label><div><select v-model="role"><option>All</option><option>Admin</option><option>Supervisor</option><option>Operator</option></select><select v-model="status"><option>All</option><option>Active</option><option>Inactive</option></select></div></div>
      <div class="table-scroll"><table class="data-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Created At</th><th>Actions</th></tr></thead><tbody><tr v-for="user in filtered" :key="user.id"><td><span class="user-cell"><span class="avatar avatar--small" :style="{ background: user.avatarColor }">{{ user.initials }}</span><strong>{{ user.name }}</strong></span></td><td>{{ user.email }}</td><td><StatusBadge :label="user.role" /></td><td><StatusBadge :label="user.status" /></td><td>{{ user.createdAt }}</td><td><button class="table-link action-link" @click="router.push(`/users/${user.id}/edit`)">Edit</button></td></tr></tbody></table></div>
      <footer class="table-footer"><span>Showing 1 to {{ filtered.length }} of {{ filtered.length }} entries</span><div><button disabled><ChevronLeft /></button><button><ChevronRight /></button></div></footer>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="modal-backdrop" role="presentation" @click.self="closeModal">
          <section class="modal-card modal-card--form" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
            <button class="modal-card__close" aria-label="Close dialog" @click="closeModal"><X :size="18" /></button>
            <div class="modal-card__heading">
              <h2 id="add-user-title">Add New User</h2>
            </div>
            <form @submit.prevent="submit">
              <p v-if="formError" class="form-error">{{ formError }}</p>
              <div class="field"><span>Full Name</span><input v-model.trim="form.name" required minlength="2" maxlength="120" placeholder="Enter full name" /></div>
              <div class="field"><span>Email Address</span><input v-model.trim="form.email" type="email" required maxlength="180" placeholder="user@example.com" /></div>
              <div class="field"><span>Password</span><input v-model.trim="form.password" type="password" required minlength="8" maxlength="72" placeholder="Minimum 8 characters" /></div>
              <div class="form-grid">
                <label class="field"><span>System Role</span><select v-model="form.role"><option>Admin</option><option>Supervisor</option><option>Operator</option></select></label>
                <label class="field"><span>Account Status</span><button type="button" class="toggle-field" @click="form.status = form.status === 'Active' ? 'Inactive' : 'Active'"><span class="toggle" :class="{ active: form.status === 'Active' }"><i /></span>{{ form.status }}</button></label>
              </div>
              <div class="modal-card__actions">
                <BaseButton variant="secondary" :disabled="submitting" @click="closeModal">Cancel</BaseButton>
                <BaseButton type="submit" :disabled="submitting">{{ submitting ? 'Saving...' : 'Create User' }}</BaseButton>
              </div>
            </form>
          </section>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
