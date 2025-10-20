<template>
  <q-card bordered flat class="card">
    <q-card-section class="text-center">
      <p class="text-h6 text-bold q-mb-lg">
        {{ step == 1 ? "S'inscrire en tant que" : 'Veuillez remplir ce formulaire' }}
      </p>
      <div v-if="step === 1">
        <p>
          <q-btn
            outline
            rounded
            no-caps
            label="organisateur"
            class="fit text-bold"
            @click="
              () => {
                role = 'ORGANIZER'
                step = 2
              }
            "
          />
        </p>
        <p>
          <q-btn
            outline
            rounded
            no-caps
            label="client"
            class="fit text-bold"
            @click="
              () => {
                role = 'CLIENT'
                step = 2
              }
            "
          />
        </p>
      </div>
      <div v-if="step === 2" class="scroll-input">
        <q-input
          color="green"
          class="q-mb-md"
          outlined
          rounded
          v-model="firstName"
          type="text"
          label="Nom "
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          color="green"
          class="q-mb-md"
          outlined
          rounded
          v-model="lastName"
          type="text"
          label="Prénom"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          color="green"
          class="q-mb-md"
          outlined
          rounded
          v-model="email"
          type="email"
          label="Votre email"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
        <q-input
          class="q-mb-md"
          color="green"
          rounded
          outlined
          type="password"
          v-model="password"
          label="Mot de passe"
        >
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
        </q-input>
        <q-input
          color="green"
          rounded
          outlined
          type="password"
          v-model="confirmPassword"
          label="Confirmer le mot de passe"
        >
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
        </q-input>

        <div class="flex">
          <q-checkbox v-model="acceptTermsConditions" color="teal">
            Accepter les <a href="#">terms</a> et <a href="#">conditions</a>
          </q-checkbox>
        </div>
        <div class="q-my-md">
          <q-btn
            style="width: 100%; background-color: #14452f"
            size="1.2em"
            no-caps
            flat
            rounded
            class="text-white text-bold"
            @click="registerHandler()"
            :loading="loading"
            label="Valider"
          />
        </div>
      </div>
      <div class="text-center">
        <q-separator color="gray" />
      </div>
      <div>
        Vous avez déjà un compte ?
        <span
          ><q-btn :to="{ path: '/auth/login' }" no-caps flat class="text-red" label="se connecter"
        /></span>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const step = ref<number>(1)
const loading = ref<boolean>(false)

const role = ref<'ORGANIZER' | 'CLIENT'>('ORGANIZER')
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const acceptTermsConditions = ref<boolean>(false)

const registerHandler = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2_000)
}
</script>

<style scoped>
.page-title {
  color: #14452f;
}

.scroll-input {
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
}
</style>
