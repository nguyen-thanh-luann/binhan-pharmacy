import { ZALO_OA_ID } from '@/constants'
import { AppConfig } from '@/utils'
import Document, { Head, Html, Main, NextScript } from 'next/document'

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this

  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head></Head>
        <body>
          <Main />

          <div
            className="zalo-chat-widget animate-fade !z-50"
            data-oaid={ZALO_OA_ID}
            data-welcome-message="Rất vui khi được hỗ trợ bạn!"
            data-autopopup="0"
            data-width=""
            data-height=""
          />

          <script src="https://sp.zalo.me/plugins/sdk.js"></script>

          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
