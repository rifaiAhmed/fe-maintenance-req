<script setup lang="ts">
import { AlertTriangle, CircleCheck, X } from '@lucide/vue'
import { onBeforeUnmount, onMounted } from 'vue'
import BaseButton from './BaseButton.vue'

const props = withDefaults(defineProps<{ open: boolean; title: string; description: string; confirmLabel: string; tone?: 'primary' | 'danger' }>(), { tone: 'primary' })
const emit = defineEmits<{ close: []; confirm: [] }>()

function onKeydown(event: KeyboardEvent) {
  if (props.open && event.key === 'Escape') emit('close')
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" role="presentation" @click.self="emit('close')">
        <section class="modal-card" role="alertdialog" aria-modal="true" :aria-labelledby="`${tone}-modal-title`">
          <button class="modal-card__close" aria-label="Close dialog" @click="emit('close')"><X :size="18" /></button>
          <div class="modal-card__heading">
            <AlertTriangle v-if="tone === 'danger'" class="text-danger" :size="23" />
            <CircleCheck v-else class="text-primary" :size="23" />
            <h2 :id="`${tone}-modal-title`">{{ title }}</h2>
          </div>
          <p>{{ description }}</p>
          <div class="modal-card__actions">
            <BaseButton variant="secondary" @click="emit('close')">Cancel</BaseButton>
            <BaseButton :variant="tone === 'danger' ? 'danger' : 'primary'" @click="emit('confirm')">{{ confirmLabel }}</BaseButton>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
