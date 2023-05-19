import { SWR_KEY } from '@/constants'
import { orderAPI } from '@/services'
import { ConfirmTransactionParams, CreatePaymentParams, Payment } from '@/types'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
import { useAsync } from '../common'

interface PaymentSWR {
  data: Payment[]
  error: any
  isValidating: boolean
  confirmCheckout: (params: ConfirmTransactionParams, cb?: Function, onError?: Function) => void
  createPayment: (params: CreatePaymentParams, cb?: Function, onError?: Function) => void
}

const usePayment = (shouldFetch = true): PaymentSWR => {
  const { asyncHandler } = useAsync()

  const { data, error, isValidating } = useSWR(
    SWR_KEY.get_payment_method,
    shouldFetch
      ? () =>
          orderAPI.getPaymentList().then((res: any) => {
            if (res?.result?.success) {
              return res.result.data
            } else {
              toast.error(res.result.message)
            }
          })
      : null,
    {
      revalidateOnFocus: false,
    }
  )

  const createPayment = async (params: CreatePaymentParams, cb?: Function, onError?: Function) => {
    asyncHandler({
      fetcher: orderAPI.createPayment(params),
      onSuccess: (data) => {
        cb?.(data)
      },
      onError: () => onError?.(),
      config: { showSuccessMsg: false },
    })
  }

  const confirmCheckout = async (
    params: ConfirmTransactionParams,
    cb?: Function,
    onError?: Function
  ) => {
    asyncHandler({
      fetcher: orderAPI.confirmTransaction(params),
      onSuccess: (data) => {
        cb?.(data)
      },
      onError: () => onError?.(),
      config: { showSuccessMsg: false },
    })
  }

  return {
    data,
    error,
    isValidating,
    confirmCheckout,
    createPayment,
  }
}

export { usePayment }

