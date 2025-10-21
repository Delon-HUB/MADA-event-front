import { secureAPI } from '@/instances/axios'
import type { IUser } from '@/interfaces/IUser'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  let currentUser = reactive<Partial<IUser>>({})

  const init = async () => {
    const user = (await getMyInformation()).data as Partial<IUser>
    setCurrentUser(user)
  }

  const getMyInformation = async () => {
    const response = await secureAPI.get('/user/me')
    return response
  }

  const setCurrentUser = (_user: Partial<IUser>) => {
    currentUser = _user
    console.log(currentUser)
  }

  const getCurrentUser = () => {
    return currentUser
  }

  return { getMyInformation,getCurrentUser, init, setCurrentUser }
})
