import { DownIcon } from '@/assets'
import { useClickOutside, useModal } from '@/hooks'
import {
  CartProduct,
  CartProductAttribute,
  CartProductAttributeValue,
  RelProductQty,
} from '@/types'
import produce from 'immer'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'

export interface CartProductVariantsProps {
  data: CartProduct
  selectedVariants: CartProductAttribute[]
  onChange?: (val: RelProductQty) => void
  onClose?: () => void
  className?: string
}

export const CartProductVariants = ({
  data,
  selectedVariants,
  className,
  onChange,
}: CartProductVariantsProps) => {
  const [product, setProduct] = useState<RelProductQty>(() => {
    const { product_id, stock, quantity, price_unit } = data
    return { ...product_id, stock, price_unit, quantity }
  })

  const VariantModalref = useRef<HTMLDivElement>(null)

  const { visible: showVariantModal, closeModal: closeVariantModal, toggle } = useModal()

  useClickOutside([VariantModalref], closeVariantModal)

  const [variants, setVariants] = useState<CartProductAttributeValue[]>(() =>
    selectedVariants.map((item) => ({
      attribute_id: item.attribute.attribute_id,
      attribute_name: item.attribute.attribute_name,
      value_id: item.attribute_value.value_id,
      value_name: item.attribute_value.value_name,
    }))
  )

  const selectVariants = (variant: CartProductAttributeValue) => {
    const newVariants = produce(variants, (draft) => {
      const variantIndex = draft.findIndex((item) => item.attribute_id === variant.attribute_id)
      if (variantIndex !== -1) {
        draft[variantIndex] = variant
      } else {
        draft.push(variant)
      }
    })
    setVariants(newVariants)

    if (newVariants?.length === data?.attribute_ids?.length) {
      data.rel_product_ids.forEach((relProduct) => {
        const newVariantId = getProductVariantId(newVariants)
        const relProductVariantId = getProductVariantId(relProduct.attribute_ids)
        if (newVariantId === relProductVariantId) {
          const newProduct = { ...relProduct, quantity: product.quantity }
          if (newProduct.product_id === data.product_id.product_id) {
            newProduct.price_unit = data.price_unit
          }
          setProduct(newProduct)
        }
      })
    }
  }

  const changeVariant = () => {
    if (!product || variants?.length < data?.product_id.attribute_ids?.length) return

    const newVariantId = getProductVariantId(variants)
    const selectedVariantId = getProductVariantId(data.product_id.attribute_ids)
    if (newVariantId !== selectedVariantId || data?.quantity !== product?.quantity) {
      onChange?.(product)
    }

    closeVariantModal()
  }

  const getProductVariantId = (
    data: (CartProductAttributeValue | CartProductAttribute)[]
  ): string => {
    return data
      .map(
        (item) =>
          `${
            (item as CartProductAttributeValue)?.attribute_id ||
            (item as CartProductAttribute)?.attribute?.attribute_id
          }${
            (item as CartProductAttributeValue)?.value_id ||
            (item as CartProductAttribute)?.attribute_value?.value_id
          }`
      )
      .join('')
  }

  const renderVariantOptions = () => {
    return (
      <div className="p-12 max-h-[250px] overflow-scroll scrollbar-hide">
        {data?.product_id?.rel_attribute_ids?.map((item, index) => (
          <div className="mb-12" key={index}>
            <p className="text-base font-bold text-text-color mb-8">{`${item?.attribute_id?.attribute_name}:`}</p>
            <div className="flex gap-12 flex-wrap">
              {item?.attribute_value?.map((value, index) => {
                const isActive = variants?.some?.(
                  (v) =>
                    v.attribute_id === item?.attribute_id?.attribute_id &&
                    v?.value_id === value?.value_id
                )
                return (
                  <div
                    onClick={() =>
                      !isActive &&
                      selectVariants({
                        attribute_id: item?.attribute_id?.attribute_id,
                        attribute_name: item.attribute_id.attribute_name,
                        value_id: value.value_id,
                        value_name: value.value_name,
                      })
                    }
                    className={`w-fit min-w-[80px] border  rounded-md p-8 cursor-pointer ${
                      isActive ? 'border-primary' : 'border-gray-200'
                    }`}
                    key={index}
                  >
                    <p
                      className={`text-sm text-center ${isActive ? 'text-primary' : ''}`}
                    >{`${value?.value_name}`}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={VariantModalref} className={twMerge(classNames('relative', className))}>
      <div onClick={toggle} className="flex items-center gap-12 cursor-pointer active:opacity-50 ">
        {/* style 1 */}
        {/* <div className="line-clamp-2 flex">
          {selectedVariants?.map((variant, index) => (
            <span key={index} className="text-primary text-base w-fit">
              {`${variant?.attribute_value?.value_name} ${
                index === selectedVariants?.length - 1 ? '' : ', '
              }`}
            </span>
          ))}
        </div>

        <DownIcon className="w-10 min-w-[10px] text-primary" />
         */}

        {/* style 2 */}
        <div className="">
          {selectedVariants?.map((variant, index) => (
            <div key={index} className="w-fit flex items-center gap-8">
              <p className="text-base text-primary">{`${variant?.attribute?.attribute_name}: ${variant?.attribute_value?.value_name}`}</p>

              {index === 0 ? <DownIcon className="w-10 min-w-[10px] text-primary" /> : null}
            </div>
          ))}
        </div>
      </div>

      {/* on tablet */}
      {showVariantModal ? (
        <div className="absolute hidden md:block z-50 w-[350px] max-w-[90vw] animate-fade bg-white shadow-shadow-4 rounded-lg">
          {renderVariantOptions()}

          <div className="flex justify-end gap-12 p-12">
            <Button title="Trở lại" className="w-[100px] border border-gray-100" onClick={closeVariantModal} />

            <Button
              title="Xác nhận"
              className="w-[100px] border border-primary rounded-lg bg-primary"
              textClassName="text-white"
              onClick={changeVariant}
            />
          </div>
        </div>
      ) : null}

      {/* on Mobile */}
      {showVariantModal ? (
        <div className="fixed md:hidden bottom-0 right-0 left-0 z-50">
          <div className="relative h-[100vh] bg-black-400 animate-fade">
            <div className="absolute bottom-0 bg-white w-full rounded-tl-2xl rounded-tr-2xl">
              {renderVariantOptions()}

              <div className="flex justify-end gap-12 p-12">
                <Button
                  title="Trở lại"
                  className="w-[100px]"
                  onClick={closeVariantModal}
                />

                <Button
                  title="Xác nhận"
                  className="w-[100px] border border-primary rounded-lg bg-primary font-bold"
                  textClassName="text-white"
                  onClick={changeVariant}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
