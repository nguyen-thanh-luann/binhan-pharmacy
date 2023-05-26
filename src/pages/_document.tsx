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
          <div
            className="zalo-chat-widget border-none outline-none"
            data-oaid={ZALO_OA_ID}
            data-welcome-message="Rất vui khi được hỗ trợ bạn!"
            data-autopopup="0"
            data-width=""
            data-height=""
          />
          <Main />
          <script src="https://sp.zalo.me/plugins/sdk.js"></script>

          {/* facebook messenger chat button */}

          <div id="fb-root"></div>

          <div id="fb-customer-chat" className="fb-customerchat"></div>

          <script>
            {` 
            var chatbox = document.getElementById('fb-customer-chat');
            chatbox.setAttribute("page_id", "108605108915912");
            chatbox.setAttribute("attribution", "biz_inbox");
            `}
          </script>

          <script>
            {`
               window.fbAsyncInit = function() {
                FB.init({
                  xfbml            : true,
                  version          : 'v17.0'
                });
              };

            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }
            (document, 'script', 'facebook-jssdk'));
            `}
          </script>
          
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
