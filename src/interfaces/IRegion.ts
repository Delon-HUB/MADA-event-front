import type { IDistrict } from './IDistrict'

export interface IRegion {
  _id: string
  name: string
  districts: IDistrict[]
}
