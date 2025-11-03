import type { ICreateProvinceDto } from './IProvince'

export interface ICreateRegionDto {
  _id?: string
  region: string
  provinceId: ICreateProvinceDto
}
