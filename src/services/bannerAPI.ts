import { GetBannerParams } from '@/types'
import { axiosInstance } from '.'

const bannerAPI = {
  getBanners: (params?: GetBannerParams) => {
    return axiosInstance.get('/description_content_controller/banner_information', {
      params,
    })
  },
}

export { bannerAPI }

