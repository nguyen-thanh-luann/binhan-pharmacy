import { Product } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

interface ProductSlice {
  product: Product | undefined
  searchProductHistory: []
  viewedProducts: Product[]
}

const initialState: ProductSlice = {
  searchProductHistory: [],
  product: undefined,
  viewedProducts: [],
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProduct: (state, { payload }: { payload: Product | undefined }) => {
      state.product = payload
    },

    addSearchProductHistory: (state: any, { payload }: { payload: Product }) => {
      const index = state.searchProductHistory?.findIndex(
        ({ product_id }: any) => product_id === payload?.product_id
      )

      if (index !== -1) {
        state.searchProductHistory = state.searchProductHistory.filter(
          (item: any) => item.product_id !== payload.product_id
        )
      }
      ;(state.searchProductHistory || []).unshift(payload)

      if (state?.searchProductHistory?.length > 8) {
        state.searchProductHistory = state.searchProductHistory.filter(
          (item: any) => item.product_id !== state?.searchProductHistory?.[8]?.product_id
        )
      }
    },

    deleteSearchProductHistory: (state: any, { payload }: { payload: number }) => {
      if (!state?.searchProductHistory?.length) return

      state.searchProductHistory = state.searchProductHistory.filter(
        (item: Product) => item.product_id !== payload
      )
    },

    addViewedProduct: (state, { payload }: { payload: Product }) => {
      const index = state?.viewedProducts?.findIndex(
        (item) => item?.product_id === payload?.product_id
      )
      if (index !== -1) {
        state.viewedProducts = state.viewedProducts.filter(
          (item) => item?.product_id !== payload?.product_id
        )
      }

      state?.viewedProducts?.unshift(payload)

      if (state.viewedProducts?.length > 12) {
        state.viewedProducts = state.viewedProducts.filter(
          (item) => item?.product_id !== state?.viewedProducts[12]?.product_id
        )
      }
    },
  },
})

export const selectSearchProductHistory = (state: RootState) => state.product.searchProductHistory
export const selectViewedProducts = (state: RootState) => state.product.viewedProducts

export default productSlice.reducer
export const { setProduct, addSearchProductHistory, deleteSearchProductHistory, addViewedProduct } =
  productSlice.actions
