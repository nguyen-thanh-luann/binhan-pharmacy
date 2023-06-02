import { QuickOrderForm, Tabs } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { MainNoFooter } from '@/templates'
import { useState } from 'react'

export type OrderTabOption = 'purchase' | 'advice'

const QuickOrder = () => {
  const registerTabs = [
    { label: 'Đặt mua nhanh hơn', value: 'purchase' },
    { label: 'Đăng ký tư vấn sản phẩm', value: 'advice' },
  ]

  const [currentTab, setCurrentTab] = useState<OrderTabOption>('purchase')

  return (
    <MainNoFooter title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container min-h-[80vh] w-[90%] md:w-[50%] mx-auto">
        <div className="bg-white p-12 md:p-24 rounded-lg shadow-shadow-1 my-32">
          <p className="text-md font-bold uppercase text-center mb-12">
            Hỗ trợ tư vấn, đặt mua sản phẩm
          </p>

          <Tabs
            list={registerTabs}
            tabActive={currentTab}
            onChange={(val: any) => setCurrentTab(val)}
            className=" rounded-full border border-gray-200 mb-24"
            labelClassName="rounded-full w-[50%] px-12 py-8  text-center"
            tabActiveClassName="!bg-primary text-white"
          />

          <QuickOrderForm type={currentTab} />
        </div>
      </div>
    </MainNoFooter>
  )
}

export default QuickOrder
