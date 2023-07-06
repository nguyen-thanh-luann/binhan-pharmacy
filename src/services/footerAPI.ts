import { GetFooterDescriptionParams } from '@/types'
import axiosClient from '.'

const footerAPI = {
  getFooterData: () => {
    return axiosClient.get('/footer_controller/footer_column_data')
  },

  getFooterDescription: (params: GetFooterDescriptionParams) => {
    return axiosClient.get(`/footer_controller/footer_description`, {
      params,
    })
  },
}

export default footerAPI
