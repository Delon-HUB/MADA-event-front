<template>
  <q-card bordered flat class="card" style="max-width: 600px">
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
                newUser.role = ERole.ORGANIZER
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
                newUser.role = ERole.CLIENT
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
          v-model="newUser.firstName"
          type="text"
          label="Nom "
          :rules="[
            () =>
              /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(newUser.firstName || '') ||
              'Veuillez entrer un nom valide',
          ]"
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
          v-model="newUser.lastName"
          type="text"
          label="Prénom"
          :rules="[
            () =>
              /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(newUser.lastName || '') ||
              'Veuillez entrer un prénom valide',
          ]"
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
          v-model="newUser.email"
          type="email"
          label="Votre email"
          :rules="[
            () =>
              /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(newUser.email || '') ||
              'Veuillez entrer une adresse e-mail valide',
          ]"
          lazy-rules
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
          v-model="newUser.password"
          label="Mot de passe"
          :rules="[
            () =>
              (!!newUser.password?.trim() && newUser.password.trim().length >= 8) ||
              'mot de passe trop court',
          ]"
          lazy-rules
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
          :rules="[
            () =>
              newUser.password?.trim() == confirmPassword.trim() ||
              'le mot de passe ne correspond pas',
          ]"
          lazy-rules
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
            :disable="!canSend"
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
import { EOTPOrigin } from '@/enums/EOTPOrigin'
import { ERole } from '@/enums/ERole'
import type { IUser } from '@/interfaces/IUser'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { computed, reactive, ref } from 'vue'

const step = ref<number>(1)
const loading = ref<boolean>(false)

const $authStore = useAuthStore()
const newUser = reactive<Partial<IUser>>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: ERole.CLIENT,
})
const confirmPassword = ref<string>('')
const acceptTermsConditions = ref<boolean>(false)

const canSend = computed(
  () =>
    /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(newUser.firstName || '') &&
    /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(newUser.lastName || '') &&
    /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(newUser.email || '') &&
    newUser.password?.trim() &&
    newUser.password.trim().length >= 8 &&
    newUser.password.trim() === confirmPassword.value.trim() &&
    acceptTermsConditions.value,
)

const registerHandler = async () => {
  loading.value = true
  try {
    await $authStore.register(newUser)
    $authStore.setEmail(newUser.email!.trim())
    router.push({ path: '/auth/verify-identity', query: { from: EOTPOrigin.REGISTER } })
  } catch (error) {
    console.error(error)
  }
  loading.value = false
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
