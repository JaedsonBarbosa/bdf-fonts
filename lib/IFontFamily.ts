import { IFont } from './IFont'

interface IFontFamilyItem {
  size: number
  bold: boolean
  italic: boolean
  data: IFont
}

export type IFontFamily = IFontFamilyItem[]
