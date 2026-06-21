<template>
  <q-page>
    <q-item bordered class="page text-black">
      <div class="text-h6 text-bold"><q-icon name="receipt" />Mes billets</div>
    </q-item>
    <q-list>
      <Ticket
        v-for="(payment, index) in $ticketStore.payments"
        :payment="payment"
        :key="payment._id?.concat(payment.status!)"
        :class="$q.screen.lt.md ? 'fit' : ''"
        :id="index"
        class="q-mx-xs"
      />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import Ticket from '@/components/Ticket.vue'
import { useTicketStore } from '@/stores/Ticket.store'

const $ticketStore = useTicketStore()
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}

.q-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
