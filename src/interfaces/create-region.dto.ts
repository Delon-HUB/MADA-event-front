import type { ICreateProvinceDto } from './create-province.dto'

export interface ICreateRegionDto {
  _id?: string
  region: string
  provinceId: ICreateProvinceDto
}
