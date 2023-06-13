import { CartIcon, CartLinearIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { useDevice } from '@/hooks'
import { cartAPI } from '@/services'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export const CartDrawer = () => {
  const router = useRouter()

  const { isDesktop } = useDevice()

  const { data: cartLength } = useSWR(SWR_KEY.cart_count, () =>
    cartAPI.getCartLength().then((res) => res?.data?.cart_product_count || 0)
  )

  const handleClick = () => {
    router.push('/shopping-cart')
  }

  return (
    <div className="relative w-36 h-header_tab_height flex items-center justify-center cursor-pointer z-10">
      <div onClick={handleClick} className="">
        {isDesktop ? (
          <CartLinearIcon className="w-24 h-24" />
        ) : (
          <CartIcon className="w-24 h-24 text-primary" />
        )}

        <div className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full text-primary bg-white shadow-shadow-2 flex items-center justify-center">
          <span className="text-xs font-semibold">
            {cartLength ? (cartLength < 99 ? cartLength : '99+') : 0}
          </span>
        </div>
      </div>
    </div>
  )
}
