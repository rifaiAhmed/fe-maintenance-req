<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import { useAppStore } from '../composables/useAppStore'

const menuOpen = ref(false)
const router = useRouter()
const { state, initialize } = useAppStore()
onMounted(async () => { try { await initialize() } catch { router.replace('/login') } })
</script>

<template>
  <div class="app-shell">
    <AppSidebar :open="menuOpen" @close="menuOpen = false" />
    <div class="app-shell__content">
      <AppHeader @menu="menuOpen = true" />
      <main class="page-container"><div v-if="state.loading" class="page-loader">Loading workspace...</div><RouterView v-else /></main>
    </div>
  </div>
</template>
