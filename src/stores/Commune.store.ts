import { secureAPI } from '@/instances/axios'
import type { ICommune } from '@/interfaces/ICommune'
import { defineStore } from 'pinia'

export const useCommuneStore = defineStore('commune', () => {
  const searchByName = async (name: string) => {
    const response = await secureAPI.get(`/commune/search?name=${name}`)
    const result = response.data as ICommune[]
    return result
  }

  const searchById = async (id: string) => {
    const response = await secureAPI.get(`/commune/${id}`)
    const data = response.data as ICommune
    return data
  }

  return { searchByName, searchById }
})
