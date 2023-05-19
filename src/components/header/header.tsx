import { logoLg } from '@/assets'
import classNames from 'classnames'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { AccountDrawer } from '../account'
import { CartDrawer } from '../cart'
import { HeaderSearchProduct } from '../headerSearchProduct'
import { Image } from '../image'
import { SalePoint } from '../salePoint'

interface HeaderProps {
  className?: string
}

export const Header = ({className}: HeaderProps) => {
  return (
    <div className={twMerge(classNames(`bg-background h-header_height`, className))}>
      <div className="container flex items-center py-24 px-12 gap-40">
        <div className="">
          <Link href="/">
            <Image src={logoLg} className="w-[130px] h-[40px]" />
          </Link>
        </div>

        <div className="flex-1">
          <HeaderSearchProduct />
        </div>

        <div className="flex items-center justify-between gap-12">
          <SalePoint />

          <AccountDrawer />

          <div className={`border-l border-gray-300 h-[24px]`}></div>

          <CartDrawer />
        </div>
      </div>
    </div>
  )
}
