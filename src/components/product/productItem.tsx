import { ProductCartIcon, error404 } from '@/assets'
import { API_URL } from '@/constants'
import { formatMoneyVND, generateProductSlug, getDiscountPercent, isObjectHasValue } from '@/helper'
import { useAddToCart, useModal } from '@/hooks'
import { setProduct } from '@/store'
import { Product } from '@/types'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import { Image } from '../image'
import { ModalProductDetail } from '../modal'
import { Star } from '../star'
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
  const productSlug = generateProductSlug(data?.product_name, data?.product_id)
  const router = useRouter()
  const dispatch = useDispatch()
  const { addToCart } = useAddToCart()
  const {
    visible: showProductDetailModal,
    closeModal: closeProductDetailModal,
    openModal: openProductDetailModal,
  } = useModal()

  const handleAddToCart = (product: Product) => {

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

  const discount = getDiscountPercent(data)

  return (
    <>
      {!isLoading && isObjectHasValue(data) ? (
        <div
          className={twMerge(
            classNames(
              'product-item group rounded-[6px] bg-product-item-background hover:shadow-shadow-3 overflow-hidden duration-200 ease-in-out',
              className
            )
          )}
        >
          {/* image group */}
          <div className="relative">
            <Link href={productSlug}>
              <div className="mb-8 rounded-tl-[6px] rounded-tr-[6px] max-w-[230px] max-h-[230px] relative overflow-hidden">
                <Image
                  src={
                    data?.representation_image?.image_url
                      ? `${API_URL}${data?.representation_image?.image_url}`
                      : error404
                  }
                  imageClassName="object-cover w-full hover:scale-110 duration-200 ease-in-out aspect-[1/1]"
                  className=""
                />
              </div>
            </Link>

            {/* packing rule */}
            <div
              className={`absolute top-3 ${
                discount > 0 ? 'right-25' : 'right-3'
              } z-10 min-w-[40px] max-w-[86px] max-h-[35px] overflow-scroll rounded-[10px] border border-primary px-4 py-2 bg-white bg-opacity-70`}
            >
              <p className="text-xs font-medium line-clamp-2 flex-center h-full">
                {data?.uom_id?.uom_full_standard_name || data?.uom_id?.uom_name}
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
            <Link href={productSlug}>
              <p className="h-[43px] line-clamp-2 w-full text-text-color text-base md:text-md font-bold leading-9 mb-8 group-hover:text-primary duration-200 ease-in-out">
                {data?.product_name}
              </p>
            </Link>

            {/* properties list */}
            <div className="relative h-[45px] flex items-center overflow-scroll scrollbar-hide mb-8">
              <Swiper
                className="w-full"
                slidesPerView={1.5}
                slidesPerGroup={1}
                navigation={true}
                pagination={{
                  clickable: true,
                }}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay, Pagination, Navigation]}
              >
                <div>
                  {/* attribute */}
                  {data?.attribute_minor_ids?.map((attribute) => {
                    if (attribute?.filterable) {
                      return attribute?.value_ids?.map((value) => (
                        <SwiperSlide key={value?.value_id}>
                          <p
                            onClick={() =>
                              hanldePropertyClick({
                                type: 'attribute',
                                attribute_id: attribute?.attribute_id,
                                attribute_value_id: value?.value_id,
                              })
                            }
                            className="text-primary w-fit bg-primary-100 p-4 px-6 rounded-full cursor-pointer font-medium text-xs md:text-sm leading-7 mr-8 last:mr-0 line-clamp-1"
                          >
                            {value?.value_name}
                          </p>
                        </SwiperSlide>
                      ))
                    } else {
                      return null
                    }
                  })}

                  {/* category */}
                  {isObjectHasValue(data?.category_id) ? (
                    <SwiperSlide key={data?.category_id?.category_id}>
                      <p
                        onClick={() =>
                          hanldePropertyClick({
                            type: 'category',
                            category_id: data?.category_id?.category_id,
                          })
                        }
                        className="text-primary w-fit bg-primary-100 p-4 px-6 rounded-full cursor-pointer font-medium text-xs md:text-sm leading-7 line-clamp-1"
                      >
                        {data?.category_id?.category_name}
                      </p>
                    </SwiperSlide>
                  ) : null}
                </div>
              </Swiper>
            </div>

            <div className="relative">
              {/* price */}
              <div className="mb-8 flex items-center h-[22px]">
                <p className="text-orange text-base md:text-md font-bold leading-9 mr-10">
                  {formatMoneyVND(data?.price_unit || 0)}
                </p>

                {data?.price_unit !== data?.origin_price_unit ? (
                  <p className="text-gray-400 text-xs font-medium leading-7 line-through">
                    {formatMoneyVND(data?.origin_price_unit || 0)}
                  </p>
                ) : null}
              </div>

              {/*rate & sale count */}
              <div className="flex items-end h-[20px] flex-wrap">
                <p className="text-gray-300 text-xs font-bold">
                  {`Đã bán: ${data?.sold_quantity || 0}`}
                </p>

                <div className="mx-6 w-0 h-14 border border-gray-200"></div>

                <Star readonly ratingValue={data?.star_rating * 20} size={14} />
              </div>

              <div
                onClick={() => handleAddToCart(data)}
                className="absolute bottom-[30%] right-0 z-30 bg-primary h-[30px] w-[30px] min-w-[30px] rounded-full flex-center cursor-pointer"
              >
                <ProductCartIcon className="text-white w-16 h-16" />
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
