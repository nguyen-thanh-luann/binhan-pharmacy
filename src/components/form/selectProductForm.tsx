import { TimesIcon } from '@/assets'
import { isArrayHasValue } from '@/helper'
import { useClickOutside, useProductQuery } from '@/hooks'
import { Product } from '@/types'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { NotFound } from '../notFound'
import { SelectProductItem } from '../product'
import { Spinner } from '../spinner'
import { SearchField } from './searchField'
import { SWR_KEY } from '@/constants'

interface SelectProductFormProps {
  className?: string
  onClose?: () => void
  onSubmit?: (data: Product[]) => void
  defaultProductSelected?: Product[]
}

export const SelectProductForm = ({
  className,
  onClose,
  onSubmit,
  defaultProductSelected,
}: SelectProductFormProps) => {
  const [productSelected, setProductSelected] = useState<Product[]>(defaultProductSelected || [])

  const ref = useRef<HTMLDivElement>(null)

  useClickOutside([ref], () => {
    onClose?.()
  })

  const { products, filter, hasMore, getMore } = useProductQuery({
    key: `${SWR_KEY.search_product}`,
    params: {
      product_type: 'product_product',
    },
  })

  const handleSubmit = () => {
    if (productSelected) {
      onSubmit?.(productSelected)
      onClose?.()
    }
  }

  const searchProducts = async (value: string) => {
    if (!value) return

    filter({
      product_type: 'product_product',
      keyword: value,
    })
  }

  const handleSelectProduct = (product: Product) => {
    const index = productSelected?.findIndex((p) => p.product_id === product?.product_id)

    if (index !== -1) {
      //update quantity or not???
      return
    }

    setProductSelected([...productSelected, { ...product, quantity: 1 }])
  }

  const hanldeUnselectProduct = (product: Product) => {
    const index = productSelected?.findIndex((p) => p.product_id === product?.product_id)

    if (index !== -1) {
      setProductSelected([...productSelected.filter((p) => p.product_id !== product.product_id)])
    }
  }

  return (
    <div ref={ref} className={twMerge(classNames(`relative rounded-md bg-white`, className))}>
      <div className="p-12 sticky top-0 z-40 bg-white">
        <div className="flex-between mb-12">
          <p className="text-lg font-bold text-center capitalize">Chọn sản phẩm</p>

          <button onClick={() => onClose?.()} className="">
            <TimesIcon className="text-gray" />
          </button>
        </div>

        <SearchField
          className="border p-8"
          placeholder="Vui lòng nhập tên sản phẩm cần tìm"
          onChangeWithDebounceValue={(val) => searchProducts(val as string)}
        />
      </div>

      <div
        id="listQuickOrderProducts"
        className="max-h-[350px] overflow-scroll scrollbar-hide p-12"
      >
        <InfiniteScroll
          dataLength={products?.length || 0}
          next={() => getMore()}
          hasMore={hasMore}
          loader={
            hasMore ? (
              <div className="my-12 flex-center">
                <Spinner />
              </div>
            ) : null
          }
          scrollableTarget="listQuickOrderProducts"
        >
          <div className="">
            {isArrayHasValue(products) ? (
              products?.map((product) => (
                <SelectProductItem
                  product={product}
                  key={product.product_id}
                  type="select"
                  className="mb-12 last:mb-0"
                  onClick={(product) => handleSelectProduct(product)}
                />
              ))
            ) : (
              <NotFound notify="Không tìm thấy sản phẩm nào!" />
            )}
          </div>
        </InfiniteScroll>
      </div>

      {isArrayHasValue(productSelected) ? (
        <div className="p-12">
          <p className="text-md font-bold mb-12 bg-primary-200 rounded-full p-4 px-8 w-fit">
            Sản phẩm đã chọn
          </p>

          {productSelected?.map((product) => (
            <SelectProductItem
              product={product}
              key={product.product_id}
              type="unSelect"
              className="mb-12 last:mb-0"
              onClick={(product) => hanldeUnselectProduct(product)}
            />
          ))}
        </div>
      ) : null}

      <div className="flex-center border-t border-gray-200 py-12 sticky bottom-0 z-40 bg-white">
        <Button
          title="Hoàn tất"
          className="w-[100px] border border-primary rounded-lg bg-primary"
          textClassName="text-white"
          onClick={handleSubmit}
        />
      </div>
    </div>
  )
}
