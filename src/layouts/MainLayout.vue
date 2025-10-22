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
          <q-btn
            flat
            no-caps
            round
            dense
            icon="home"
            stack
            label="Découvrir"
            :to="'/client/home'"
          />
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
          <q-btn
            flat
            no-caps
            round
            dense
            icon="timeline"
            stack
            label="Statistique"
            :to="'/organizer/dashboard'"
          />
          <q-btn
            flat
            no-caps
            round
            dense
            icon="event"
            stack
            label="Événement"
            :to="'/organizer/event'"
          />
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
  switch (user.role) {
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
