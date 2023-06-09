import {
  Breadcrumb,
  CartEmpty,
  CheckoutCarrierMethod,
  CheckoutPaymentMethod,
  CompanyOrderItem,
  DeliveryAddress,
  OrderSummary,
  OrderSummaryMobile,
  Spinner,
} from '@/components'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { orderAPI } from '@/services'
import { RootState } from '@/store'
import { MainNoFooter } from '@/templates'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

const CheckoutPage = () => {
  const previousRoute = useSelector((state: RootState) => state.common.previousRoute)
  const { query, isReady, push } = useRouter()
  const { data, isValidating } = useSWR(
    !isReady ? null : SWR_KEY.orders,
    !isReady ? null : () => fetcherHandler()
  )

  useEffect(() => {
    if (previousRoute?.includes('/checkout-success')) {
      push('/')
    }
  }, [previousRoute, push])

  async function fetcherHandler() {
    const orderIdsQuery = query?.order_ids
    if (!orderIdsQuery) return null

    const order_ids = _.isArray(orderIdsQuery) ? orderIdsQuery.map((id) => +id) : [+orderIdsQuery]
    if (!order_ids?.length) return null

    try {
      const res = await orderAPI.getOrderDrafts({ order_ids })
      return res.result?.data
    } catch (error) {
      return null
    }
  }

  return (
    <MainNoFooter title={'Thanh toán'} description="">
      <div className="mb-24">
        <div className="container min-h-[100vh] mb-mobile_bottom_distance_default md:mb-0">
          {isValidating ? (
            <div className="flex-center my-24">
              <Spinner />
            </div>
          ) : isArrayHasValue(data?.sale_orders) ? (
            <div className="mb-cart_summary_mobile_height pb-12">
              <Breadcrumb
                breadcrumbList={[
                  {
                    path: '/shopping-cart',
                    name: 'Giỏ hàng',
                  },
                  {
                    path: '/',
                    name: 'Thanh toán',
                  },
                ]}
              />

              <p className="text-text-color leading-10 text-xl md:text-2xl !font-medium my-24 uppercase px-12">
                Thanh toán
              </p>

              <div className="grid md:grid-cols-3 gap-24 px-12">
                <div className="md:col-span-2">
                  {data?.sale_orders?.map((company) => (
                    <div key={company.company_id}>
                      <CompanyOrderItem data={company} className="mb-24" />

                      <DeliveryAddress className="mb-24" />

                      <CheckoutCarrierMethod
                        className="mb-24"
                        order_id={company.order_id}
                        company_id={company.company_id}
                      />

                      <CheckoutPaymentMethod className="mb-24" order_id={company.order_id} />
                    </div>
                  ))}
                </div>

                <div className="hidden md:block col-span-1">
                  <OrderSummary />
                </div>
              </div>
              <div className="block md:hidden">
                <OrderSummaryMobile />
              </div>
            </div>
          ) : (
            <CartEmpty />
          )}
        </div>
      </div>
    </MainNoFooter>
  )
}

export default CheckoutPage
