<template>
  <q-list class="q-ma-none" :class="$q.screen.gt.md ? '' : 'flex justify-between'">
    <q-item
      v-for="m in menu"
      clickable
      :to="m.path"
      @click="() => (active = m.path)"
      :active="active == m.path"
      active-class="text-red"
      :class="$q.screen.lt.md ? 'flex column flex-center' : ''"
    >
      <q-item-section avatar top>
        <q-avatar :icon="m.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">{{ m.label }}</q-item-label>
      </q-item-section>
      <q-badge v-if="m.badge > 0" color="red" floating rounded transparent>{{
        m.badge <= 9 ? m.badge : '9+'
      }}</q-badge>
    </q-item>

    <q-item
      clickable
      @click="
        () => {
          useAuthStore().logout()
        }
      "
      :active="active == 'logout'"
      active-class="text-red"
      :class="$q.screen.lt.md ? 'flex column flex-center' : ''"
    >
      <q-item-section avatar top>
        <q-avatar icon="logout" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">Se déconnecté</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ERole } from '@/enums/ERole'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { useNotificationStore } from '@/stores/Notification.store'
import { useUserStore } from '@/stores/User.store'
import { computed, onMounted, ref, watch } from 'vue'

const $userStore = useUserStore()
const $notificationStore = useNotificationStore()

const userRole = computed(() => $userStore.currentUser?.role)
onMounted(async () => {
  await $userStore.init()
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

const menu = ref<{ label: string; icon: string; path: string; badge: number }[]>()
const active = ref<string>()
watch(
  () => userRole.value,
  (newRole) => {
    switch (newRole) {
      case ERole.CLIENT:
        {
          menu.value = [
            {
              icon: 'home',
              label: 'Découvrir',
              path: '/client/home',
              badge: 0,
            },
            {
              icon: 'receipt',
              label: 'Mes billets',
              path: '/client/tickets',
              badge: 0,
            },
            {
              icon: 'notifications',
              label: 'notifications',
              path: '/client/notifications',
              badge: $notificationStore.unread,
            },
          ]
          active.value = menu.value[0]?.path
        }
        break

      case ERole.ORGANIZER:
        {
          menu.value = [
            {
              icon: 'home',
              label: 'Statistique',
              path: '/organizer/dashboard',
              badge: 0,
            },
            {
              icon: 'event',
              label: 'Mes événements',
              path: '/organizer/event',
              badge: 0,
            },
            {
              icon: 'notifications',
              label: 'notifications',
              path: '/organizer/notifications',
              badge: $notificationStore.unread,
            },
          ]
          active.value = menu.value[0]?.path
        }
        break
    }
  },
)
</script>

<style scoped>
.q-item {
  padding: 0px;
}
</style>
