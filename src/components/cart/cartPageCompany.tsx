import { StoreIcon } from '@/assets'
import { useAsync } from '@/hooks'
import { cartAPI } from '@/services'
import { CartCompany, CartProduct, ToggleCheckProduct, UpdateProduct } from '@/types'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { InputCheckbox } from '../inputs'
import { Spinner } from '../spinner'
import { CartCategoryGroup } from './cartCategoryGroup'
import { CartCompanyPromotion } from './cartCompanyPromotion'

interface CartPageCompanyProps {
  data: CartCompany
  className?: string
  showCompanyName?: boolean
  companyIndex: number
  onCheck?: () => void
  onToggleCheckProduct: (params: ToggleCheckProduct) => void
  deleteCartItem: (params: CartProduct) => void
  onUpdateProduct: (params: UpdateProduct) => void
}

export const CartPageCompany = ({
  data,
  className,
  onToggleCheckProduct,
  onUpdateProduct,
  companyIndex,
  deleteCartItem,
  onCheck,
}: CartPageCompanyProps) => {
  const { asyncHandler, isLoading } = useAsync()

  const toggleCheck = () => {
    asyncHandler({
      fetcher: cartAPI.toggleCheckProductsInCart({
        is_check: !data.is_check,
        shopping_cart_ids: [data.shopping_cart_id],
      }),
      onSuccess: onCheck,
      config: {
        showBackdrop: false,
        showSuccessMsg: false,
        setLoadingState: true,
      },
    })
  }


  return (
    <div className={twMerge(classNames('', className))}>
      <div className="flex items-center gap-12 bg-white rounded-[10px] p-12 mb-12 shadow-shadow-1">
        <div className={`w-32`}>
          {isLoading ? (
            <Spinner />
          ) : (
            <InputCheckbox isChecked={data?.is_check} onCheck={toggleCheck} />
          )}
        </div>

        <div className="flex items-center gap-8 cursor-pointer" onClick={toggleCheck}>
          <StoreIcon className="w-[22px] h-[22px] tssext-text-color" />

          <p className="text-text-color text-base font-medium leading-8">
            {data?.company_id?.company_name || 'Công ty mặc định'}
          </p>
        </div>
      </div>

      <div>
        {data?.shopping_cart_category?.map((categoryGroup, categoryIndex) => (
          <CartCategoryGroup
            company_id={data?.company_id?.company_id}
            companyIndex={companyIndex}
            categoryIndex={categoryIndex}
            data={categoryGroup}
            key={categoryGroup?.cart_category_id}
            className="mb-12 last:mb-0"
            onToggleCheckProduct={onToggleCheckProduct}
            onUpdateProduct={onUpdateProduct}
            deleteCartItem={deleteCartItem}
          />
        ))}
      </div>


      {data?.has_promotion ? (
        <CartCompanyPromotion company={data} companyIndex={companyIndex} />
      ) : null}
    </div>
  )
}
