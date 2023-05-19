import {
  CartProductAttribute,
  CartProductAttributeValue,
  Product,
  ProductAttribute,
  ProductAttributeValue,
  ProductDetail,
} from '@/types'
import produce from 'immer'
import { useState } from 'react'

interface ProductVariantsProps {
  data: ProductDetail
  selectedVariants: ProductAttribute[]
  onChangeVariant?: (product: Product) => void
}

export const ProductVariants = ({
  data,
  selectedVariants,
  onChangeVariant,
}: ProductVariantsProps) => {
  const [variants, setVariants] = useState<ProductAttributeValue[]>(() =>
    selectedVariants.map((item) => ({
      attribute_id: item.attribute.attribute_id,
      attribute_name: item.attribute.attribute_name,
      value_id: item.attribute_value.value_id,
      value_name: item.attribute_value.value_name,
    }))
  )

  const handleSelectVariantValue = (variant: ProductAttributeValue) => {
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
          const newProduct = relProduct
          // if (newProduct.product_id !== data.product_id) {
          //   onChangeVariant?.(newProduct)
          // }
          onChangeVariant?.(newProduct)
        }
      })
    }
  }

  const getProductVariantId = (data: (ProductAttributeValue | ProductAttribute)[]): string => {
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

  return (
    <div className="">
      {data?.rel_attribute_ids?.length > 0
        ? data?.rel_attribute_ids?.map((item, index) => (
            <div key={index} className="flex flex-wrap gap-12 items-center mb-12 last:mb-0">
              <p className="text_md">{item?.attribute_id?.attribute_name}</p>

              <div className="flex flex-1 flex-wrap gap-12 item-center">
                {item?.attribute_value?.map((value, index) => {
                  const isActive = selectedVariants?.some?.(
                    (v) =>
                      v.attribute?.attribute_id === item?.attribute_id?.attribute_id &&
                      v?.attribute_value?.value_id === value?.value_id
                  )

                  return (
                    <div
                      key={index}
                      onClick={() =>
                        handleSelectVariantValue({
                          attribute_id: item?.attribute_id?.attribute_id,
                          attribute_name: item.attribute_id.attribute_name,
                          value_id: value.value_id,
                          value_name: value.value_name,
                        })
                      }
                      className={`p-8 rounded-lg border min-w-fit w-[40px] cursor-pointer group hover:border-primary duration-200 ${
                        isActive ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <p
                        className={`text_base text-center group-hover:!text-primary ${
                          isActive ? '!text-primary' : '!text-gray'
                        }`}
                      >
                        {value?.value_name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        : null}
    </div>
  )
}
