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
        <div class="toolbar" v-if="currentUser.role == ERole.CLIENT">
          <q-btn flat no-caps dense icon="home" stack label="Découvrir" :to="'/client/home'" />
          <q-btn
            flat
            no-caps
            dense
            icon="receipt"
            stack
            label="Mes billets"
            :to="'/client/tickets'"
          />

          <q-btn flat no-caps dense icon="notifications" stack label="Notification"
            ><q-badge color="red" floating rounded transparent>3</q-badge></q-btn
          >
          <q-btn
            flat
            no-caps
            dense
            icon="person"
            stack
            label="Compte"
            @click="() => useAuthStore().logout()"
          />
        </div>
        <div class="toolbar" v-if="currentUser.role == ERole.ORGANIZER">
          <q-btn
            flat
            no-caps
            dense
            icon="timeline"
            stack
            label="Statistique"
            :to="'/organizer/dashboard'"
          />
          <q-btn
            flat
            no-caps
            dense
            icon="event"
            stack
            label="Mes événement"
            :to="'/organizer/event'"
          />
          <q-btn flat no-caps dense icon="notifications" stack label="Notification" />

          <q-btn-dropdown flat no-caps dense stack>
            <template v-slot:label> <q-icon name="menu" /> Menu</template>
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
import type { IUser } from '@/interfaces/IUser'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { useEventStore } from '@/stores/Event.store'
import { useUserStore } from '@/stores/User.store'
import { onBeforeMount, ref } from 'vue'

let currentUser = ref<Partial<IUser>>({})
onBeforeMount(async () => {
  const $userStore = useUserStore()
  await $userStore.init()
  if (!$userStore.currentUser) router.push('/auth/login')
  currentUser.value = $userStore.currentUser

  const $eventStore = useEventStore()
  await $eventStore.init()

  switch ($userStore.currentUser.role) {
    case ERole.CLIENT:
      router.push('/client')
      break
    case ERole.ORGANIZER:
      router.push('/organizer')
      break
  }
})
</script>
<style scoped>
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
  padding-top: 1em;
}

.icon-color {
  color: #14452f;
}

.title {
  font-family: 'vtks caveirada', sans-serif;
  background: white;
  -webkit-background-clip: text;
  font-style: italic;
}

.footer {
  background-color: #14452f;
  position: fixed;
  bottom: 0%;
}
</style>
