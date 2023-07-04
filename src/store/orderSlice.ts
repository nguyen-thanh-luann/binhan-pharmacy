import { ShippingAddressV2 } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

interface OrderSlice {
  address: ShippingAddressV2 | undefined
}

const initialState: OrderSlice = {
  address: undefined,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderAddress: (state, { payload }: { payload: ShippingAddressV2 | undefined }) => {
      if (payload?.id) {
        state.address = payload
      } else {
        state.address = undefined
      }
    },

    resetOrderData: (state) => {
      state.address = undefined
    },
  },
})

export const selectOrderAddress = (state: RootState) => state.order.address

export default orderSlice.reducer
export const { setOrderAddress, resetOrderData } = orderSlice.actions
