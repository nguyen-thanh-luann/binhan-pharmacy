import { orderDoneIcon, WarningCircleIconOutline } from '@/assets'
import { Image, Spinner } from '@/components'
import { SWR_KEY, VNPAY_STATUS_NAME } from '@/constants'
import { useCreateOrderDone } from '@/hooks'
import { orderAPI } from '@/services'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

const CheckoutProcess = () => {
  const { query, isReady, push } = useRouter()
  const { createOrderDoneWithTransactionConfirmed } = useCreateOrderDone()
  const [isValidating, setValidating] = useState<boolean>(false)
  const { vnp_ResponseCode, sale_order_id } = query
  const { data: orderDraftData } = useSWR(
    !isReady ? null : SWR_KEY.order_draft,
    !isReady ? null : () => fetcherHandler()
  )

  async function fetcherHandler() {
    if (!sale_order_id) return null

    try {
      const res = await orderAPI.getOrderDrafts({ order_ids: [+sale_order_id] })
      return res.result?.data
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    if (vnp_ResponseCode !== '00' || !orderDraftData) return

    setValidating(true)

    orderAPI
      .confirmTransaction({ sale_order_id: Number(sale_order_id) })
      .then((res: any) => {
        if (res?.result?.success && sale_order_id) {
          createOrderDoneWithTransactionConfirmed(
            {
              order_id: orderDraftData?.sale_orders?.map((order) => +order?.order_id),
            },
            () => {
              toast.success('Congrat!')
            }
          )
        }

        setValidating(false)
      })
      .catch(() => {
        toast.error('Something went wrong!')
        setValidating(false)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDraftData])

  const isTransactionSuccess = vnp_ResponseCode === '00'

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      {isValidating ? (
        <div className="flex items-center justify-center w-full md:w-[40%] min-h-[200px] flex-col border border-gray-200 rounded-[8px]">
          <div className=" flex-center flex-col">
            <WarningCircleIconOutline className="w-[60px] h-[60px] text-yellow" />

            <p className="text-2xl text-text-color font-semibold">Đang xử lý giao dịch...</p>
          </div>

          <div className="fixed z-[2000] bg-[rgba(0,0,0,0.4)] inset-0 flex justify-center items-center">
            <Spinner />
          </div>
        </div>
      ) : (
        <div
          className={classNames(
            'flex items-center justify-center w-full md:w-[40%] min-h-[200px] flex-col rounded-[8px] py-24 border',
            isTransactionSuccess ? 'border-emerald-500' : 'border-red'
          )}
        >
          <div className={classNames('flex-center flex-col mb-24 rounded-[8px]')}>
            {isTransactionSuccess ? (
              <Image
                alt="success icon"
                src={orderDoneIcon}
                imageClassName="w-[60px] h-[60px] object-cover"
                className="mb-18"
              />
            ) : (
              <WarningCircleIconOutline className="w-[60px] h-[60px] text-red" />
            )}

            <p
              className={classNames(
                'text-xl text-center font-semibold',
                isTransactionSuccess ? 'text-emerald-500 ' : 'text-red'
              )}
            >
              {isTransactionSuccess ? 'Giao dịch thành công' : 'Giao dịch không thành công'}
            </p>

            <div
              className={classNames(
                'my-16 border-b border-solid w-full',
                isTransactionSuccess ? 'text-emerald-500' : 'text-red'
              )}
            ></div>

            <p className="text-md flex-1 text-center">
              {`Ghi chú: ${VNPAY_STATUS_NAME[vnp_ResponseCode as any]}`}
            </p>
          </div>

          <div className="flex-center flex-col">
            <div
              onClick={() => {
                if (isTransactionSuccess) {
                  push('/')
                } else {
                  push({
                    pathname: '/checkout',
                    query: {
                      sale_order_id,
                    },
                  })
                }
              }}
              className={classNames(
                'border rounded-md p-4 text-md px-12 cursor-pointer',
                isTransactionSuccess ? 'border-emerald-500 text-emerald-500' : 'border-red text-red'
              )}
            >
              {isTransactionSuccess ? ' Tiếp tục mua sắm' : 'Quay lại trang thanh toán'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutProcess
