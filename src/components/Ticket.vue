<template>
  <q-card>
    <q-card-section horizontal>
      <q-img class="col-5" src="http://10.18.94.33:5000/public/qrcode/ticket-1762444577525.png" />

      <q-card-section>
        <q-item-section class="text-bold">
          <q-item-label class="text-h6"> MAHALEO </q-item-label>
          <q-item-label overline class="text-bold">
            <q-icon name="calendar_month" />
            {{ new Date().toLocaleDateString() }}
          </q-item-label>
          <q-item-label> <q-icon name="payments" color="green" />prix: 5000ar </q-item-label>
          <q-item-label> <q-icon name="place" color="red" /> Fianarantsoa </q-item-label>
        </q-item-section>
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-space />
      <q-btn
        flat
        dense
        no-caps
        label="détails de l'événement"
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const expanded = ref(false)

const showPurchageForm = ref<boolean>(false)
</script>
