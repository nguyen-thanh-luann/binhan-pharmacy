import { AUTH_OPTION } from '@/types'
import { PayloadType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
interface AuthSlice {
 authOption: AUTH_OPTION
}

const initialState: AuthSlice = {
  authOption: undefined
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthOption: (state, { payload }: PayloadType<AUTH_OPTION>) => {      
      state.authOption = payload
    },
  },
})

export const selectAuthOption = (state: RootState): AUTH_OPTION => state.auth.authOption


export default authSlice.reducer
export const { setAuthOption } = authSlice.actions
