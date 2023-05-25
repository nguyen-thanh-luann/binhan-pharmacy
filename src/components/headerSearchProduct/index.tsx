import { searchEmpty } from '@/assets'
import { generateProductSlug, isArrayHasValue } from '@/helper'
import { useClickOutside, useModal, useProductQuery } from '@/hooks'
import {
  addSearchProductHistory,
  deleteSearchProductHistory,
  selectSearchProductHistory,
} from '@/store'
import { Product } from '@/types'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SearchForm } from '../form'
import { NotFound } from '../notFound'
import { SearchProductItem, SearchProductItemLoading } from '../product'
import { SWR_KEY } from '@/constants'

export const HeaderSearchProduct = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string>()
  const { visible, closeModal, openModal } = useModal()
  const searchProductHistory = useSelector(selectSearchProductHistory)

  useClickOutside([ref], () => closeModal())

  const { products, filter, isValidating, isLoadingMore } = useProductQuery({
    key: `${SWR_KEY.search_product}`,
    params: {
      product_type: 'product_product',
    },
  })

  const searchProducts = async (value: string) => {
    if (!value) return

    filter({
      product_type: 'product_product',
      keyword: value,
    })
  }

  const handleSubmit = (val: string) => {
    closeModal()
    router.push(`/search?keyword=${val}`)
  }

  const handleClickSearchResultItem = (name: string, id: number) => {
    router.push(`/${generateProductSlug(name, id)}`)
  }

  const handleDeleteSearchResultItem = (id: number) => {
    dispatch(deleteSearchProductHistory(id))
  }

  return (
    <div ref={ref} className="relative">
      <SearchForm
        placeholder="Bạn tìm gì hôm nay"
        className="rounded-full shadow-shadow-1 bg-background"
        buttonClassName="bg-background hidden md:flex"
        inputClassName="bg-background !text-text-color !leading-8 !text !font-bold"
        timer={500}
        onFocus={openModal}
        onSubmit={(val) => handleSubmit(val as string)}
        onChange={(val) => setValue(val as string)}
        onChangeWithDebounceValue={(val) => searchProducts(val as string)}
      />

      <div
        className={`absolute shadow-shadow-1 rounded-bl-[10px] rounded-br-[10px] w-full z-50 bg-background ${
          visible ? 'block' : 'hidden'
        }`}
      >
        {/* call api to search product here */}
        {isLoadingMore || isValidating ? (
          <div className="p-8">
            {Array?.from({ length: 7 }).map((_, index) => (
              <SearchProductItemLoading key={index} />
            ))}
          </div>
        ) : value ? (
          <div>
            {!products || products?.length === 0 ? (
              <div className="">
                <p className="text-base text-text-color p-8">{`Không có kết quả nào cho: "${value}"`}</p>
              </div>
            ) : (
              <div>
                <div className="border-b border-gray-200">
                  <p className="text-base text-text-color p-8">
                    {`Hiển thị ${products?.length || 0} kết quả cho: "${value}"`}
                  </p>
                </div>

                <div className="max-h-[300px] md:max-h-[70vh] overflow-scroll scrollbar-hide">
                  {products?.map((item: any) => (
                    <SearchProductItem
                      data={item}
                      key={item.id}
                      onChange={(val) => {
                        dispatch(addSearchProductHistory(item))
                        handleClickSearchResultItem(val.product_name, val.product_id)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-h-[300px] md:max-h-[70vh] overflow-scroll scrollbar-hide">
            {isArrayHasValue(searchProductHistory) ? (
              <div className="">
                <p className="text-base text-text-color p-8">Lịch sử tìm kiếm</p>
                <div>
                  {searchProductHistory.map((item: Product) => (
                    <SearchProductItem
                      data={item}
                      key={item.product_id}
                      onChange={(val) => {
                        handleClickSearchResultItem(val.product_name, val.product_id)
                      }}
                      onDelete={() => {
                        handleDeleteSearchResultItem(item?.product_id || 0)
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12">
                <NotFound image={searchEmpty} notify="Không tìm thấy lịch sử tìm kiếm!" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
