<script setup lang="ts">
import { CircleCheck, CircleX, Clock3 } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{ label: string; icon?: boolean }>()
const normalized = computed(() => props.label.toLowerCase())
const badgeIcon = computed(() => normalized.value === 'approved' ? CircleCheck : normalized.value === 'rejected' ? CircleX : Clock3)
</script>

<template>
  <span class="badge" :class="`badge--${normalized}`">
    <component :is="badgeIcon" v-if="icon" :size="13" aria-hidden="true" />
    {{ label }}
  </span>
</template>
