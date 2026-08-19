<script setup lang="ts">
import { ChevronLeft, ChevronRight, Plus, Search } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import { useAppStore } from '../../composables/useAppStore'

const router = useRouter()
const { state } = useAppStore()
const query = ref('')
const role = ref('All')
const status = ref('All')
const filtered = computed(() => state.users.filter((user) => (role.value === 'All' || user.role === role.value) && (status.value === 'All' || user.status === status.value) && `${user.name} ${user.email}`.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <section>
    <div class="page-heading"><div><h1>User Management</h1><p>Manage system users and access levels.</p></div><BaseButton :icon="Plus">Add User</BaseButton></div>
    <section class="card table-card users-card">
      <div class="user-filters"><label class="input-with-icon"><Search :size="19" /><input v-model="query" type="search" placeholder="Search users by name or email..." /></label><div><select v-model="role"><option>All</option><option>Admin</option><option>Supervisor</option><option>Operator</option></select><select v-model="status"><option>All</option><option>Active</option><option>Inactive</option></select></div></div>
      <div class="table-scroll"><table class="data-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Created At</th><th>Actions</th></tr></thead><tbody><tr v-for="user in filtered" :key="user.id"><td><span class="user-cell"><span class="avatar avatar--small" :style="{ background: user.avatarColor }">{{ user.initials }}</span><strong>{{ user.name }}</strong></span></td><td>{{ user.email }}</td><td><StatusBadge :label="user.role" /></td><td><StatusBadge :label="user.status" /></td><td>{{ user.createdAt }}</td><td><button class="table-link action-link" @click="router.push(`/users/${user.id}/edit`)">Edit</button></td></tr></tbody></table></div>
      <footer class="table-footer"><span>Showing 1 to {{ filtered.length }} of {{ filtered.length }} entries</span><div><button disabled><ChevronLeft /></button><button><ChevronRight /></button></div></footer>
    </section>
  </section>
</template>
