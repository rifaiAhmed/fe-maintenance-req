<script setup lang="ts">
import { Bell, LogOut, Menu, Search } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../composables/useAppStore'

const emit = defineEmits<{ menu: [] }>()
const router = useRouter()
const { state, logout } = useAppStore()
async function signOut() { await logout(); await router.push('/login') }
</script>

<template>
  <header class="app-header">
    <button class="app-header__menu" aria-label="Open navigation" @click="emit('menu')"><Menu /></button>
    <label class="global-search">
      <Search :size="19" aria-hidden="true" />
      <span class="sr-only">Search system</span>
      <input type="search" placeholder="Search requests, users, assets..." />
    </label>
    <div class="app-header__actions">
      <button class="icon-button" aria-label="Notifications"><Bell :size="20" /><span class="notification-dot" /></button>
      <button class="avatar" :style="{ background: state.currentUser.avatarColor }" :title="state.currentUser.name">{{ state.currentUser.initials }}</button>
      <button class="icon-button" aria-label="Sign out" title="Sign out" @click="signOut"><LogOut :size="19" /></button>
    </div>
  </header>
</template>
