import { secureAPI } from '@/instances/axios'
import type { IDistrict } from '@/interfaces/IDistrict'
import { defineStore } from 'pinia'

export const useDistrictStore = defineStore('district', () => {
  const searchByName = async (name: string) => {
    const response = await secureAPI.get(`/district/search?name=${name}`)
    const result = response.data as IDistrict[]
    return result
  }

  const searchById = async (id: string) => {
    const response = await secureAPI.get(`/district/${id}`)
    const data = response.data as IDistrict
    return data
  }

  return { searchByName, searchById }
})
