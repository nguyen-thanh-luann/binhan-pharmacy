import { categoryPromotionIcon, RightIcon, TimesIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { useModal } from '@/hooks'
import { promotionAPI } from '@/services'
import {
  CartProduct,
  GetProductPromotionSingleRes,
  GetProductsInCartRes,
  GetPromotionsAppliedOnProductReq,
  MutateProductParams,
  PromotionRes,
  UserInfo
} from '@/types'
import classNames from 'classnames'
import produce from 'immer'
import _ from 'lodash'
import { useCallback } from 'react'
import Toast from 'react-hot-toast'
import useSWR, { useSWRConfig } from 'swr'
import { Image } from '../image'
import { Modal } from '../modal'
import { PromotionLoading } from './promotionLoading'
import { PromotionsAppliedOnCartView } from './promotionsAppliedView'
import { SelectPromotion } from './selectPromotion'

type CartProductPromotionProps = MutateProductParams & {
  companyId: number
  product: CartProduct
}

export const CartProductPromotion = (props: CartProductPromotionProps) => {
  const { product, companyId } = props
  const { cache, mutate } = useSWRConfig()
  const customer_id = useSWR<UserInfo>(SWR_KEY.get_user_information)?.data?.account?.partner_id
  const { closeModal, openModal, visible } = useModal()
  const { toggle: toggleProductBogo, visible: isShowProductBogo } = useModal()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutateCartSummary = useCallback(
    _.debounce(() => mutate(SWR_KEY.cartSummary), 2000),
    []
  )

  const setPromotionsAppliedOnProduct = async (promotions: PromotionRes[]) => {
    const cart: GetProductsInCartRes | undefined = cache.get(SWR_KEY.cart_list)?.data
    if (!cart?.result?.length) return

    const { categoryIndex, companyIndex, productIndex } = props

    const data = produce(cart, (draft) => {
      const product =
        draft.result?.[companyIndex]?.shopping_cart_category?.[categoryIndex]
          ?.shopping_cart_product?.[productIndex]
      if (product?.product_id?.product_id) {
        product.promotions_product_applied = promotions
      }
    })

    mutate(SWR_KEY.cart_list, data, false)
    mutateCartSummary()
  }

  const openPromotionModal = () => {
    if (!product?.is_check) {
      Toast('Vui lòng chọn sản phẩm', { icon: '🙏' })
      return
    }

    if (!customer_id) {
      Toast('Vui lòng chọn khách hàng')
      return
    }

    openModal()
  }

  return (
    <div className="px-16 mb-12">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-8" onClick={toggleProductBogo}>
          <Image alt="" src={categoryPromotionIcon} imageClassName="w-32 h-32 object-cover" />
          {product.is_product_promotion_loading ? (
            <PromotionLoading />
          ) : (
            <div className="p-6 rounded-[6px] flex items-center gap-8 cursor-pointer active:opacity-50 duration-200">
              <p className="text-base text-primary">{`Khuyến mãi dành cho sản phẩm`}</p>
              <RightIcon
                className={classNames(
                  'text-xs text-primary duration-150',
                  isShowProductBogo ? 'rotate-90' : ''
                )}
              />
            </div>
          )}
        </div>

        <div className="cursor-pointer" onClick={openPromotionModal}>
          <p className="text-base text-primary underline">Xem lựa chọn</p>
        </div>
      </div>

      {product.promotions_product_applied?.length && isShowProductBogo ? (
        <PromotionsAppliedOnCartView
          className="animate-fade"
          data={product.promotions_product_applied}
        />
      ) : null}

      <Modal
        headerClassName="hidden"
        modalClassName="w-[500px] flex-col h-[500px]"
        onClose={closeModal}
        visible={visible}
        header={
          <div className="flex items-center px-12 py-4">
            <div className="relative flex-1 group cursor-pointer w-full">
              <p className="line-clamp-2 text-lg">
                {`Khuyến mãi ${product?.product_id?.product_name}`}
              </p>
            </div>
            <button className="p-[4px]" onClick={closeModal}>
              <TimesIcon className="text-sm" />
            </button>
          </div>
        }
      >
        <SelectPromotion
          defaultValue={product?.promotions_product_applied}
          onChange={setPromotionsAppliedOnProduct}
          swrKey={SWR_KEY.promotionsApplyOnProduct(product.product_id.product_id)}
          fetcher={
            promotionAPI.getPromotionsCanApplyOnProducts as (
              params: GetPromotionsAppliedOnProductReq
            ) => Promise<GetProductPromotionSingleRes>
          }
          initialParams={{
            customer_id: customer_id as number,
            product_data: [
              {
                company_id: companyId,
                product_id: product.product_id.product_id,
                product_uom_qty: product.quantity,
                uom_id: product.uom_id.uom_id,
                price_unit: product.price_unit,
              },
            ],
          }}
        />
      </Modal>
    </div>
  )
}
