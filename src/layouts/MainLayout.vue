<template>
  <q-layout container style="height: 100vh; background-color: #f1efe3">
    <q-page-container>
      <q-page class="q-pa-md">
        <Event v-for="i in 20" class="q-mb-xs" />
      </q-page>
    </q-page-container>

    <q-footer bordered class="footer">
      <q-toolbar>
        <q-space></q-space>
        <div class="toolbar" v-if="currentUser.role == ERole.CLIENT">
          <q-btn flat no-caps round dense icon="home" stack label="Découvrir" />
          <q-btn flat no-caps round dense icon="receipt" stack label="Réservation" />
          <q-btn flat no-caps round dense icon="notifications" stack label="Notification" />
          <q-btn
            flat
            no-caps
            round
            dense
            icon="person"
            stack
            label="Compte"
            @click="() => useAuthStore().logout()"
          />
        </div>
        <div class="toolbar" v-if="currentUser.role == ERole.ORGANIZER">
          <q-btn flat no-caps round dense icon="timeline" stack label="Statistique" />
          <q-btn flat no-caps round dense icon="event" stack label="Événement" />
          <q-btn flat no-caps round dense icon="notifications" stack label="Notification" />
          <q-btn
            flat
            no-caps
            round
            dense
            icon="person"
            stack
            label="Compte"
            @click="() => useAuthStore().logout()"
          />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import Event from '@/components/Event.vue'
import { ERole } from '@/enums/ERole'
import type { IUser } from '@/interfaces/IUser'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { useUserStore } from '@/stores/User.store'
import { onBeforeMount, ref } from 'vue'

let currentUser = ref<Partial<IUser>>({})
onBeforeMount(async () => {
  const $userStore = useUserStore()
  const user = (await $userStore.getMyInformation()).data as Partial<IUser>
  if (!user) router.push('/auth/login')
  currentUser.value = user
})
</script>
<style scoped>
@import url('https://fonts.cdnfonts.com/css/vtks-caveirada');

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
