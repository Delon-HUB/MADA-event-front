import type { IDistrict } from './IDistrict'
import type { IQuarter } from './IQuarter'

export interface ICommune {
  _id: string
  name: string
  districtId: string | IDistrict
  quarters: IQuarter[]
}
