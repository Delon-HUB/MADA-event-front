import type { ICommune } from './ICommune'
import type { IRegion } from './IRegion'

export interface IDistrict {
  _id: string
  name: string
  regionId: string | IRegion
  communes: ICommune[]
}
