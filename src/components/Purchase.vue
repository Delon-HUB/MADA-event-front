<template>
  <div class="q-pa-md">
    <q-dialog v-model="model" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section>
          <q-header class="positif-color">
            <q-toolbar>
              <q-btn class="text-bold" flat no-caps icon="payments">Achat de billet</q-btn>
              <q-space />
              <q-btn flat v-close-popup round dense icon="cancel" />
            </q-toolbar>
          </q-header>
        </q-card-section>
        <q-card-section>
          <p class="text-bold text-center">Nombre de billet</p>
          <q-item class="q-pt-none">
            <q-item-section class="text-bold">
              <q-item-label>Enfants(3-12 ans) </q-item-label>
              <q-item-label caption> 2.000ar </q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section class="text-bold">
              <q-item-label>
                <q-input type="number" outlined v-model="ticket.price" min="0" />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-bold">
              <q-item-label>Adulte(+18 ans) </q-item-label>
              <q-item-label caption> 3.000ar </q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section class="text-bold">
              <q-item-label>
                <q-input type="number" outlined v-model="ticket.price" min="0" />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-bold">
              <q-item-label>Senior(+60 ans) </q-item-label>
              <q-item-label caption> 5.000ar </q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section class="text-bold">
              <q-item-label>
                <q-input type="number" outlined v-model="ticket.price" min="0" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <div class="fit row wrap justify-center items-start content-start">
          <p style="width: 70%">
            <q-separator color="grey" />
          </p>
        </div>
        <q-card-section class="text-center q-pa-none">
          <p>
            <span class="text-bold">Paiement</span><br /><span
              >Choisissez votre opérateur mobile, puis entrer votre numéro de téléphone</span
            >
          </p>
          <q-tabs no-caps v-model="tab" indicator-color="grey" class="full-width">
            <q-tab name="mvola"
              ><q-img
                src="https://wiya.info/media/cache/resolve/logo_img/uploads/images/sellers/wiya-logo-mvola-66390b305746c359318575.png"
            /></q-tab>
            <q-tab name="airtel-money"
              ><q-img src="https://univ-utb.com/wp-content/uploads/2016/10/AIRTELLOGO.png" />
            </q-tab>
            <q-tab name="orange-money">
              <q-img
                src="https://images.seeklogo.com/logo-png/44/1/orange-money-logo-png_seeklogo-440383.png"
            /></q-tab>
          </q-tabs>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="mvola">
              <q-input
                fill-mask="x"
                class="bg-white"
                mask="xxx xx xxx xx"
                outlined
                v-model="tel"
                type="tel"
              />
            </q-tab-panel>

            <q-tab-panel name="airtel-money">
              <q-input
                fill-mask="x"
                class="bg-white"
                mask="xxx xx xxx xx"
                outlined
                v-model="tel"
                type="tel"
              />
            </q-tab-panel>

            <q-tab-panel name="orange-money">
              <q-input
                fill-mask="x"
                class="bg-white"
                mask="xxx xx xxx xx"
                outlined
                v-model="tel"
                type="tel"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline color="dark" no-caps label="Annuler" v-close-popup />
          <q-btn outline color="green" no-caps label="Confirmer" @click="buy" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IEvent } from '@/interfaces/IEvent'
import { type ITicket } from '@/interfaces/ITicket'
import { useEventStore } from '@/stores/Event.store'
import { ref } from 'vue'

const loading = ref<boolean>(false)
const $eventStore = useEventStore()

const model = defineModel<boolean>()
const props = defineProps<{ event: Partial<IEvent> }>()
const tel = ref<string>()
const tab = ref<string>('mvola')

const ticket = ref<Partial<ITicket>>({})

const buy = async () => {
  loading.value = true
  const response = await $eventStore.buy({
    eventId: props.event._id!,
    method: tab.value,
    phoneNumber: tel.value,
    amount: props.event.price,
  })
  loading.value = false
  tel.value = ''
  model.value = false
}
</script>

<style scoped>
.positif-color {
  background-color: #14452f;
}
</style>
