import { OrderLineDelivery, Payment, ShippingAddress } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

interface OrderSlice {
  address: ShippingAddress | undefined
  payment: Payment | undefined
  orderLineDelivery: OrderLineDelivery | undefined
}

const initialState: OrderSlice = {
  address: undefined,
  payment: undefined,
  orderLineDelivery: undefined,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {

    setOrderAddress: (state, { payload }: { payload: ShippingAddress | undefined }) => {      
      if (payload?.id) {
        state.address = payload
      } else {
        state.address = undefined
      }
    },

    setOrderPayment: (state, { payload }: { payload: Payment | undefined }) => {
      if (payload?.acquirer_id === state?.payment?.acquirer_id) return
      state.payment = payload
    },

    setOrderLineDelivery: (state, { payload }: { payload: OrderLineDelivery | undefined }) => {
      state.orderLineDelivery = payload
    },

    resetOrderData: (state) => {      
      state.address = undefined
      state.payment = undefined
      state.orderLineDelivery = undefined
    },
  },
})

export const selectOrderAddress = (state: RootState) => state.order.address
export const selectOrderPayment = (state: RootState) => state.order.payment
export const selectOrderLineDelivery = (state: RootState) => state.order.orderLineDelivery

export default orderSlice.reducer
export const { setOrderAddress, setOrderPayment, setOrderLineDelivery, resetOrderData } =
  orderSlice.actions
