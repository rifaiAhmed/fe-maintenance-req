<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{ variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; icon?: Component; disabled?: boolean; type?: 'button' | 'submit' }>()
</script>

<template>
  <button :type="type ?? 'button'" class="button" :class="`button--${variant ?? 'primary'}`" :disabled="disabled">
    <component :is="icon" v-if="icon" :size="17" aria-hidden="true" />
    <slot />
  </button>
</template>
