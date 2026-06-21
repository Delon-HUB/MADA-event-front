import { secureAPI } from '@/instances/axios'
import type { IRegion } from '@/interfaces/IRegion'
import { defineStore } from 'pinia'

export const useRegionStore = defineStore('region', () => {
  const searchByName = async (name: string) => {
    const response = await secureAPI.get(`/region/search?name=${name}`)
    return response.data as IRegion[]
  }

  const searchById = async (id: string) => {
    const response = await secureAPI.get(`/region/${id}`)
    const data = response.data as IRegion | null
    return data
  }

  return { searchByName, searchById }
})
