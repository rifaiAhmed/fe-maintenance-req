<script setup lang="ts">
import { LayoutDashboard, Plus, Settings, Users, Wrench, X } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '../../composables/useAppStore'
import BaseButton from '../ui/BaseButton.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { state } = useAppStore()
const navigation = computed(() => [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Maintenance Requests', to: '/requests', icon: Wrench },
  ...(state.currentUser.role === 'Admin' ? [{ label: 'Users', to: '/users', icon: Users }] : []),
  { label: 'Settings', to: '/settings', icon: Settings },
])
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--open': open }">
    <div class="brand">
      <div class="brand__mark"><Wrench :size="19" /></div>
      <div><strong>IndustrialOps</strong><span>Plant Floor Admin</span></div>
      <button class="sidebar__close" aria-label="Close navigation" @click="emit('close')"><X /></button>
    </div>
    <RouterLink to="/requests/new" class="sidebar__create" @click="emit('close')"><BaseButton :icon="Plus">New Request</BaseButton></RouterLink>
    <nav aria-label="Main navigation">
      <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" @click="emit('close')">
        <component :is="item.icon" :size="20" /><span>{{ item.label }}</span>
      </RouterLink>
    </nav>
    <RouterLink to="/requests/new" class="sidebar__create sidebar__create--bottom" @click="emit('close')"><BaseButton :icon="Plus">New Request</BaseButton></RouterLink>
  </aside>
  <div v-if="open" class="sidebar-overlay" @click="emit('close')" />
</template>
