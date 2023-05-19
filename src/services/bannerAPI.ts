import { Banner, GetBannerParams, HTTPResponseV2 } from '@/types'
import { axiosInstance } from '.'

const bannerAPI = {
  getBanners: (params?: GetBannerParams): Promise<HTTPResponseV2<Banner[]>> => {
    return axiosInstance.get('/description_content_controller/banner_information', {
      params,
    })
  },
}

export { bannerAPI }
