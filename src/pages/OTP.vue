<template>
  <q-card bordered flat class="card" style="max-width: 600px">
    <q-card-section class="text-center">
      <div class="text-h6 text-bold q-mb-lg">Vérification d'identité</div>
      <div>
        <div>
          <p>
            Entrez le code reçu par e-mail pour continuer. Si vous ne le voyez pas, vérifiez vos
            spams ou réessayez plus tard.
          </p>
        </div>
        <p><o-t-p v-model="otp" :length="4" /></p>
        <div class="q-my-lg">
          <p>
            <q-btn
              style="width: 100%; background-color: #14452f"
              size="1.2em"
              no-caps
              flat
              rounded
              class="text-white text-bold"
              :loading="verifying"
              :disabled="otp.length < 4"
              @click="verifyOTP()"
              >Vérifier</q-btn
            >
          </p>
        </div>
        <div>
          Vous n'avez pas de reçu de code ?
          <span v-if="counter === 0"
            ><q-btn
              no-caps
              flat
              class="text-red"
              label="renvoyer"
              @click="resendOTP"
              :loading="resending"
            />
          </span>
          <span v-else style="color: red">
            {{ counter >= 60 ? `${Math.floor(counter / 60)}min ${counter % 60}s` : `${counter}s` }}
          </span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import OTP from '@/components/OTP.vue'
import { EOTPOrigin } from '@/enums/EOTPOrigin'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { ref } from 'vue'

const verifying = ref<boolean>(false)
const resending = ref<boolean>(false)

const counter = ref<number>(0)
const otp = ref<string>('')

const $authStore = useAuthStore()
const verifyOTP = async () => {
  verifying.value = true
  try {
    await $authStore.verifyOTP($authStore.email, otp.value)
    const from = router.currentRoute.value.query.from as EOTPOrigin
    redirectAferVerification(from)
  } catch (error) {
    console.error(error)
  }
  verifying.value = false
}

const resendOTP = async () => {
  resending.value = true
  try {
    await $authStore.resendOTP($authStore.email)
    counter.value = 90
    const interval = setInterval(() => {
      if (counter.value > 0) counter.value--
      else clearInterval(interval)
    }, 1000)
  } catch (error) {
    console.error(error)
  }
  resending.value = false
}

const redirectAferVerification = (from: EOTPOrigin) => {
  switch (from) {
    case EOTPOrigin.LOGIN:
      router.push({ path: '/' })
      break
    case EOTPOrigin.REGISTER:
      router.push({ path: '/auth/login' })
      break
    case EOTPOrigin.FORGOT_PASSWORD:
      router.push({ path: '/auth/change-password' })
      break
  }
}
</script>
