<template>
  <q-card flat>
    <q-card-section horizontal>
      <q-img class="col-5" :src="qrCode" />
      <q-card-section>
        <q-item-section class="text-bold">
          <q-item-label class="text-h6">
            {{ event.title }}
          </q-item-label>
          <q-item-label class="text-bold">
            <q-icon name="calendar_month" />
            {{ new Date(props.ticket.createdAt!).toLocaleDateString() }}
          </q-item-label>
          <q-item-label>
            <q-icon name="payments" color="green" /> prix: {{ event.price }} Ar
          </q-item-label>
          <q-item-label>
            <q-icon name="place" color="red" /> {{ event.location.split(',')[0] }}
          </q-item-label>
        </q-item-section>
      </q-card-section>
    </q-card-section>

    <q-separator />
    <q-card-actions>
      <q-btn icon="download" flat dense no-caps label="PDF" color="green" @click="generatePDF" />
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
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'
import type { ITicket } from '@/interfaces/ITicket'
import type { IEvent } from '@/interfaces/IEvent'
import jsPDF from 'jspdf'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const expanded = ref(false)
const props = defineProps<{ ticket: ITicket }>()

const event = reactive<IEvent>(props.ticket.eventId as IEvent)
const qrCode = ref<string>(`${import.meta.env.VITE_API_URL}/${props.ticket.qrCodeUrl}`)

const generatePDF = async () => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a6',
  })

  const img = await fetch(qrCode.value, {
    headers: {
      'ngrok-skip-browser-warning': '69420',
    },
  })

  const imgBlob = await img.blob()
  const fileReader = new FileReader()
  fileReader.readAsDataURL(imgBlob)
  fileReader.onloadend = async () => {
    pdf.addImage(fileReader.result as string, 'PNG', 20, 20, 250, 250)
    pdf.text(`Ticket pour l'événement ${event.title}`, 42, 270)
    pdf.text(`Le ${new Date(event.startDate).toLocaleString()}`, 42, 290)

    pdf.save(`Billet-${event.title}.pdf`)
  }
}
</script>
