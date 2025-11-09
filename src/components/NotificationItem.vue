<template>
  <q-item
    clickable
    v-ripple
    :to="$userStore.currentUser?.role == 'CLIENT' ? '/client/tickets' : ''"
  >
    <q-item-section avatar>
      <q-avatar>
        <q-icon
          v-if="$userStore.currentUser?.role == 'CLIENT'"
          name="receipts"
          size="32px"
          color="green"
        />
        <img v-else src="/home/delon/Images/Camera/dhsjaj.jpg" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ data.title }}</q-item-label>
      <q-item-label caption lines="3">
        {{ data.content }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top>{{ date }} </q-item-section>
  </q-item>
  <q-separator inset="item" />
</template>

<script setup lang="ts">
import type { INotification } from '@/interfaces/INotification'
import { useUserStore } from '@/stores/User.store'
import dayjs from 'dayjs'
import { ref } from 'vue'

dayjs.locale('fr')
const props = defineProps<{ data: INotification }>()
const $userStore = useUserStore()
const date = ref(dayjs(props.data.createdAt).fromNow())
setInterval(() => (date.value = dayjs(props.data.createdAt).fromNow()), 1000 * 60)
</script>
