import { DEFAULT_LIMIT } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { productAPI } from '@/services'
import { FilterProductParams, Product } from '@/types'
import { useState } from 'react'


interface useProductQueryRes {
  products: Product[]
  isLoadingMore: boolean
  hasMore: boolean
  isFetching: boolean
  handleFilter: (params: FilterProductParams) => void
}

export const useProductQuery = (): useProductQueryRes => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingMore, setLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasmore] = useState<boolean>(false)
  const [isFetching, setFetching] = useState<boolean>(false)

  const handleFilter = async (params: FilterProductParams) => {
    const _limit = Number(params?.limit) || DEFAULT_LIMIT
    const offset = Number(params?.offset) || 0

    if (offset >= _limit) {
      setLoadingMore(true)
    } else {
      setFetching(true)
    }

    

    try {
      let productsFetch: Product[] = []
      if (params?.attributes || params?.attribute_id || params?.sort_by) {
        const res: any = await productAPI.filterProduct({
          ...params,
          limit: _limit + 1,
        })

        if (isArrayHasValue(res?.data?.product_data)) {
          res?.data?.product_data.forEach((item: Product) => {
            productsFetch.push(item)
          })
        }
      } else {
        const res: any = await productAPI.filterProduct({
          ...params,
          limit: _limit + 1,
        })
        productsFetch = res?.data?.product_data || []
      }

      setHasmore(productsFetch?.length >= _limit)
      setLoadingMore(false)
      setFetching(false)

      const newProducts = productsFetch?.slice(0, _limit) || []

      // Assign if offset is smaller than limit otherwise push to array
      if (offset >= _limit) {
        if (
          isArrayHasValue(newProducts) &&
          !products?.some((item) =>
            newProducts?.find((x: Product) => x.product_id === item.product_id)
          )
        ) {
          setProducts([...products, ...newProducts])
        }
      } else {
        setProducts(newProducts)
      }
    } catch (error) {
      setLoadingMore(false)
      setFetching(false)
    }
  }



  return {
    products,
    isLoadingMore,
    isFetching,
    hasMore,
    handleFilter,
  }
}
