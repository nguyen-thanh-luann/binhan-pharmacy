import { ReactNode } from 'react'

import { Backdrop, BottomNavigation, Footer, HeaderGroup, HeaderMobile } from '@/components'
import type { MetaProps } from '@/layouts'
import { Meta } from '@/layouts'
import { Toaster } from 'react-hot-toast'

type IMainProps = MetaProps & {
  children: ReactNode
}

export const Main = ({ children, ...attributes }: IMainProps) => {
  return (
    <div className="w-full px-1 text-gray-700 antialiased bg-background">
      <Meta {...attributes} />

      <HeaderGroup className="hidden md:flex" />

      <HeaderMobile className="h-header_mobile_height md:h-0" />

      <Backdrop />

      <Toaster
        position="top-center"
        reverseOrder={true}
        toastOptions={{
          duration: 2000,
          style: {
            fontSize: '1.4rem',
          },
        }}
      />

      <div className="mb-bottom_nav_height md:mb-0">
        {children}

        <Footer />

        {/* <div
          className="zalo-chat-widget"
          data-oaid={ZALO_OA_ID}
          data-welcome-message="Rất vui khi được hỗ trợ bạn!"
          data-autopopup="0"
          data-width=""
          data-height=""
        /> */}
      </div>

      <BottomNavigation />
    </div>
  )
}
