import { companyIconSm, NoteIconOutline } from '@/assets'
import { DOMAIN_URL, SWR_KEY } from '@/constants'
import { formatMoneyVND, generateProductSlug, isObjectHasValue, purchasableProduct } from '@/helper'
import { useAddToCart, useProductPromotion, useUser, useWishlist } from '@/hooks'
import { productAPI } from '@/services'
import { Product, ProductDetail as IProductDetail } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSWRConfig } from 'swr'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { PromotionLoading } from '../cart/promotionLoading'
import { Divider } from '../divider'
import { Image } from '../image'
import { CustomInputQuantity } from '../inputs'
import { ShareSocial } from '../shareSocial'
import { Spinner } from '../spinner'
import { Star } from '../star'
import { ListProductPromotion } from './listProductPromotion'
import ProductImg from './productImage'
import { ProductVariants } from './productVariants'
import WishlistBtn from './wishlistBtn'

interface ProductDetailProps {
  data: IProductDetail
  className?: string
  onChangeVariant?: (product: Product) => void
  type?: 'detail' | 'modal'
}

export const ProductDetail = ({ data, className, type = 'detail' }: ProductDetailProps) => {
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const { userInfo } = useUser({ shouldFetch: false })

  const { addWhishlist, deleteWhishlist, isLoading: isToggleWishlist } = useWishlist({})
  const { addToCart, isAddingTocart } = useAddToCart()

  const purchasable = purchasableProduct(data, userInfo)

  const { data: productPromotions, isValidating: isLoadProductPromotion } = useProductPromotion({
    key: `${SWR_KEY.get_product_promotion}_${data?.product_id}_${userInfo?.account?.partner_id}`,
    product_id: data?.product_id,
  })

  const [quantity, setQuantity] = useState<number>(1)
  const [currentProduct, setCurrentProduct] = useState<IProductDetail>(data)

  const handleAddToCart = (product: Product) => {
    if (!purchasable) return

    if (!userInfo?.account?.partner_id) {
      router.push(`${DOMAIN_URL}/login`)
      return
    }

    addToCart({
      ...product,
      quantity: quantity,
    })
  }

  const handleToggleWishlist = (productDetail: IProductDetail) => {
    if (!userInfo?.account?.partner_id) {
      toast.error('Vui lòng đăng nhập!')
      return
    }

    if (data?.liked) {
      deleteWhishlist(productDetail)
    } else {
      addWhishlist(productDetail)
    }
  }

  const handleChangeVariant = (product: Product) => {
    setCurrentProduct({
      ...currentProduct,
      product_id: product.product_id,
      product_name: product?.product_name,
      representation_image: product?.representation_image,
      image_ids: product?.image_ids,
      star_rating: product?.star_rating,
      rating_count: product?.rating_count,
      sold_quantity: product?.sold_quantity,
      product_available: product?.product_available,
      price_unit: product?.price_unit,
      origin_price_unit: product?.origin_price_unit,
      uom_id: product?.uom_id,
      attribute_minor_ids: product?.attribute_minor_ids, //update or not??? ask later!
      attribute_ids: product?.attribute_ids,
    })

    if (type === 'detail') {
      updateProductDescription(currentProduct?.product_id, product?.product_id)
    }
  }

  const updateProductDescription = async (current_product_id: number, new_product_id: number) => {
    try {
      const res: any = await productAPI.getProductDescription(new_product_id)

      mutate(`${SWR_KEY.get_product_description}_${current_product_id}`, res?.data, false)
    } catch (e) {
      console.log(e)
    }
  }

  const hanldeAttributeClick = (attribute_id: number, child_id: number, filterable: boolean) => {
    if (!filterable) return

    router.push(`/search?attributes_${attribute_id}=${child_id}`)
  }

  const hanldeCateoryClick = (category_id: number) => {
    if (!category_id) return
    router?.push(`/search?category_${category_id}=${category_id}`)
  }

  return (
    <div
      className={twMerge(`bg-white p-0 py-24 md:p-24 flex flex-col md:flex-row gap-24`, className)}
    >
      <div className="w-full md:w-[440px] px-12">
        {/* images slide show*/}
        <div className="mb-12">
          {currentProduct?.representation_image?.image_url ? (
            <ProductImg
              representation_image={currentProduct?.representation_image}
              images_ids={currentProduct?.image_ids}
              type="detail"
              className="w-full md:w-[440px]"
            />
          ) : (
            <Image src={companyIconSm} imageClassName="w-[440px] h-[440px] object-cover" />
          )}
        </div>

        {/* like & share */}
        <div className="flex justify-between flex-col md:flex-row">
          <div className="mr-8 flex items-center">
            <p className="text-text-color text-md font-semibold mr-12">Chia sẻ: </p>
            <ShareSocial
              title={currentProduct?.product_name}
              slug={`${DOMAIN_URL}/${generateProductSlug(
                currentProduct?.product_name,
                currentProduct?.product_id
              )}`}
            />
          </div>

          <WishlistBtn
            status={data?.liked || false}
            like_count={data?.liked_count}
            onChange={() => handleToggleWishlist(data)}
            isLoading={isToggleWishlist}
          />
        </div>
      </div>

      {/* infomation */}
      <div className="flex-1 p-12">
        <p className="text-text-color text-xl font-semibold leading-10 mb-16">
          {currentProduct?.product_name}
        </p>

        <div className="flex mb-16">
          <Star
            readonly
            ratingValue={currentProduct?.star_rating * 20}
            size={18}
            className="mb-12"
          />

          <Divider />

          <p className="text_md">{`${currentProduct?.rating_count || 0} Đánh giá`}</p>

          <Divider />

          <p className="text_md">{`${currentProduct?.sold_quantity || 0} Đã bán`}</p>
        </div>

        {purchasable ? (
          <p className="text_md mb-16">{`Tồn kho khả dụng: ${
            currentProduct?.stock_quantity?.factor || 0
          }`}</p>
        ) : null}

        {purchasable ? (
          <div className="flex h-fit gap-12 items-center mb-16">
            <p className="text-red text-2xl font-semibold">
              {formatMoneyVND(currentProduct?.price_unit || 0)}
              <span className="text-text-color text-sm ml-4">{`/ ${currentProduct?.uom_id?.uom_name}`}</span>
            </p>

            <p
              className={classNames(
                'text-gray-400 text-md font-medium line-through',
                currentProduct?.price_unit !== currentProduct?.origin_price_unit ? '' : 'hidden'
              )}
            >
              {formatMoneyVND(currentProduct?.origin_price_unit || 0)}
            </p>
          </div>
        ) : null}

        {/* category */}
        {isObjectHasValue(currentProduct?.category_id) ? (
          <div
            onClick={() => hanldeCateoryClick(currentProduct?.category_id?.category_id)}
            className="flex items-center gap-8 mb-8"
          >
            <p className="title_md !font-semibold">Danh mục: </p>

            <p className="text_md cursor-pointer !text-primary">{`${currentProduct?.category_id?.category_name}`}</p>
          </div>
        ) : null}

        {/* attribute */}
        {currentProduct?.attribute_minor_ids?.length > 0 ? (
          <div className="mb-16 overflow-scroll scrollbar-hide">
            {currentProduct?.attribute_minor_ids?.map((attribute) => {
              const filterable = attribute?.filterable

              return (
                <div key={attribute?.attribute_id} className="flex flex-wrap gap-8 mb-8">
                  <p className="title_md !font-semibold min-w-fit">{attribute?.attribute_name}: </p>

                  <div className="flex flex-1 flex-wrap items-center gap-8">
                    {attribute?.value_ids?.map((value) => (
                      <p
                        onClick={() =>
                          hanldeAttributeClick(attribute?.attribute_id, value?.value_id, filterable)
                        }
                        key={value?.value_id}
                        className={`text_md min-w-fit ${
                          filterable ? '!text-primary cursor-pointer active:opacity-50' : ''
                        }`}
                      >
                        {value?.value_name}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}

        {/* variant */}
        {data?.rel_attribute_ids?.length > 0 ? (
          <div className="mb-16">
            <ProductVariants
              data={data}
              selectedVariants={currentProduct?.attribute_ids}
              onChangeVariant={handleChangeVariant}
            />
          </div>
        ) : null}

        {isLoadProductPromotion ? (
          <PromotionLoading />
        ) : (
          <ListProductPromotion className="mb-16" data={productPromotions || []} />
        )}

        <div className="flex items-center gap-12 mb-16">
          <p className="text_md">{`Số lượng`}</p>
          {/* <InputQuantity
            minusIconClassName="text-md text-white"
            plusIconClassName="text-base text-white"
            inputClassName={`text-base text-text-color text-center outline-none`}
            quantity={quantity}
            onChangeQuantity={(q: number) => setQuantity(q)}
          /> */}

          <CustomInputQuantity
            defaultValue={quantity}
            onChangeQuantity={(q: number) => setQuantity(q)}
          />
        </div>

        <div className="flex gap-12 items-center">
          <Button
            onClick={() => {
              router.push('/quick_order')
            }}
            title="Đăng ký tư vấn"
            icon={<NoteIconOutline className="text-primary" />}
            className="rounded-[8px] p-10 bg-white border border-primary min-w-[167px] max-w-[30%] "
            textClassName="text-primary text-md"
          />

          {purchasable && (
            <Button
              onClick={() => handleAddToCart(currentProduct)}
              title={isAddingTocart ? '' : 'Chọn mua'}
              icon={isAddingTocart ? <Spinner className="!text-white !fill-primary" /> : undefined}
              className="rounded-[8px] p-10 bg-primary border border-primary min-w-[167px] max-w-[30%]"
              textClassName="text-white text-md"
            />
          )}
        </div>
      </div>
    </div>
  )
}
