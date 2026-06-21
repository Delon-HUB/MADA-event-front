import { secureAPI } from '@/instances/axios'
import type { IQuarter } from '@/interfaces/IQuarter'
import { defineStore } from 'pinia'

export const useQuarterStore = defineStore('quarter', () => {
  const searchByName = async (name: string) => {
    const response = await secureAPI.get(`/quarter/search?name=${name}`)
    return response.data as IQuarter[]
  }

  const searchById = async (id: string) => {
    const response = await secureAPI.get(`/quarter/${id}`)
    const data = response.data as IQuarter
    return data
  }

  return { searchByName, searchById }
})
