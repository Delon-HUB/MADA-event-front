<template>
  <q-layout view="hHh Lpr lff" container class="layout">
    <q-header v-if="$q.screen.gt.md" reveal>
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="drawer = !drawer" />
        <q-toolbar-title class="text-bold">MADA-event</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="$q.screen.gt.md" v-model="drawer" show-if-above :breakpoint="700">
      <custom-header />
    </q-drawer>

    <q-footer v-else bordered class="q-pa-none">
      <custom-header />
    </q-footer>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import CustomHeader from '@/components/CustomHeader.vue'
import { useEventStore } from '@/stores/Event.store'
import { useNotificationStore } from '@/stores/Notification.store'
import { useTicketStore } from '@/stores/Ticket.store'
import { useUserStore } from '@/stores/User.store'
import { onMounted, ref } from 'vue'

const drawer = ref(false)

const $eventStore = useEventStore()
const $ticketStore = useTicketStore()
const $notificationStore = useNotificationStore()
const $userStore = useUserStore()

onMounted(async () => {
  await $userStore.init()
  await $eventStore.init()
  await $ticketStore.init()
  await $notificationStore.init()
})
</script>
<style scoped lang="scss">
@import url('https://fonts.cdnfonts.com/css/vtks-caveirada');
.layout {
  height: 100vh;
  background-color: #f1efe3;
}

.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.icon-color {
  color: $primary;
}

.title {
  font-family: 'vtks caveirada', sans-serif;
  background: white;
  -webkit-background-clip: text;
  font-style: italic;
}

.no-dropdown-icon :deep(.q-icon.q-btn-dropdown__arrow) {
  display: none !important;
  margin: 0 !important;
  width: 0 !important;
}
</style>
