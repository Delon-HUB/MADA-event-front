import type { ICommune } from './ICommune'

export interface IQuarter {
  _id: string
  name: string
  communeId: string | ICommune
}
