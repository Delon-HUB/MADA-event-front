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
              <q-item-label caption>
                {{ addSeparatorNumber(props.event.price! * 0.5, 3, ' ') + 'Ar' }}
              </q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section class="text-bold">
              <q-item-label>
                <q-input color="green" type="number" outlined v-model="ticket.nbChild" min="0">
                  <template v-slot:prepend>
                    <q-btn
                      rounded
                      dense
                      flat
                      icon="remove"
                      color="grey"
                      class="bg-grey-3"
                      @click="
                        () =>
                          ticket.nbChild && ticket.nbChild > 0
                            ? ticket.nbChild--
                            : (ticket.nbChild = 0)
                      "
                    />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      rounded
                      dense
                      flat
                      icon="add"
                      color="green"
                      class="bg-light-green-1"
                      @click="
                        () =>
                          ticket.nbChild != undefined ? ticket.nbChild++ : (ticket.nbChild = 0)
                      "
                    /> </template
                ></q-input>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-bold">
              <q-item-label>Adulte(+18 ans) </q-item-label>
              <q-item-label caption>
                {{ addSeparatorNumber(props.event.price!, 3, ' ') + 'Ar' }}
              </q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section class="text-bold">
              <q-item-label>
                <q-input color="green" type="number" outlined v-model="ticket.nbAdult" min="0">
                  <template v-slot:prepend>
                    <q-btn
                      rounded
                      dense
                      flat
                      icon="remove"
                      color="grey"
                      class="bg-grey-3"
                      @click="
                        () =>
                          ticket.nbAdult && ticket.nbAdult > 0
                            ? ticket.nbAdult--
                            : (ticket.nbAdult = 0)
                      "
                    />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      rounded
                      dense
                      flat
                      icon="add"
                      color="green"
                      class="bg-light-green-1"
                      @click="
                        () =>
                          ticket.nbAdult != undefined ? ticket.nbAdult++ : (ticket.nbAdult = 0)
                      "
                    /> </template
                ></q-input>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-bold">
              <q-item-label>Senior(+60 ans) </q-item-label>
              <q-item-label caption>
                {{ addSeparatorNumber(props.event.price! * 0.8, 3, ' ') + 'Ar' }}
              </q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section class="text-bold">
              <q-item-label>
                <q-input color="green" type="number" outlined v-model="ticket.nbSenior" min="0">
                  <template v-slot:prepend>
                    <q-btn
                      rounded
                      dense
                      flat
                      icon="remove"
                      color="grey"
                      class="bg-grey-3"
                      @click="
                        () =>
                          ticket.nbSenior && ticket.nbSenior > 0
                            ? ticket.nbSenior--
                            : (ticket.nbSenior = 0)
                      "
                    />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      rounded
                      dense
                      flat
                      icon="add"
                      color="green"
                      class="bg-light-green-1"
                      @click="
                        () =>
                          ticket.nbSenior != undefined ? ticket.nbSenior++ : (ticket.nbSenior = 0)
                      "
                    /> </template
                ></q-input>
              </q-item-label>
            </q-item-section>
          </q-item>
          <p class="text-bold q-mx-md">
            Total = {{ addSeparatorNumber(totalPrice, 3, ' ') + ' Ar' }}
          </p>
        </q-card-section>
        <div class="fit row wrap justify-center items-start content-start q-mt-none">
          <p style="width: 70%">
            <q-separator color="black" />
          </p>
        </div>
        <q-card-section class="text-center q-pa-none">
          <p>
            <span class="text-bold">Paiement</span><br /><span
              >Choisissez votre opérateur mobile, puis entrer votre numéro de téléphone</span
            >
          </p>
          <q-tabs no-caps v-model="paymentMethode" indicator-color="positive" class="full-width">
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
          <q-tab-panels v-model="paymentMethode" animated>
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
          <q-btn
            outline
            color="green"
            no-caps
            label="Confirmer"
            :disable="!canSend"
            @click="buy"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IEvent } from '@/interfaces/IEvent'
import { type ITicket } from '@/interfaces/ITicket'
import { useTicketStore } from '@/stores/Ticket.store'
import { useUserStore } from '@/stores/User.store'
import { addSeparatorNumber } from '@/utils/utils'
import { ref, computed } from 'vue'

const loading = ref<boolean>(false)
const $userStore = useUserStore()
const $ticketStore = useTicketStore()

const model = defineModel<boolean>()
const props = defineProps<{ event: Partial<IEvent> }>()
const tel = ref<string>('')
const paymentMethode = ref<string>('mvola')

const ticket = ref<Partial<ITicket>>({
  userId: $userStore.currentUser!._id,
  eventId: props.event._id!,
  nbChild: 0,
  nbAdult: 0,
  nbSenior: 0,
})
const totalPrice = computed(
  () =>
    ticket.value.nbChild! * props.event.price! * 0.5 +
    ticket.value.nbAdult! * props.event.price! +
    ticket.value.nbSenior! * props.event.price! * 0.8,
)

const canSend = computed(
  () =>
    tel.value.trim().length > 0 &&
    (ticket.value.nbAdult! > 0 || ticket.value.nbChild! > 0 || ticket.value.nbSenior! > 0),
)

const buy = async () => {
  loading.value = true
  const response = await $ticketStore.createTicket(ticket.value, paymentMethode.value, tel.value)
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
