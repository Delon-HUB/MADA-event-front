<template>
  <q-card bordered flat class="card">
    <q-card-section class="text-center">
      <div class="page-title text-h5 text-bold q-mb-lg">S'authentifier</div>
      <q-form>
        <q-input
          color="green"
          class="q-mb-md"
          outlined
          rounded
          v-model="userCredential.email"
          type="email"
          label="Votre email"
          :rules="[
            () =>
              /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(
                userCredential.email || '',
              ) || 'Veuillez entrer une adresse e-mail valide',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
        <q-input
          color="green"
          rounded
          outlined
          type="password"
          v-model="userCredential.password"
          label="Votre mot de passe"
        >
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
        </q-input>

        <div class="row">
          <div class="col">
            <q-checkbox v-model="forgiveMe" label="se souvenir de moi" color="teal" />
          </div>
          <div class="col">
            <q-btn no-caps flat class="text-red" label="Mot de passe oublié" />
          </div>
        </div>
        <div class="q-my-md">
          <q-btn
            style="width: 100%; background-color: #14452f"
            size="1.2em"
            no-caps
            flat
            rounded
            class="text-white text-bold"
            v-on:click="loginHandler(userCredential)"
            :loading="loading"
            :disable="!canSend"
            >Se connecter</q-btn
          >
        </div>
        <div>
          Vous n'avez pas de compte ?
          <span
            ><q-btn
              :to="{ path: '/auth/register' }"
              no-caps
              flat
              class="text-red"
              label="Créer un compte"
          /></span>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { EOTPOrigin } from '@/enums/EOTPOrigin'
import type { IUser } from '@/interfaces/IUser'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { computed, reactive, ref } from 'vue'

const canSend = computed(() =>
  /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(userCredential.email || ''),
)
const loading = ref<boolean>(false)
const userCredential = reactive<Partial<IUser>>({
  email: '',
  password: '',
})
const forgiveMe = ref<boolean>(false)

const $authStore = useAuthStore()
const loginHandler = async (userCredential: Partial<IUser>) => {
  loading.value = true
  try {
    const { accessToken, verified } = await (await $authStore.login(userCredential)).data
    $authStore.setEmail(userCredential.email!.trim())
    $authStore.setToken(accessToken)
    if (verified) router.push({ path: '/' })
    else router.push({ path: '/auth/verify-identity', query: { from: EOTPOrigin.LOGIN } })
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}
</script>
