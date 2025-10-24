import type { ICreateRegionDto } from './create-region.dto'

export interface ICreateDistrictDto {
  _id?: string
  district: string
  regionId: ICreateRegionDto
}
