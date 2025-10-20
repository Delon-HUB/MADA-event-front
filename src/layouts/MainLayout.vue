<template>
  <q-layout container style="height: 100vh">
    <q-page-container>
      <q-page class="q-pa-md">
        <Event v-for="i in 20" />
      </q-page>
    </q-page-container>

    <q-footer bordered class="footer">
      <q-toolbar>
        <q-space></q-space>
        <div class="toolbar" v-if="role == 'CLIENT'">
          <q-btn
            flat
            no-caps
            round
            dense
            icon="home"
            stack
            label="Découvrir"
            @click="() => (role = 'ORGANIZER')"
          />
          <q-btn flat no-caps round dense icon="receipt" stack label="Réservation" />
          <q-btn flat no-caps round dense icon="notifications" stack label="Notification" />
          <q-btn flat no-caps round dense icon="person" stack label="Compte" />
        </div>
        <div class="toolbar" v-else>
          <q-btn
            flat
            no-caps
            round
            dense
            icon="analytics"
            stack
            label="Statistique"
            @click="() => (role = 'CLIENT')"
          />
          <q-btn flat no-caps round dense icon="event" stack label="Événement" />
          <q-btn flat no-caps round dense icon="notifications" stack label="Notification" />
          <q-btn flat no-caps round dense icon="person" stack label="Compte" :to="'/auth/login'" />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import Event from '@/components/Event.vue'
import { ref } from 'vue'

const role = ref<'ORGANIZER' | 'CLIENT'>('CLIENT')
</script>
<style scoped>
@import url('https://fonts.cdnfonts.com/css/vtks-caveirada');

.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
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
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: #14452f;
  position: fixed;
  bottom: 0%;
}
</style>
