import { PayloadType, ShippingAddress } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

interface CommonSlice {
  backdropVisible: boolean
  previewImageUrl: string | undefined
  addressForm: ShippingAddress | undefined
}

const initialState: CommonSlice = {
  backdropVisible: false,
  previewImageUrl: undefined,
  addressForm: undefined,
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setBackdropVisible: (state, { payload }: PayloadType<boolean>) => {
      state.backdropVisible = payload
    },

    setPreviewImageUrl: (state, { payload }: { payload: string | undefined }) => {
      state.previewImageUrl = payload
    },

    setAddressForm: (state, { payload }: { payload: ShippingAddress | undefined }) => {
      state.addressForm = payload
    },
  },
})


export const selectPreviewImageUrl = (state: RootState) => state.common.previewImageUrl
export const selectAddressForm = (state: RootState) => state.common.addressForm

export default commonSlice.reducer
export const { setBackdropVisible, setAddressForm, setPreviewImageUrl } =
  commonSlice.actions
