import {
  Breadcrumb,
  NotFound,
  OrderHistoryDetail,
  OrderHistoryItem,
  OrderProductLoading,
  Tabs,
} from '@/components'
import { DEFAULT_LIMIT } from '@/constants'
import { useClickOutside, useDevice, useModal, useOrderHistory } from '@/hooks'
import { AccountContainer, Main } from '@/templates'
import { OrderFilterParams, OrderHistoryDetail as IOrderHistoryDetail } from '@/types'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

// date picker library
import { addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file

const PurchasedOrderPage = () => {
  const {
    data: orderHistory,
    isValidating: isOrderListLoading,
    filterOrderHistory,
  } = useOrderHistory(DEFAULT_LIMIT)

  const router = useRouter()
  const { isDesktop } = useDevice()
  const { sale_order_id, state } = router.query
  const [currentTab, setCurrentTab] = useState<string>(state?.toString() || 'all')
  const [params, setParams] = useState<OrderFilterParams>({})
  const [orderDetailData, setOrderDetailData] = useState<IOrderHistoryDetail | undefined>()

  const datePickerRef = useRef<HTMLDivElement>(null)
  const {
    visible: showDatePicker,
    closeModal: closeDatePickerModal,
    toggle: toggleDatePicker,
  } = useModal()

  useEffect(() => {
    if (!sale_order_id) {
      setOrderDetailData(undefined)
    }
  }, [router])

  useClickOutside([datePickerRef], closeDatePickerModal)

  const [dateFilter, setDateFilter] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ])

  const handleShowOrderdetail = (order_id: Number) => {
    if (!order_id) return
    router.push(`/purchased-order?sale_order_id=${order_id}`)
  }

  const orderStatusTabs = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang xử lí', value: 'sale' },
    { label: 'Đang vận chuyển', value: 'delivery' },
    { label: 'Đã giao', value: 'received' },
    { label: 'Đã hủy', value: 'cancel' },
  ]

  const hanldeFilter = (props: OrderFilterParams) => {
    filterOrderHistory(props)
  }

  const handleChangeTab = (tab: string) => {
    setCurrentTab(tab)
    setParams({
      booking_state: tab,
    })
  }

  const selectDateHandle = (data: any) => {
    setDateFilter([data])
    setParams({
      ...params,
      date_starting: moment(data.startDate).format('YYYY-MM-DD'),
      date_ending: moment(data.endDate).format('YYYY-MM-DD'),
    })
  }

  useEffect(() => {
    hanldeFilter(params)
  }, [params])

  useEffect(() => {
    setParams({
      ...params,
      booking_state: currentTab,
    })
  }, [currentTab])

  return (
    <Main title={'Đơn hàng'} description="">
      <div className="container">
        {orderDetailData ? (
          <Breadcrumb
            breadcrumbList={[
              {
                path: '/purchased-order',
                name: 'Đơn hàng',
              },
              {
                path: '/',
                name: `${orderDetailData.name}`,
              },
            ]}
          />
        ) : (
          <Breadcrumb
            breadcrumbList={[
              {
                path: '/',
                name: 'Đơn hàng',
              },
            ]}
          />
        )}
      </div>

      <AccountContainer className="container mb-32">
        <div>
          {sale_order_id ? (
            <OrderHistoryDetail
              cb={(data) => setOrderDetailData(data)}
              type="order"
              sale_order_id={Number(sale_order_id)}
            />
          ) : (
            <div>
              <div className="bg-white p-12 mb-12 rounded-[10px] shadow-shadow-1">
                <div className="border-b border-gray-200 pb-12 mb-18 flex-between flex-wrap max-w-[100%]">
                  <p className="text-xl capitalize font-semibold">Đơn hàng</p>

                  <div ref={datePickerRef} className="">
                    <div className="relative">
                      <div
                        onClick={toggleDatePicker}
                        className="flex border border-primary cursor-pointer rounded-lg p-8"
                      >
                        <p>
                          {`${moment(dateFilter[0]?.startDate).format('DD-MM-YYYY')} 
                            ~
                             ${moment(dateFilter[0]?.endDate).format('DD-MM-YYYY')}`}
                        </p>
                      </div>

                      <div
                        className={`date-picker absolute z-20 shadow-shadow-1 right-0 mt-8 animate-fade ${
                          showDatePicker ? 'flex' : 'hidden'
                        }`}
                      >
                        <DateRangePicker
                          onChange={(item: any) => {
                            selectDateHandle(item.selection)
                          }}
                          moveRangeOnFirstSelection={false}
                          months={2}
                          ranges={dateFilter}
                          direction={isDesktop ? 'horizontal' : 'vertical'}
                          fixedHeight={false}
                          rangeColors={['#B35EC2']}
                          locale={vi}
                          className="border border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-18 overflow-scroll scrollbar-hide">
                  <Tabs
                    list={orderStatusTabs}
                    tabActive={currentTab}
                    onChange={(val: string) => {
                      handleChangeTab(val)
                    }}
                    className="w-fit"
                    labelClassName="px-12 py-8 text-center border-b border-white"
                    tabActiveClassName="!border-primary text-primary"
                  />
                </div>
              </div>

              <div>
                {isOrderListLoading ? (
                  <div className="bg-white p-12">
                    {Array?.from({ length: 4 }).map((_, index) => (
                      <OrderProductLoading key={index} />
                    ))}
                  </div>
                ) : orderHistory?.sale_orders?.length > 0 ? (
                  <div className="overflow-scroll scrollbar-hide">
                    {orderHistory?.sale_orders?.map((order) => (
                      <OrderHistoryItem
                        data={order}
                        key={order.order_id}
                        onClick={() => {
                          handleShowOrderdetail(order.order_id)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-20 rounded-lg shadow-shadow-1">
                    <NotFound notify="Không tìm thấy đơn hàng nào!" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PurchasedOrderPage
