import {
  Breadcrumb,
  CartEmpty,
  CartPageCompany,
  CartPageNav,
  CartSummary,
  CartSummaryMobile,
  Spinner,
} from '@/components'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useCarts, useUser, useUserAddress } from '@/hooks'
import { selectOrderAddress, setOrderAddress } from '@/store'
import { MainNoFooter } from '@/templates'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ShoppingCartPage = () => {
  const dispatch = useDispatch()
  const { userInfo } = useUser({})
  const { data: addressList } = useUserAddress({
    key: `${SWR_KEY.get_user_shipping_address}_${userInfo?.account?.partner_id}`,
  })
  const orderAddress = useSelector(selectOrderAddress)
  const {
    data,
    isValidating,
    isCheckAll,
    getProductsChecked,
    deleteCheckedCartItems,
    updateProduct,
    toggleCheckProduct,
    toggleCheckAllProductsInCart,
    deleteCartItem,
    toggleCheckAllProductsInCompany,
  } = useCarts()

  useEffect(() => {
    if (!orderAddress && isArrayHasValue(addressList)) {
      dispatch(setOrderAddress(addressList?.[0]))
    }
  }, [addressList])

  return (
    <MainNoFooter title={'Giỏ hàng'} description="">
      <div className="mb-24">
        <div className="container min-h-[100vh] mb-mobile_bottom_distance_default md:mb-0">
          {isValidating ? (
            <div className="flex-center my-24">
              <Spinner />
            </div>
          ) : isArrayHasValue(data) ? (
            <div className="mb-cart_summary_mobile_height pb-12">
              <Breadcrumb breadcrumbList={[{ path: '/', name: 'Giỏ hàng' }]} />

              <p className="text-text-color leading-10 text-xl md:text-2xl !font-medium my-24 uppercase px-12">
                Giỏ hàng
              </p>

              <div className="grid md:grid-cols-3 gap-24">
                <div className="md:col-span-2">
                  <CartPageNav
                    className="mb-24"
                    isCheck={isCheckAll}
                    getProductsChecked={getProductsChecked}
                    onCheck={toggleCheckAllProductsInCart}
                    onDelete={deleteCheckedCartItems}
                  />

                  {data?.map((company, companyIndex) => (
                    <CartPageCompany
                      className="mt-24 first:mt-0"
                      data={company}
                      onCheck={() => toggleCheckAllProductsInCompany(companyIndex)}
                      key={company?.company_id?.company_id}
                      companyIndex={companyIndex}
                      onToggleCheckProduct={toggleCheckProduct}
                      onUpdateProduct={updateProduct}
                      deleteCartItem={deleteCartItem}
                    />
                  ))}
                </div>

                <div className="hidden md:block col-span-1">
                  <CartSummary />
                </div>
              </div>
              <div className="block md:hidden">
                <CartSummaryMobile />
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

export default ShoppingCartPage
