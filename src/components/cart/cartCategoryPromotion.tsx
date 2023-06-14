import { RightIcon, categoryPromotionIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { useCategoryPromotion, useModal } from '@/hooks'
import { promotionAPI } from '@/services'
import {
  CartCategory,
  GetPromotionApplyOnCategoryReq,
  GetPromotionApplyOnCategorySingleRes,
  UserInfo,
} from '@/types'
import useSWR from 'swr'
import { Image } from '../image'
import { Modal } from '../modal'
import { PromotionLoading } from './promotionLoading'
import { PromotionsAppliedOnCartView } from './promotionsAppliedView'
import { SelectPromotion } from './selectPromotion'
import { toast } from 'react-hot-toast'

export type CategoryPromotionProps = {
  category: CartCategory
  companyId: number
  companyIndex: number
  categoryIndex: number
}

export const CartCategoryPromotion = ({
  category,
  companyId,
  ...indexParams
}: CategoryPromotionProps) => {
  const customer_id = useSWR<UserInfo>(SWR_KEY.get_user_information)?.data?.account?.partner_id
  const { closeModal, openModal, visible } = useModal()
  const { productsChecked, setPromotionsAppliedOnCategory } = useCategoryPromotion({
    category,
    companyId,
    ...indexParams,
  })

  const openPromotionModal = () => {
    if (!productsChecked?.length) {
      toast.error('Vui lòng chọn sản phẩm!', { icon: '🙏' })
      return
    }

    if (!customer_id) {
      toast.error('Vui lòng đăng nhập để xem chương trình!')
      return
    }

    openModal()
  }

  return (
    <div className="">
      <div className="flex items-center gap-8">
        <Image alt="" src={categoryPromotionIcon} imageClassName="w-32 h-32 object-cover" />

        {category?.is_promotion_category_loading ? (
          <PromotionLoading />
        ) : (
          <div
            onClick={openPromotionModal}
            className="bg-primary p-6 rounded-[6px] flex items-center gap-8 cursor-pointer active:opacity-50 duration-200"
          >
            <p className="text-base text-white line-clamp-1">{`Chọn chương trình ${
              category?.category_id?.category_name.toLowerCase() || ''
            }`}</p>
            <RightIcon className="text-sm text-white" />
          </div>
        )}
      </div>

      {category?.promotions_category_applied?.length ? (
        <PromotionsAppliedOnCartView
          className="mt-12"
          data={category.promotions_category_applied}
        />
      ) : null}

      <Modal
        headerClassName="px-12"
        modalClassName="w-[500px] flex-col h-[500px]"
        onClose={closeModal}
        visible={visible}
        headerTitle={`Khuyến mãi ${category.category_id.category_name}`}
      >
        <SelectPromotion
          defaultValue={category?.promotions_category_applied}
          onChange={setPromotionsAppliedOnCategory}
          swrKey={SWR_KEY.promotionsApplyOnCategory(category.category_id.category_id)}
          fetcher={
            promotionAPI.getPromotionsApplyOnCategory as (
              params: GetPromotionApplyOnCategoryReq
            ) => Promise<GetPromotionApplyOnCategorySingleRes>
          }
          initialParams={{
            customer_id: customer_id as number,
            category_data: [
              {
                category_id: category.category_id.category_id,
                company_id: companyId,
                order_lines: productsChecked.map((item) => ({
                  product_id: item.product_id.product_id,
                  product_uom_qty: item.quantity,
                  uom_id: item.uom_id.uom_id,
                  price_unit: item.price_unit,
                })),
              },
            ],
          }}
        />
      </Modal>
    </div>
  )
}
