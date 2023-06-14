import { useGuest, usePreviousRoute } from '@/hooks'
import '../styles/global.scss' // any scss custom styles
import 'react-indiana-drag-scroll/dist/style.css' //style of ScrollContainer library (react-indiana-drag-scroll) use to scroll div with mouse
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { persistor, setPreviousRoute, store } from '@/store'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SWRConfig } from 'swr'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { openGraphData = [] } = pageProps as any
  const { loginGuest } = useGuest()
  const previousRoute = usePreviousRoute()
  // login guest account when user visit web
  useEffect(() => {
    loginGuest()
  }, [])

  useEffect(() => {
    store.dispatch(setPreviousRoute(previousRoute))
  }, [previousRoute])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" sizes="32x32" href="/favicon.ico" />

        {openGraphData.map((og: any, index: number) => (
          <meta key={index} {...og} />
        ))}
      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
            <Component {...pageProps} />
          </SWRConfig>
        </PersistGate>
      </Provider>
    </>
  )
}

export default MyApp
