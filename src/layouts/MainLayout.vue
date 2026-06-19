<template>
  <q-layout class="layout" container>
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer bordered class="footer">
      <q-toolbar>
        <q-space></q-space>
        <div class="toolbar">
          <q-btn
            flat
            no-caps
            dense
            :icon="userRole == ERole.CLIENT ? 'home' : 'timeline'"
            stack
            :label="userRole == ERole.CLIENT ? 'Découvrir' : 'Statistique'"
            :to="userRole == ERole.CLIENT ? '/client/home' : '/organizer/dashboard'"
          />
          <q-btn
            flat
            no-caps
            dense
            :icon="userRole == ERole.CLIENT ? 'receipt' : 'event'"
            stack
            :label="userRole == ERole.CLIENT ? 'Mes billets' : 'Mes événements'"
            :to="userRole == ERole.CLIENT ? '/client/tickets' : '/organizer/event'"
          />

          <q-btn
            flat
            no-caps
            dense
            icon="notifications"
            stack
            label="Notification"
            :to="userRole == ERole.CLIENT ? '/client/notifications' : '/organizer/notifications'"
            ><q-badge v-if="$notificationStore.unread" color="red" floating rounded transparent>{{
              $notificationStore.unread <= 9 ? $notificationStore.unread : '9+'
            }}</q-badge></q-btn
          >
          <q-btn-dropdown flat no-caps dense stack dropdown-icon="none" class="no-dropdown-icon">
            <template v-slot:label>
              <div class="column items-center">
                <q-icon name="menu" size="sm" />
                <div class="text-caption">Menu</div>
              </div>
            </template>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-avatar icon="person" color="#14452f"></q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Gérer mon compte</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator inset />

              <q-item clickable v-close-popup @click="() => useAuthStore().logout()">
                <q-item-section avatar>
                  <q-avatar icon="logout" color="#14452f"></q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Se déconnecter</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ERole } from '@/enums/ERole'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { useEventStore } from '@/stores/Event.store'
import { useNotificationStore } from '@/stores/Notification.store'
import { useTicketStore } from '@/stores/Ticket.store'
import { useUserStore } from '@/stores/User.store'
import { computed, onMounted } from 'vue'

const $userStore = useUserStore()
const $eventStore = useEventStore()
const $ticketStore = useTicketStore()
const $notificationStore = useNotificationStore()

const userRole = computed(() => $userStore.currentUser?.role)

onMounted(async () => {
  await $userStore.init()
  await $eventStore.init()
  await $ticketStore.init()
  await $notificationStore.init()

  if (!$userStore.currentUser) router.push('/auth/login')
  switch ($userStore.currentUser?.role) {
    case ERole.CLIENT:
      router.replace('/client/home')
      break
    case ERole.ORGANIZER:
      router.replace('/organizer/dashboard')
      break
  }
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

.footer {
  background-color: $positive;
  position: fixed;
  bottom: 0%;
}

.no-dropdown-icon :deep(.q-icon.q-btn-dropdown__arrow) {
  display: none !important;
  margin: 0 !important;
  width: 0 !important;
}
</style>
