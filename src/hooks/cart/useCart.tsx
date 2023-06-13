/* eslint-disable react-hooks/exhaustive-deps */
import { LIMIT_PRODUCT_IN_CATEGORY, SWR_KEY } from '@/constants'
import { getProductsCheckedInCart } from '@/helper'
import { useAsync } from '@/hooks'
import { cartAPI } from '@/services'
import { RootState } from '@/store'
import {
  CartCategory,
  CartCompany,
  CartProduct,
  GetMoreCategoryInCompany,
  GetProductsInCartReq,
  GetProductsInCartRes,
  ToggleCheckProduct,
  UpdateProduct,
  UserInfo,
} from '@/types'
import produce from 'immer'
import _ from 'lodash'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR, { useSWRConfig } from 'swr'
import { useApplyPromotionToCart } from './useApplyPromotionToCart'

const LIMIT_COMPANY = 1
const LIMIT_CATEGORY = 4
const LIMIT_PRODUCT = 12

export const useCarts = () => {
  const userInfo = useSWR<UserInfo>(SWR_KEY.get_user_information)?.data?.account
  const previousRoute = useSelector((state: RootState) => state.common.previousRoute)
  const customer_id = userInfo?.partner_id
  const { mutate: mutateRemote, cache } = useSWRConfig()
  const { asyncHandler } = useAsync()
  const { applyPromotionsToCart: applyPromotionsToCartHook } = useApplyPromotionToCart()
  const { data, isValidating, mutate } = useSWR<GetProductsInCartRes, any>(
    SWR_KEY.cart_list,
    previousRoute?.includes('/checkout')
      ? null
      : () => {
          mutateRemote(SWR_KEY.cartSummary, 0, false)
          return fetcherHandler()
        }
  )
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const isCheckAll = !!data?.paginate?.total && data.total_company_checked === data.paginate.total

  const applyPromotionsToCart = useCallback(_.debounce(applyPromotionsToCartHook, 2000), [])

  async function fetcherHandler(
    params?: GetProductsInCartReq,
    shouldCheck = true
  ): Promise<GetProductsInCartRes> {
    try {
      if (shouldCheck) {
        await cartAPI.toggleCheckProductsInCart({ is_check: false })
      }

      const res = await cartAPI.getShoppingCart({
        limit: LIMIT_COMPANY,
        limit_category: LIMIT_CATEGORY,
        limit_product: LIMIT_PRODUCT_IN_CATEGORY,
        category_type: 'category_minor',
        ...params,
      })

      return res?.data
    } catch (error) {
      return {
        is_check: false,
        paginate: { limit: 0, offset: 0, total: 0 },
        total_company_checked: 0,
        result: [],
      }
    }
  }

  const refresh = async () => {
    try {
      setHasMore(true)
      mutate()
    } catch (error) {
      console.log(error)
    }
  }

  const mutateCartCount = () => {
    mutateRemote(SWR_KEY.cart_count)
  }

  const getCartData = (): GetProductsInCartRes | undefined => cache.get(SWR_KEY.cart_list)?.data

  const getProductsChecked = () => getProductsCheckedInCart(data)

  const applyPromotionsToNewCompanies = async (cart: GetProductsInCartRes) => {
    if (!customer_id || !cart?.result?.length) return

    const shopping_cart_ids: number[] = []
    const cart_category_ids: number[] = []
    const shopping_cart_product_ids: number[] = []

    cart.result.forEach((company) => {
      if (company.is_check) {
        if (company.has_promotion) {
          shopping_cart_ids.push(company.shopping_cart_id)
        }

        company.shopping_cart_category.forEach((category) => {
          if (category.has_promotion) {
            cart_category_ids.push(category.cart_category_id)
          }

          category.shopping_cart_product.forEach((product) => {
            if (product.is_check && product.has_promotion) {
              shopping_cart_product_ids.push(product.shopping_cart_product_id)
            }
          })
        })
      }
    })

    if (
      (shopping_cart_ids?.length || cart_category_ids.length || shopping_cart_product_ids.length) &&
      customer_id
    ) {
      await applyPromotionsToCart({
        cart_category_ids,
        shopping_cart_ids,
        shopping_cart_product_ids,
        customer_id,
      })
    }
  }

  const getMoreCompany = async () => {
    const data = getCartData()
    if (!data?.result?.length || data.result.length >= data.paginate.total) return

    try {
      const response = await fetcherHandler(
        {
          offset: data.paginate.offset + data.paginate.limit,
        },
        false
      )
      setIsLoadingMore(false)

      if (!response?.result?.length) return

      const cart = produce(data, (draft) => {
        draft.result.push(...response.result)
        draft.paginate = response.paginate
        draft.is_check = response.is_check
        draft.total_company_checked = response.total_company_checked
      })

      mutate(cart, false)
      await applyPromotionsToNewCompanies(response)
    } catch (error) {
      setIsLoadingMore(false)
    }
  }

  const getMoreCategoryInCompany = async ({ company, companyIndex }: GetMoreCategoryInCompany) => {
    const { limit, offset, total } = company.paginate_cart_category
    const data = getCartData()
    if (!data?.result?.length || company.shopping_cart_category.length >= total) return

    try {
      const response = await cartAPI.getCartCategoriesInCompany({
        limit_product: LIMIT_PRODUCT,
        offset: offset + limit,
        shopping_cart_id: company.shopping_cart_id,
        limit: LIMIT_CATEGORY,
      })
      setIsLoadingMore(false)

      const { paginate, result } = response.data
      if (!result?.length) return

      mutate(
        produce(data, (draft) => {
          const company = draft.result[companyIndex]
          if (company?.shopping_cart_id) {
            company.shopping_cart_category.push(...result)
            company.paginate_cart_category = paginate
          }
        }),
        false
      )

      const cart_category_ids: number[] = []
      const shopping_cart_product_ids: number[] = []

      result.forEach((category) => {
        if (category.has_promotion) {
          cart_category_ids.push(category.cart_category_id)
        }

        category.shopping_cart_product.forEach((product) => {
          if (product.is_check && product.has_promotion) {
            shopping_cart_product_ids.push(product.shopping_cart_product_id)
          }
        })
      })

      if (customer_id) {
        await applyPromotionsToCart({
          cart_category_ids,
          shopping_cart_ids: [],
          shopping_cart_product_ids,
          customer_id,
        })
      }
    } catch (error) {
      setIsLoadingMore(false)
    }
  }

  const getMoreCart = async () => {
    const data = getCartData()
    if (!data?.result?.length || isLoadingMore || !hasMore) return
    // let categoryHasMoreProduct: GetMoreProductInCategory | null = null
    let companyHasMoreCategory: GetMoreCategoryInCompany | null = null
    data.result.forEach((company, companyIndex) => {
      if (company.shopping_cart_category?.length < company.paginate_cart_category.total) {
        companyHasMoreCategory = {
          company,
          companyIndex,
        }
        return
      }
      // company.shopping_cart_category?.forEach((category, categoryIndex) => {
      //   if (category.shopping_cart_product?.length < category.paginate?.total) {
      //     categoryHasMoreProduct = {
      //       category,
      //       categoryIndex,
      //       companyIndex
      //     }
      //     return
      //   }
      // })
    })

    // if (categoryHasMoreProduct) {
    //   await getMoreProductInCategory(categoryHasMoreProduct)
    // }
    setIsLoadingMore(true)
    if (companyHasMoreCategory) {
      await getMoreCategoryInCompany(companyHasMoreCategory)
    } else if (data?.result?.length < data?.paginate?.total) {
      await getMoreCompany()
    } else {
      setHasMore(false)
    }
    setIsLoadingMore(false)
  }

  const updateProduct = async (params: UpdateProduct) => {
    const data = getCartData()
    if (!data?.result?.length) return

    const { companyIndex, productIndex, categoryIndex, product, type } = params
    let shoppingCartProductIdDelete = 0
    let cart_category_ids: number[] = []
    let shopping_cart_ids: number[] = []

    mutate(
      produce(data, (draft) => {
        const company = draft?.result?.[companyIndex] as CartCompany
        const category = company?.shopping_cart_category?.[categoryIndex]
        if (!category?.shopping_cart_product?.[productIndex]) return

        const products = category.shopping_cart_product
        products[productIndex] = product

        if (product.is_check) {
          if (company.has_promotion) {
            shopping_cart_ids.push(company.shopping_cart_id)
          }
          if (category.has_promotion) {
            cart_category_ids.push(category.cart_category_id)
          }
        }

        if (type === 'uom' || type === 'variant') {
          const duplicateIndex = products.findIndex(
            (item) =>
              item.product_id.product_id === product.product_id.product_id &&
              item.shopping_cart_product_id !== product.shopping_cart_product_id &&
              item.uom_id.uom_id === product.uom_id.uom_id
          )
          if (duplicateIndex !== -1) {
            shoppingCartProductIdDelete = (products[duplicateIndex] as CartProduct)
              .shopping_cart_product_id
          }
        }
      }),
      false
    )

    if (shoppingCartProductIdDelete !== 0) {
      deleteCartItemHandler(
        (product) => product.shopping_cart_product_id === shoppingCartProductIdDelete
      )
    } else {
      if (customer_id) {
        await applyPromotionsToCart({
          shopping_cart_product_ids: product.has_promotion
            ? [product.shopping_cart_product_id]
            : [],
          cart_category_ids,
          shopping_cart_ids,
          customer_id,
        })
      }
    }
  }

  const deleteCartItemHandler = async (cb: (data: CartProduct, index: number) => boolean) => {
    const data = getCartData()
    if (!data?.result?.length) return

    let cart_category_ids: number[] = []
    let shopping_cart_ids: number[] = []

    const result = produce(data, (draft) => {
      const shoppingCartIds: number[] = [] // to delete later

      draft.result.forEach((company) => {
        let shopping_cart_id = 0

        company.shopping_cart_category.forEach((category) => {
          let cart_category_id = 0

          category.shopping_cart_product = category.shopping_cart_product.filter(
            (product, productIndex) => {
              const shouldDelete = cb(product, productIndex)
              if (shouldDelete) {
                company.total_product -= 1
                category.paginate.total -= 1

                if (product.is_check) {
                  company.total_product_checked -= 1
                }

                if (product.is_check && product.product_id?.product_id) {
                  product.promotions_product_applied = []
                  category.promotions_category_applied = []
                  company.promotions_applied = []

                  if (category.has_promotion) {
                    cart_category_id = category.cart_category_id
                  }
                  if (company.has_promotion) {
                    shopping_cart_id = company.shopping_cart_id
                  }
                }
              }

              return !shouldDelete
            }
          )

          if (!category?.shopping_cart_product?.length) {
            company.paginate_cart_category.total -= 1
            company.total_category -= 1
            company.shopping_cart_category = company.shopping_cart_category.filter(
              (item) => item.cart_category_id !== category.cart_category_id
            )
          }

          if (cart_category_id) {
            cart_category_ids.push(cart_category_id)
          }
        })

        const isCheck = company.total_product_checked === company.total_product
        if (company.is_check !== isCheck) {
          company.is_check = isCheck
          draft.total_company_checked += isCheck ? 1 : -1
        }

        if (!company?.shopping_cart_category?.length) {
          shoppingCartIds.push(company.shopping_cart_id)
          draft.paginate.total -= 1
          if (company.is_check) {
            draft.total_company_checked -= 1
          }
        }

        if (shopping_cart_id) {
          shopping_cart_ids.push(shopping_cart_id)
        }
      })

      if (shoppingCartIds?.length) {
        draft.result = draft.result.filter(
          (item) => !shoppingCartIds.includes(item.shopping_cart_id)
        )
      }
    })

    if (!result?.result?.length) {
      mutate()
    } else {
      mutate(result, false)

      if (customer_id) {
        await applyPromotionsToCart({
          shopping_cart_ids,
          cart_category_ids,
          shopping_cart_product_ids: [],
          customer_id,
        })
      }
    }

    mutateCartCount()

    return result
  }

  const deleteCheckedCartItems = () => {
    const productsChecked = getProductsChecked()
    if (!productsChecked?.length) return

    asyncHandler({
      fetcher: cartAPI.deleteCartProduct({
        cart_product_ids: productsChecked.map((item) => item.shopping_cart_product_id),
        category_type: 'category_minor',
      }),
      onSuccess: () => {
        deleteCartItemHandler((product) => product.is_check)
      },
      config: { showSuccessMsg: false },
    })
  }

  const deleteCartItem = ({ shopping_cart_product_id }: CartProduct) => {
    deleteCartItemHandler(
      (product) => product.shopping_cart_product_id === shopping_cart_product_id
    )
  }

  const toggleCheckProduct = async (params: ToggleCheckProduct) => {
    const data = getCartData()
    if (!data?.result?.length) return

    const { categoryIndex, companyIndex, productIndex } = params
    const shopping_cart_ids: number[] = []
    const cart_category_ids: number[] = []
    const shopping_cart_product_ids: number[] = []

    const result = produce(data, (draft) => {
      const company = draft?.result?.[companyIndex] as CartCompany
      const category = company?.shopping_cart_category?.[categoryIndex] as CartCategory
      const product = category?.shopping_cart_product?.[productIndex]
      if (!product?.shopping_cart_product_id) return

      const isCheck = !product.is_check
      product.is_check = isCheck
      company.total_product_checked += isCheck ? 1 : -1

      const isCompanyCheck = company.total_product_checked === company.total_product
      if (isCompanyCheck !== company.is_check) {
        draft.total_company_checked += isCheck ? 1 : -1
        company.is_check = isCompanyCheck
      }

      product.promotions_product_applied = []
      category.promotions_category_applied = []
      company.promotions_applied = []

      if (company.has_promotion) {
        shopping_cart_ids.push(company.shopping_cart_id)
      }
      if (category.has_promotion) {
        cart_category_ids.push(category.cart_category_id)
      }
      if (isCheck && product.has_promotion) {
        shopping_cart_product_ids.push(product.shopping_cart_product_id)
      }
    })

    mutate(result, false)

    if (customer_id) {
      await applyPromotionsToCart({
        shopping_cart_ids,
        cart_category_ids,
        shopping_cart_product_ids,
        customer_id,
      })
    }
  }

  const toggleCheckAllProductsInCart = async () => {
    const data = getCartData()
    if (!data?.result?.length) return

    const { total_company_checked, paginate } = data
    const totalCheck = paginate.total === total_company_checked ? 0 : paginate.total
    const shopping_cart_ids: number[] = []
    const cart_category_ids: number[] = []
    const shopping_cart_product_ids: number[] = []

    mutate(
      produce(data, (draft) => {
        draft.total_company_checked = totalCheck
        const isCheck = !!totalCheck

        draft.result.forEach((company) => {
          let shopping_cart_id = 0

          company.is_check = isCheck
          company.total_product_checked = isCheck ? company.total_product : 0
          company.promotions_applied = []

          company.shopping_cart_category.forEach((category) => {
            category.promotions_category_applied = []
            let cart_category_id = 0

            category.shopping_cart_product.forEach((product) => {
              product.promotions_product_applied = []
              product.is_check = isCheck

              if (isCheck && product.product_id?.product_id) {
                if (product.has_promotion) {
                  shopping_cart_product_ids.push(product.shopping_cart_product_id)
                }
                if (category.has_promotion) {
                  cart_category_id = category.cart_category_id
                }
                if (company.has_promotion) {
                  shopping_cart_id = company.shopping_cart_id
                }
              }
            })

            if (cart_category_id) {
              cart_category_ids.push(cart_category_id)
            }
          })

          if (shopping_cart_id) {
            shopping_cart_ids.push(shopping_cart_id)
          }
        })
      }),
      false
    )

    if (customer_id) {
      await applyPromotionsToCart({
        cart_category_ids,
        shopping_cart_ids,
        shopping_cart_product_ids,
        customer_id,
      })
    }
  }

  const toggleCheckAllProductsInCompany = async (companyIndex: number) => {
    const data = getCartData()
    if (!data?.result?.length) return

    const shopping_cart_ids: number[] = []
    const cart_category_ids: number[] = []
    const shopping_cart_product_ids: number[] = []

    mutate(
      produce(data, (draft) => {
        const company = draft.result[companyIndex]
        if (!company?.company_id?.company_id) return

        const isCheck = !company.is_check

        if (company.has_promotion) {
          shopping_cart_ids.push(company.shopping_cart_id)
        }

        company.is_check = isCheck
        company.total_product_checked = isCheck ? company.total_product : 0
        company.promotions_applied = []

        company.shopping_cart_category.forEach((category) => {
          category.promotions_category_applied = []
          let cart_category_id = 0

          category.shopping_cart_product.forEach((product) => {
            product.is_check = isCheck
            product.promotions_product_applied = []

            if (product.has_promotion) {
              shopping_cart_product_ids.push(product.shopping_cart_product_id)
            }
            if (category.has_promotion) {
              cart_category_id = category.cart_category_id
            }
          })

          if (cart_category_id) {
            cart_category_ids.push(cart_category_id)
          }
        })
        draft.total_company_checked += isCheck ? 1 : -1
      }),
      false
    )

    if (customer_id) {
      await applyPromotionsToCart({
        shopping_cart_ids,
        cart_category_ids,
        shopping_cart_product_ids,
        customer_id,
      })
    }
  }

  return {
    data: data?.result || [],
    total: data?.paginate?.total || 0,
    isValidating,
    isLoadingMore,
    isCheckAll,
    mutate,
    refresh,
    getMoreCart,
    getMoreCategoryInCompany,
    deleteCartItem,
    getProductsChecked,
    deleteCheckedCartItems,
    getMoreCompany,
    updateProduct,
    toggleCheckProduct,
    toggleCheckAllProductsInCart,
    toggleCheckAllProductsInCompany,
  }
}
