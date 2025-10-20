<template>
  <q-card bordered flat class="card">
    <q-card-section class="text-center">
      <div class="text-h6 text-bold q-mb-lg">S'authentifier</div>
      <q-form>
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
          color="green"
          rounded
          outlined
          type="password"
          v-model="password"
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
            v-on:click="loginHandler()"
            :loading="loading"
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
import { ref } from 'vue'

const loading = ref<boolean>(false)

const email = ref<string>('')
const password = ref<string>('')
const forgiveMe = ref<boolean>(false)

const loginHandler = () => {
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
</style>
