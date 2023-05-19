import React from 'react'
import { Image } from '../image'
import { TelePhoneIcon, downloadAppStore, downloadGooglePlay, logoSm } from '@/assets'
import Link from 'next/link'
import { AboutUsData, WebCategoryData } from '@/data'
import { CONTACT_PHONE_NUMBER } from '@/constants'

export const Footer = () => {
  return (
    <footer className="footer relative w-full py-80 px-24">
      <div className="container px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-80">
        <div className="col-span-1 z-10">
          <div className="mb-24">
            <Image src={logoSm} imageClassName="w-full max-w-[210px] object-cover" />
          </div>

          <p className="text-md text-text-color font-normal">
            Lorem ipsum dolor sit amet consectetur. Dolor habitasse vul putate quam nulla mauris.
            Turpis eget id vitae nisl a nec.
          </p>
        </div>

        <div className="col-span-1 z-10">
          <p className="text-primary font-bold text-md leading-10 mb-24">Danh mục Website</p>

          {WebCategoryData.map((item, index) => (
            <Link className="" key={index} href={item.path}>
              <p className="text-gray text-base font-normal leading-8 mb-16">{item.title}</p>
            </Link>
          ))}
        </div>

        <div className="col-span-1 z-10">
          <p className="text-primary font-bold text-md leading-10 mb-24">Về chúng tôi</p>
          {AboutUsData.map((item, index) => (
            <Link className="" key={index} href={item.path}>
              <p className="text-gray text-base font-normal leading-8 mb-16">{item.title}</p>
            </Link>
          ))}
        </div>

        <div className="col-span-1 z-10">
          <div className="mb-16 text-text-color font-bold text-base leading-10 uppercase text-center">
            <p className="">Tải ứng dụng</p>
            <p>
              binhan <span className="text-primary">Pharmacy</span>
            </p>
          </div>

          <div className="flex items-center gap-16">
            <Link href={'/'}>
              <Image src={downloadGooglePlay} imageClassName="w-[134px]" />
            </Link>

            <Link href={'/'}>
              <Image src={downloadAppStore} imageClassName="w-[134px]" />
            </Link>
          </div>
        </div>
      </div>

      {/*  */}
      <a
        href={`tel:${CONTACT_PHONE_NUMBER}`}
        className="absolute top-[-25px] z-10 right-[5%] py-8 px-16 rounded-full bg-primary text-white flex-center gap-12">
        <TelePhoneIcon className="w-16 h-16 text-white" />

        <p className="text-white text-base font-normal leading-10">{`+84 ${CONTACT_PHONE_NUMBER}`}</p>
      </a>

      {/* background linear */}
      <div className="absolute top-0 bottom-0 left-0 right-0 background z-0"></div>
    </footer>
  )
}
