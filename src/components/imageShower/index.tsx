/* eslint-disable @next/next/no-img-element */
import { TimesIcon } from '@/assets'
import { API_URL } from '@/constants'
import { isRemoteImageUrl } from '@/helper'
import { setPreviewImageUrl } from '@/store'
import { useDispatch } from 'react-redux'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Image } from '../image'

interface ImageShowerProps {
  url: string
}

export const ImageShower = ({ url }: ImageShowerProps) => {
  const dispatch = useDispatch()
  return (
    <div className="fixed z-100 flex justify-center items-center bg-black-700 inset-0">
      <div className="relative">
        <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={50}>
          {() => (
            <>
              <div
                onClick={() => dispatch(setPreviewImageUrl(undefined))}
                className="absolute top-8 right-8 z-100 lg:top-32 lg:right-32 cursor-pointer bg-white shadow-lg p-8 rounded-full"
              >
                <TimesIcon className="text-md text-dark font-700" />
              </div>

              <TransformComponent>
                <Image
                  src={isRemoteImageUrl(url) ? url : `${API_URL}${url}`}
                  className="w-[90vw] h-[90vh] lg:w-[50vw]"
                  imageClassName='object-contain w-full h-full'
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  )
}
