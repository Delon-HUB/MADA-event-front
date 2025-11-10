import { secureAPI } from '@/instances/axios'
import type { IUser } from '@/interfaces/IUser'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  let currentUser = ref<Partial<IUser>>()

  const init = async () => {
    const user = (await getMyInformation()).data as Partial<IUser>
    setCurrentUser(user)
  }

  const getMyInformation = async () => {
    const response = await secureAPI.post('/user/me')
    return response
  }

  const setCurrentUser = (_user: Partial<IUser>) => {
    currentUser.value = _user
  }

  const findUserById = async (id: string): Promise<IUser | null> => {
    const response = await secureAPI.post(`/user/userId`, { userId: id })
    return response.data as Promise<IUser | null>
  }

  return { getMyInformation, currentUser, init, setCurrentUser, findUserById }
})
