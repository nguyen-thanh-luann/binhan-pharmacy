import { VisceraAttribute } from '@/types'
import { productAPI } from '@/services'
import { useQueryListV2 } from '../common'

interface useViceraAttributeProps {
  key: string
}

interface useAttributeMinorRes {
  data: VisceraAttribute[]
  isValidating: boolean
  isLoadingMore: boolean
  hasMore: boolean
  getMore: () => void
}

export const useViceraAttribute = ({ key }: useViceraAttributeProps): useAttributeMinorRes => {
  const { data, isValidating, getMore, hasMore, isLoadingMore } = useQueryListV2<VisceraAttribute>({
    key,
    fetcher: productAPI.getListVisceraAttribute,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  return {
    data,
    isValidating,
    getMore,
    hasMore,
    isLoadingMore,
  }
}
