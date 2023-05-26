import { PlusIcon, TimesIcon, emptyAddress } from '@/assets'
import {
  AddressForm,
  AddressItem,
  AddressItemLoading,
  Breadcrumb,
  Button,
  Modal,
  NotFound,
} from '@/components'
import { isArrayHasValue } from '@/helper'
import { useModal, useUserAddress } from '@/hooks'
import { AccountContainer, Main } from '@/templates'

const AddressPage = () => {
  const { data, isValidating } = useUserAddress({})

  const {
    visible: showAddressForm,
    closeModal: closeAddressForm,
    openModal: openAddressForm,
  } = useModal()
  
  return (
    <Main title={'Địa chỉ'} description="">
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Địa chỉ',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          {/* header */}
          <div className="border-b border-gray-200 pb-12 mb-24 flex-between flex-wrap">
            <p className="text-xl capitalize font-semibold">Địa chỉ</p>
            <Button
              title="Thêm địa chỉ"
              className="bg-primary py-8 px-20 active:opacity-50 duration-200"
              textClassName="text-white"
              icon={<PlusIcon className="text-white" />}
              onClick={() => openAddressForm()}
            />
          </div>

          {/* content */}
          <div className="">
            {isValidating ? (
              <div className="">
                {Array?.from({ length: 4 }).map((_, index) => (
                  <AddressItemLoading key={index} />
                ))}
              </div>
            ) : isArrayHasValue(data) ? (
              <div>
                {data?.map((item) => (
                  <AddressItem key={item?.id} address={item} />
                ))}
              </div>
            ) : (
              <NotFound image={emptyAddress} notify="Bạn chưa có địa chỉ nào!" notifyClassName="" />
            )}
          </div>
        </div>

        {/* modal address form */}
        <Modal
          visible={showAddressForm}
          headerClassName="hidden"
          modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
        >
          <div>
            <div className="flex-between p-12">
              <p className="text-md">Thêm địa chỉ mới</p>
              <div className="cursor-pointer" onClick={closeAddressForm}>
                <TimesIcon />
              </div>
            </div>

            <div className="max-h-[400px] h-fit overflow-scroll scrollbar-hide p-12">
              <AddressForm
                onSubmit={() => {
                  closeAddressForm()
                }}
              />
            </div>
          </div>
        </Modal>
      </AccountContainer>
    </Main>
  )
}

export default AddressPage
