import { CreateOpportunityParams } from '@/types'
import { useAsync } from '../common'
import { orderAPI } from '@/services'

export const useQuickOrder = () => {
  const { asyncHandler } = useAsync()

  const createQuickOrder = (
    params: CreateOpportunityParams,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    asyncHandler({
      fetcher: orderAPI.createOpportunity(params),
      onSuccess() {
        onSuccess?.()
      },
      onError: () => {
        onError?.()
      },
      config: {
        showSuccessMsg: false,
      },
    })
  }

  return {
    createQuickOrder,
  }
}
