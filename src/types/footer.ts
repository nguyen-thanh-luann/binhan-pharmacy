import { URLRes } from './common'

export interface GetFooterDescriptionParams {
  footer_line_id: number
}

export type FooterDataView = 'image' | 'text' | 'text_image'
export type ColumnMarginType = 'left' | 'right' | 'center'
export type DescriptionStyle = 'description_none' | 'description_url' | 'description_html'

export interface FooterColumn {
  column_id: number
  column_name: string
  data_view: FooterDataView
  image_url: URLRes
  image_size: {
    height: number
    width: number
  }
  column_margin: ColumnMarginType
  description_url: string
  footer_line_ids: FooterLine[]
}

export interface FooterLine {
  line_id: number
  line_name: string
  data_view: FooterDataView
  image_url: URLRes
  image_size: {
    height: number
    width: number
  }
  content_inline: FooterLine[]
  description_style: DescriptionStyle
  description_url: string
}

export interface FooterDescription extends FooterLine {
  description_html: string
}
