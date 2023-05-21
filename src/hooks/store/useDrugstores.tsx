import { userAPI } from '@/services'
import { GetDrugStoreParams, UserAccount } from '@/types'
import { useQueryListV2 } from '../common/useQueryV2'

interface useDrugstoresProps {
  key: string
  shouldFetch?: boolean
  params: GetDrugStoreParams
}

interface useDrugstoresRes {
  drugstores: UserAccount[]
  isValidating: boolean
  filter: (params: GetDrugStoreParams) => void
  hasMore: boolean
  isLoadingMore: boolean
  getMore: () => void
  total: number
}

export const useDrugstores = ({ key, params }: useDrugstoresProps): useDrugstoresRes => {
  const { data, isValidating, getMore, hasMore, isLoadingMore, filter, total } = useQueryListV2<
    UserAccount,
    GetDrugStoreParams
  >({
    key,
    fetcher: userAPI.getDrugStoreList,
    initialParams: params,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  return {
    drugstores: data || [],
    isValidating,
    filter,
    hasMore,
    getMore,
    isLoadingMore,
    total
  }
}
