<script setup lang="ts">
import { Bell, Database, ShieldCheck } from '@lucide/vue'
</script>

<template>
  <section><div class="page-heading"><div><h1>Settings</h1><p>Configure workspace preferences and system defaults.</p></div></div><div class="settings-grid"><article class="card setting-card"><Bell /><div><h2>Notifications</h2><p>Configure email and in-app maintenance alerts.</p></div></article><article class="card setting-card"><ShieldCheck /><div><h2>Security</h2><p>Review session and authentication policies.</p></div></article><article class="card setting-card"><Database /><div><h2>Data & retention</h2><p>Manage audit logs and retention periods.</p></div></article></div></section>
</template>
