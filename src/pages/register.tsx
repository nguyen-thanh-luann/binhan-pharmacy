import { StoreRegisterForm, Tabs, UserRegister } from '@/components'
import { MainNoFooter } from '@/templates'
import { useState } from 'react'

export type RegisterTabOption = 'user' | 'store'

const Register = () => {
  const registerTabs = [
    { label: 'Đăng ký người dùng', value: 'user' },
    { label: 'Đăng ký nhà thuốc', value: 'store' },
  ]

  const [currentTab, setCurrentTab] = useState<RegisterTabOption>('user')
  return (
    <MainNoFooter title={'Đăng ký'} description="">
      <div className="container min-h-[80vh] w-[90%] md:w-[50%] mx-auto">
        <div className="bg-white p-12 rounded-lg shadow-shadow-1 my-32">
          <p className="text-center text-text-color text-xl capitalize font-bold my-24">{`Đăng ký ${
            currentTab === 'store' ? 'Nhà thuốc' : 'người dùng'
          }`}</p>

          <Tabs
            list={registerTabs}
            tabActive={currentTab}
            onChange={(val: any) => setCurrentTab(val)}
            className=" rounded-full border border-gray-200 mb-24"
            labelClassName="rounded-full w-[50%] px-12 py-8  text-center"
            tabActiveClassName="!bg-primary text-white"
          />

          {currentTab === 'store' ? (
            <div>
              <StoreRegisterForm />
            </div>
          ) : (
            <div>
              <UserRegister className="w-[50%] mx-auto" />
            </div>
          )}
        </div>
      </div>
    </MainNoFooter>
  )
}

export default Register
