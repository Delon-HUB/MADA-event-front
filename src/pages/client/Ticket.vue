<template>
  <q-page>
    <q-header bordered class="page header text-black">
      <div class="text-h6 text-bold"><q-icon name="receipt" />Mes billets</div>
    </q-header>
    <q-list>
      <Ticket v-for="ticket in $ticketStore.tickets" :ticket="ticket" class="q-ma-sm" />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import Ticket from '@/components/Ticket.vue'
import { useTicketStore } from '@/stores/Ticket.store'

const $ticketStore = useTicketStore()
$ticketStore.init()
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
