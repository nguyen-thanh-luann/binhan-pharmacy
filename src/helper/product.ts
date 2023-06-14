import {
  AttributeReq, FilterProductParams,
  Product,
  ProductDescription,
  ProductDetail,
  ProductfilterSortType,
  UserInfo
} from '@/types'
import { NextRouter } from 'next/router'
import { isObjectHasValue } from './functions'

export function generateFilterProductParamFormRouter(router: NextRouter): FilterProductParams {
  let attribute: any = {}
  let attribute_ids: AttributeReq[] = []

  let category: any = {}
  let category_ids: number[] = []

  let category_minor: any = {}
  let category_minor_ids: number[] = []

  Object.keys(router.query).forEach((key) => {
    if (key.includes('attributes_')) {
      attribute[key] = router.query[key]
    } else if (key?.includes('minor_category_')) {
      category_minor[key] = router?.query[key]
    } else if (key?.includes('category_')) {
      category[key] = router?.query[key]
    }
  })

  // handle attribute data from params
  if (isObjectHasValue(attribute)) {
    attribute_ids = Object.keys(attribute).reduce(
      (prev: AttributeReq[], curr) =>
        [...prev].concat({
          attribute_id: Number(curr.split('attributes_')[1]) || 0,
          attribute_value_ids: curr.includes('attributes_')
            ? typeof attribute[curr] === 'string'
              ? [Number(attribute[curr])]
              : attribute[curr].map((x: string) => Number(x))
            : [],
        }),
      []
    )
  }

  // handle category data from params
  if (isObjectHasValue(category)) {
    category_ids = Object.keys(category)?.map((c) => {
      return Number(c?.split('category_')[1] || 0)
    })
  }

  // handle category minor data from params
  if (isObjectHasValue(category_minor)) {
    category_minor_ids = Object.keys(category_minor)?.map((c) => {
      return Number(c?.split('minor_category_')[1] || 0)
    })
  }

  return {
    keyword: router?.query?.keyword || '',
    sort_by: (router?.query?.sort_by as ProductfilterSortType) || undefined,
    category_ids,
    category_minor_ids,
    attributes: attribute_ids,
    price_min: Number(router?.query?.price_min) || undefined,
    price_max: Number(router?.query?.price_max) || undefined,
  }
}

export function purchasableProduct(
  product: Product | ProductDetail,
  userInfo: UserInfo | undefined
) {
  if (!product || !userInfo) return false
  // if product is medicine => just drugstore account can buy it!

  if (product?.product_type === 'medicine') {
    if (userInfo?.account?.medicine_account_type === 'drugstore_account') {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

export function calcDiscountPercent(product: Product): number {
  if (!product || product?.origin_price_unit >= product?.price_unit) return 0

  return (product?.price_unit / product?.origin_price_unit) * 100
}

export const isProductDescContainChild = (data: ProductDescription, category_id: number) => {
  const index = data?.child?.findIndex((desc) => desc?.category_id === category_id)

  if (index !== -1) return true

  return false
}
