<template>
  <q-page class="page">
    <q-header bordered class="page header">
      <q-toolbar>
        <q-toolbar-title class="text-black text-bold">
          <q-icon name="notifications" />Notifications</q-toolbar-title
        >
      </q-toolbar>
    </q-header>
    <q-card flat square>
      <q-list bordered>
        <notification-item
          v-if="$notificationStore.notifications.length > 0"
          :data="notif"
          v-for="notif in $notificationStore.notifications"
        />
        <p v-else class="text-center text-overline page">Vous n'avez pas de notification</p>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import NotificationItem from '@/components/NotificationItem.vue'
import { useNotificationStore } from '@/stores/Notification.store'

const $notificationStore = useNotificationStore()
$notificationStore.unread = 0
</script>

<style scoped>
.header {
  position: fixed;
  top: 0%;
}

.page {
  background-color: #f1efe3;
}
</style>
