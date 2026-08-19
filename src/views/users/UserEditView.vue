<script setup lang="ts">
import { History } from '@lucide/vue'
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import { useAppStore } from '../../composables/useAppStore'
import type { UserRole, UserStatus } from '../../types'

const route = useRoute()
const router = useRouter()
const { getUser, updateUser } = useAppStore()
const user = computed(() => getUser(Number(route.params.id)))
const form = reactive<{ name: string; email: string; role: UserRole; status: UserStatus }>({ name: user.value?.name ?? '', email: user.value?.email ?? '', role: user.value?.role ?? 'Operator', status: user.value?.status ?? 'Active' })
async function submit() { if (user.value) { await updateUser(user.value.id, form); await router.push('/users') } }
</script>

<template>
  <section v-if="user" class="user-edit-page">
    <div class="breadcrumbs"><RouterLink to="/users">Users</RouterLink><span>›</span><span>Edit User</span></div>
    <div class="profile-heading"><span class="avatar avatar--large" :style="{ background: user.avatarColor }">{{ user.initials }}</span><div><h1>Edit {{ user.name }}</h1><p>Manage user details, roles, and system access.</p></div></div>
    <form class="card user-form" @submit.prevent="submit">
      <div class="form-grid"><label class="field"><span>Full Name</span><input v-model.trim="form.name" required /></label><label class="field"><span>Email Address</span><input v-model.trim="form.email" type="email" required /></label></div>
      <div class="form-grid form-section"><label class="field"><span>System Role</span><select v-model="form.role"><option>Admin</option><option>Supervisor</option><option>Operator</option></select><small>Determines access level across the platform.</small></label><label class="field"><span>Account Status</span><button type="button" class="toggle-field" @click="form.status = form.status === 'Active' ? 'Inactive' : 'Active'"><span class="toggle" :class="{ active: form.status === 'Active' }"><i /></span>{{ form.status }}</button></label></div>
      <div class="form-actions"><BaseButton variant="secondary" @click="router.push('/users')">Cancel</BaseButton><BaseButton type="submit">Update User</BaseButton></div>
    </form>
    <section class="card recent-activity"><h2>Recent Activity</h2><p><History :size="15" /> Logged in from IP 192.168.1.45 today at 08:14 AM</p><p><History :size="15" /> Approved Work Order #WO-8821 yesterday at 14:30 PM</p></section>
  </section>
</template>
