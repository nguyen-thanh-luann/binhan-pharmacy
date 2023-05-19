import type { AnyAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { ThunkDispatch } from 'redux-thunk'
import thunk from 'redux-thunk'
import commonSlice from './commonSlice'
import chatSlice from './chatSlice'
import authSlice from './authSlice'
import productSlice from './productSlice'
import orderSlice from './orderSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['common', 'chat', 'auth', 'product', 'order'],
}

const rootReducer = combineReducers({
  common: commonSlice,
  chat: chatSlice,
  auth: authSlice,
  product: productSlice,
  order: orderSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer) 

const store = configureStore({
  reducer: persistedReducer as any,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export {store}
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
