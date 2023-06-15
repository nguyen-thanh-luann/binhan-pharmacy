import { categoryPromotionIcon, RightIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { useCompanyPromotion, useModal } from '@/hooks'
import { promotionAPI } from '@/services'
import {
  CartCompany,
  GetPromotionApplyOnCompanyReq,
  GetPromotionApplyOnCompanySingleRes,
  UserInfo,
} from '@/types'
import Toast from 'react-hot-toast'
import useSWR from 'swr'
import { Image } from '../image'
import { Modal } from '../modal'
import { PromotionLoading } from './promotionLoading'
import { PromotionsAppliedOnCartView } from './promotionsAppliedView'
import { SelectPromotion } from './selectPromotion'

export type CartCompanyPromotionProps = {
  company: CartCompany
  companyIndex: number
}

export const CartCompanyPromotion = ({ company, companyIndex }: CartCompanyPromotionProps) => {
  const customer_id = useSWR<UserInfo>(SWR_KEY.get_user_information)?.data?.account?.partner_id
  const { closeModal, openModal, visible } = useModal()
  const { productsChecked, setPromotionsAppliedToCompany } = useCompanyPromotion({
    company,
    companyIndex,
  })

  const openPromotionModal = () => {
    if (!productsChecked?.length) {
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
    <div className="mt-12 bg-white p-10 shadow-shadow-1 rounded-[10px]">
      <div className="flex justify-between items-center flex-wrap gap-12">
        <div className="flex flex-1 items-center gap-8">
          <Image alt="" src={categoryPromotionIcon} imageClassName="w-32 h-32 object-cover" />
          {company?.is_promotion_loading ? (
            <PromotionLoading />
          ) : (
            <div
              onClick={openPromotionModal}
              className="bg-primary p-6 rounded-[6px] flex items-center gap-8 cursor-pointer active:opacity-50 duration-200"
            >
              <p className="text-base text-white">Xem khuyến mãi nhận được</p>
              <RightIcon className="text-sm text-white" />
            </div>
          )}
        </div>
      </div>

      {company?.promotions_applied?.length ? (
        <PromotionsAppliedOnCartView className="mt-12" data={company.promotions_applied} />
      ) : null}

      <Modal
        headerClassName="px-12"
        modalClassName="w-[500px] flex-col h-[600px]"
        onClose={closeModal}
        visible={visible}
        headerTitle={`${company.company_id.company_name} Khuyến mãi`}
      >
        <SelectPromotion
          defaultValue={company?.promotions_applied}
          onChange={setPromotionsAppliedToCompany}
          swrKey={SWR_KEY.promotionsApplyOnOrder(company.company_id.company_id)}
          fetcher={
            promotionAPI.getPromotionsAppyOnCompany as (
              params: GetPromotionApplyOnCompanyReq
            ) => Promise<GetPromotionApplyOnCompanySingleRes>
          }
          initialParams={{
            customer_id: customer_id as number,
            order_data: [
              {
                company_id: company.company_id.company_id,
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
