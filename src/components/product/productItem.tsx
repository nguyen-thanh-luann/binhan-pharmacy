import { ProductCartIcon, empty } from '@/assets'
import { API_URL } from '@/constants'
import {
  calcDiscountPercent,
  formatMoneyVND,
  generateProductSlug,
  isObjectHasValue,
  purchasableProduct,
} from '@/helper'
import { useAddToCart, useModal, useUser } from '@/hooks'
import { addViewedProduct, setProduct } from '@/store'
import { Product } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import ScrollContainer from 'react-indiana-drag-scroll'
import { useDispatch } from 'react-redux'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'
import { ModalProductDetail } from '../modal'
import { Spinner } from '../spinner'
import { Star } from '../star'
import { Tooltip } from '../tooltip'
import { ProductDiscountBadge } from './productDiscountBadge'
import { ProductItemLoading } from './productItemLoading'

interface ProductItemProps {
  data: Product
  className?: string
  isLoading?: boolean
}

type properyType = 'attribute' | 'category'

export interface ProductPropertyClick {
  type: properyType
  category_id?: number
  attribute_id?: number
  attribute_value_id?: number
}

export const ProductItem = ({ data, className, isLoading }: ProductItemProps) => {
  const productSlug = `/${generateProductSlug(data?.product_name, data?.product_id)}`
  const router = useRouter()
  const dispatch = useDispatch()
  const { userInfo } = useUser({})
  const { addToCart, isAddingTocart } = useAddToCart()

  const purchasable = purchasableProduct(data, userInfo)

  const {
    visible: showProductDetailModal,
    closeModal: closeProductDetailModal,
    openModal: openProductDetailModal,
  } = useModal()

  const handleAddToCart = (product: Product) => {
    if (isAddingTocart || !purchasable) return

    if (product.has_variant) {
      hanldeOpenModalDetail()
    } else {
      addToCart(product)
    }
  }

  const hanldeOpenModalDetail = () => {
    dispatch(setProduct(data))
    openProductDetailModal()
  }

  const hanldeCloseModalDetail = () => {
    dispatch(setProduct(undefined))
    closeProductDetailModal()
  }

  const hanldePropertyClick = (props: ProductPropertyClick) => {
    if (props.type === 'category') {
      router.push(`/search?category_${props.category_id}=${props.category_id}`)
    } else {
      router.push(`/search?attributes_${props.attribute_id}=${props.attribute_value_id}`)
    }
  }

  const onProductClick = () => {
    router.push(productSlug)
    dispatch(addViewedProduct(data))
  }

  const discount = calcDiscountPercent(data)

  return (
    <>
      {!isLoading && isObjectHasValue(data) ? (
        <div
          className={twMerge(
            classNames(
              'product-item rounded-[6px] bg-product-item-background hover:shadow-shadow-3 overflow-hidden duration-200 ease-in-out',
              className
            )
          )}
        >
          {/* image group */}
          <div className="relative">
            <div
              onClick={onProductClick}
              className="mb-8 rounded-tl-[6px] rounded-tr-[6px] max-h-[230px] relative overflow-hidden cursor-pointer"
            >
              <Image
                src={
                  data?.representation_image?.image_url
                    ? `${API_URL}${data?.representation_image?.image_url}`
                    : empty
                }
                imageClassName="object-cover w-full h-full hover:scale-110 duration-200 ease-in-out aspect-[1/1]"
                className="aspect-[1/1]"
              />
            </div>

            {/* packing rule */}
            <div
              className={classNames(
                'absolute top-3',
                discount > 0 ? 'right-25' : 'right-3',
                'z-10 min-w-[40px] max-w-[86px] max-h-[35px] overflow-scroll scrollbar-hide rounded-[10px] border border-primary px-4 py-2 bg-white bg-opacity-70'
              )}
            >
              <p className="text-xs font-medium line-clamp-2 flex-center h-full">
                {data?.packaging_specifications || ''}
              </p>
            </div>

            {discount > 0 ? (
              <div className="absolute top-0 right-0 z-10">
                <ProductDiscountBadge data={`${discount}`} />
              </div>
            ) : null}
          </div>

          {/*product info*/}
          <div className="px-8 md:px-16 pb-8 md:pb-16 relative">
            <Tooltip text={data?.product_name || ''} viewTooltip={data?.product_name?.length > 20}>
              <div onClick={onProductClick} className="relative group cursor-pointer">
                <p className="h-[43px] line-clamp-2 w-full text-text-color text-base md:text-md font-bold leading-9 mb-8 group-hover:text-primary duration-200 ease-in-out">
                  {data?.product_name}
                </p>
              </div>
            </Tooltip>

            {/* properties list */}
            <ScrollContainer mouseScroll={true} className="flex h-[30px]">
              {/* attribute */}
              {data?.attribute_minor_ids?.map((attribute) => {
                if (attribute?.filterable) {
                  return attribute?.value_ids?.map((value) => (
                    <p
                      key={value?.value_id}
                      onClick={() =>
                        hanldePropertyClick({
                          type: 'attribute',
                          attribute_id: attribute?.attribute_id,
                          attribute_value_id: value?.value_id,
                        })
                      }
                      className="text-primary min-w-fit h-fit bg-primary-100 p-4 px-6 rounded-full cursor-pointer font-medium text-xs md:text-sm leading-7 mr-8 last:mr-0 line-clamp-1"
                    >
                      {value?.value_name}
                    </p>
                  ))
                } else {
                  return null
                }
              })}

              {/* category */}
              {isObjectHasValue(data?.category_id) ? (
                <p
                  key={data?.category_id?.category_id}
                  onClick={() =>
                    hanldePropertyClick({
                      type: 'category',
                      category_id: data?.category_id?.category_id,
                    })
                  }
                  className="text-primary min-w-fit h-fit  bg-primary-100 p-4 px-6 rounded-full cursor-pointer font-medium text-xs md:text-sm leading-7 mr-8 line-clamp-1"
                >
                  {data?.category_id?.category_name}
                </p>
              ) : null}

              {/* {data?.promotion_category && (
                <p className="text-primary min-w-fit h-fit  bg-primary-100 p-4 px-6 rounded-full cursor-pointer font-medium text-xs md:text-sm leading-7 line-clamp-1">
                  {data?.promotion_category}
                </p>
              )} */}
            </ScrollContainer>

            <div className="relative">
              {/* price */}
              <div>
                {purchasable ? (
                  <div className="mb-8 flex items-center">
                    <div className="flex items-center flex-1 flex-wrap">
                      <p className="text-orange text-base md:text-md font-bold leading-9 mr-10">
                        {formatMoneyVND(data?.price_unit || 0)}
                      </p>

                      {data?.price_unit !== data?.origin_price_unit ? (
                        <p className="text-gray-400 text-xs font-medium leading-7 line-through">
                          {formatMoneyVND(data?.origin_price_unit || 0)}
                        </p>
                      ) : null}
                    </div>

                    <div
                      onClick={() => handleAddToCart(data)}
                      className=" bg-primary h-[30px] w-[30px] min-w-[30px] rounded-full flex-center cursor-pointer"
                    >
                      {isAddingTocart ? (
                        <Spinner className="!text-primary !fill-white" />
                      ) : (
                        <ProductCartIcon className="text-white w-16 h-16" />
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="flex-1 text-orange text-base md:text-md font-bold leading-9">
                    Tư vấn dược sĩ
                  </p>
                )}
              </div>

              {/*rate & sale count */}
              <div className="flex items-end flex-wrap">
                <p className="text-gray-300 text-xs font-bold">
                  {`Đã bán: ${data?.sold_quantity || 0}`}
                </p>

                <div className="mx-6 w-0 h-14 border border-gray-200"></div>

                <Star readonly ratingValue={data?.star_rating * 20} size={14} />
              </div>
            </div>
          </div>

          <ModalProductDetail isOpen={showProductDetailModal} onClose={hanldeCloseModalDetail} />
        </div>
      ) : (
        <ProductItemLoading />
      )}
    </>
  )
}
