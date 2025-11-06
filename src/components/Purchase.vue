<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="model" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section class="text-center">
          <p>
            <span class="text-bold">Achat de billet</span><br /><span
              >Choisissez votre opérateur mobile, puis entrer votre numéro de téléphone</span
            >
          </p>
        </q-card-section>
        <q-card-section class="row">
          <q-tabs no-caps v-model="tab" indicator-color="positive">
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

        <q-card-section class="q-pt-none">
          <q-tab-panels v-model="tab" animated class="bg-teal">
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

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn outline color="dark" no-caps label="Annuler" v-close-popup />
          <q-btn outline color="green" no-caps label="Confirmer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<boolean>()
const tel = ref<string>()
const tab = ref<string>('mvola')
</script>
