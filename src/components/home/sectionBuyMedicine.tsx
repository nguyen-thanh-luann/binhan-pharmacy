import { enterInfo, getAdvise, takePhoto } from '@/assets'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { Image } from '../image'
import { useRouter } from 'next/router'

interface SectionBuyMedicineProps {
  className?: string
}

export const SectionBuyMedicine = ({ className }: SectionBuyMedicineProps) => {
  const router = useRouter()
  return (
    <div
      className={twMerge(classNames('bg-white shadow-shadow-3 rounded-[10px] py-24', className))}
    >
      <div className="w-[90%] mx-auto">
        <p className="text-primary font-bold uppercase text-lg md:text-2xl mb-12 text-center">
          {`HỖ TRỢ ĐẶT MUA NHANH HƠN CÙNG BINHAN`}
        </p>

        <div className="flex-between mb-24">
          <div className="w-[280px] flex flex-center flex-col flex-wrap">
            <Image
              src={takePhoto}
              className="mb-12"
              imageClassName="w-[100px] md:w-[150px] lg:w-[195px] h-[90px] md:h-[110px] lg:h-[157px]"
            />

            <p className="uppercase text-sm md:text-md text-text-color font-bold text-center w-[70%]">
              {`CHỤP ẢNH SẢN PHẨM, ĐƠN HÀNG`}
            </p>
          </div>

          <div className="w-[280px] flex flex-center flex-col flex-wrap">
            <Image
              src={enterInfo}
              className="mb-12"
              imageClassName="w-[100px] md:w-[150px] lg:w-[195px] h-[90px] md:h-[110px] lg:h-[157px]"
            />

            <p className="uppercase text-sm md:text-md text-text-color font-bold text-center w-[70%]">
              {`NHẬP THÔNG TIN LIÊN LẠC`}
            </p>
          </div>

          <div className="w-[280px] flex flex-center flex-col flex-wrap">
            <Image
              src={getAdvise}
              className="mb-12"
              imageClassName="w-[100px] md:w-[150px] lg:w-[195px] h-[90px] md:h-[110px] lg:h-[157px]"
            />

            <p className="uppercase text-sm md:text-md text-text-color font-bold text-center w-[70%]">
              {`NHẬN TƯ VẤN BÁO GIÁ, ĐẶT HÀNG`}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex-1 h-1 rounded-full border border-primary"></div>
          <div className="">
            <Button
              title="Đặt hàng hộ"
              className="p-12 bg-primary rounded-[20px] w-fit"
              textClassName="uppercase text-white font-bold text-sm md:text-md"
              onClick={() => {
               router.push('/quick_order')
              }}
            />
          </div>
          <div className="flex-1 h-1 rounded-full border border-primary"></div>
        </div>
      </div>
    </div>
  )
}
