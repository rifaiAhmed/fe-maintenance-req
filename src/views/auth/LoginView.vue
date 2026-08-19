<script setup lang="ts">
import { Eye, EyeOff, Wrench } from '@lucide/vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../../components/ui/BaseButton.vue'
import { useAppStore } from '../../composables/useAppStore'

const route = useRoute()
const router = useRouter()
const { login } = useAppStore()
const email = ref('admin@industrialops.com')
const password = ref('Password123!')
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
async function submit() {
  loading.value = true
  error.value = ''
  try { await login(email.value, password.value); await router.push(String(route.query.redirect ?? '/dashboard')) }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Unable to sign in' }
  finally { loading.value = false }
}
</script>

<template>
  <main class="login-page">
    <section class="login-hero">
      <div class="login-hero__brand"><div class="brand__mark brand__mark--light"><Wrench :size="20" /></div><strong>IndustrialOps</strong></div>
      <div><h1>Maintenance Request Log</h1><p>Track, review, and manage factory maintenance requests with precision and control.</p></div>
      <Wrench class="login-hero__watermark" :size="110" />
    </section>
    <section class="login-panel">
      <form class="login-card" @submit.prevent="submit">
        <div class="login-card__heading"><h2>Sign In</h2><p>Enter your credentials to access the system.</p></div>
        <label class="field"><span>Email Address</span><input v-model="email" type="email" autocomplete="email" placeholder="name@company.com" required /></label>
        <label class="field"><span>Password</span><span class="password-input"><input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required /><button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="18" /><Eye v-else :size="18" /></button></span></label>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <div class="login-card__options"><label class="checkbox"><input v-model="remember" type="checkbox" /> Remember me</label><a href="#" @click.prevent>Forgot password?</a></div>
        <BaseButton type="submit" :disabled="loading">{{ loading ? 'Signing In...' : 'Sign In' }}</BaseButton>
      </form>
    </section>
  </main>
</template>
