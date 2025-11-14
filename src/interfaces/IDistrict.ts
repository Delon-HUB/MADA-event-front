import type { ICreateRegionDto } from './IRegion'

export interface ICreateDistrictDto {
  _id?: string
  district: string
  regionId: ICreateRegionDto
}
