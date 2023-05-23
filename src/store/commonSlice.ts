import { PayloadType, Post, PostCategory, ShippingAddressV2 } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

interface CommonSlice {
  backdropVisible: boolean
  previewImageUrl: string | undefined
  addressForm: ShippingAddressV2 | undefined
  previousRoute: string | undefined | null
  postCategoryForm: PostCategory | undefined
  postForm: Post | undefined
}

const initialState: CommonSlice = {
  backdropVisible: false,
  previewImageUrl: undefined,
  addressForm: undefined,
  previousRoute: undefined,
  postCategoryForm: undefined,
  postForm: undefined
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

    setAddressForm: (state, { payload }: { payload: ShippingAddressV2 | undefined }) => {
      state.addressForm = payload
    },

    setPreviousRoute: (state, { payload }: { payload: string | undefined | null }) => {
      state.previousRoute = payload
    },

    setPostCategoryForm: (state, { payload }: { payload: PostCategory | undefined }) => {
      state.postCategoryForm = payload
    },

    setPostForm: (state, { payload }: { payload: Post | undefined}) => {
      state.postForm = payload
    }
  },
})

export const selectPreviewImageUrl = (state: RootState) => state.common.previewImageUrl
export const selectAddressForm = (state: RootState) => state.common.addressForm
export const selectPostCategoryForm = (state: RootState) => state.common.postCategoryForm
export const selectPostForm = (state: RootState) => state.common.postForm

export default commonSlice.reducer
export const {
  setBackdropVisible,
  setAddressForm,
  setPreviewImageUrl,
  setPreviousRoute,
  setPostCategoryForm,
  setPostForm
} = commonSlice.actions
