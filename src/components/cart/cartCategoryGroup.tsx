import {
  CartCategory,
  CartProduct as ICartProduct,
  ToggleCheckProduct,
  UpdateProduct,
} from '@/types'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { CartCategoryPromotion } from './cartCategoryPromotion'
import { CartProduct } from './cartProduct'
import { Button } from '../button'
import { useCartCategoryList } from '@/hooks'
import { Spinner } from '../spinner'

interface CartCategoryGroupProps {
  data: CartCategory
  className?: string
  company_id: number
  companyIndex: number
  categoryIndex: number
  onToggleCheckProduct: (params: ToggleCheckProduct) => void
  onUpdateProduct: (params: UpdateProduct) => void
  deleteCartItem: (params: ICartProduct) => void
}

export const CartCategoryGroup = ({
  data,
  className,
  company_id,
  companyIndex,
  categoryIndex,
  deleteCartItem,
  onToggleCheckProduct,
  onUpdateProduct,
}: CartCategoryGroupProps) => {
  const { getMoreProductsInCategory, categoryLoadingId } = useCartCategoryList()

  return (
    <div className={twMerge(classNames('bg-white rounded-[10px] shadow-shadow-1', className))}>
      {data?.has_promotion ? (
        <CartCategoryPromotion
          category={data}
          categoryIndex={categoryIndex}
          companyId={companyIndex}
          companyIndex={companyIndex}
        />
      ) : null}

      {/* cartProduct List */}
      <div className="py-8">
        {data?.shopping_cart_product?.map((cartProduct, productIndex) => (
          <CartProduct
            data={cartProduct}
            key={cartProduct?.shopping_cart_product_id}
            categoryIndex={categoryIndex}
            companyIndex={companyIndex}
            productIndex={productIndex}
            company_id={company_id}
            category_id={data?.category_id?.category_id}
            onDelete={deleteCartItem}
            onToggleCheck={() =>
              onToggleCheckProduct({
                companyIndex,
                categoryIndex,
                productIndex,
                shopping_cart_product_id: cartProduct.shopping_cart_product_id,
              })
            }
            onUpdate={(product, type) =>
              onUpdateProduct({
                companyIndex,
                categoryIndex,
                productIndex,
                product,
                type,
              })
            }
          />
        ))}

        {categoryLoadingId === data.cart_category_id ? (
          <div className='flex-center my-12'>
            <Spinner />
          </div>
        ) : data.shopping_cart_product?.length < data?.paginate?.total ? (
          <div className="flex-center">
            <Button
              onClick={() =>
                !data?.is_promotion_category_loading &&
                getMoreProductsInCategory({
                  category: data,
                  categoryIndex,
                  companyIndex,
                })
              }
              title="Xem thêm"
              className="border border-primary rounded-lg px-8"
              textClassName="text-primary"
            />
          </div>
        ) : null}
      </div>

      {/* group promotion */}
      {/* <div className="flex items-center justify-between p-16">
        <p className="text">{`khuyến mãi`}</p>

        <p className="text">{`Xem lựa chọn`}</p>
      </div> */}
    </div>
  )
}
