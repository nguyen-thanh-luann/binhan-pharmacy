import { useGuest } from '@/hooks'
import '../styles/global.scss'

import { persistor, store } from '@/store'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SWRConfig } from 'swr'
import { useEffect } from 'react'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { openGraphData = [] } = pageProps as any
  const { loginGuest } = useGuest()

  // login guest account when user visit web
  useEffect(() => {
    loginGuest()
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
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
