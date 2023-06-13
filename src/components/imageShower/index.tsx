/* eslint-disable @next/next/no-img-element */
import { setPreviewImageUrl } from '@/store'
import React from 'react'
import { useDispatch } from 'react-redux'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { Image } from '../image'
import { MinusIcon, PlusIcon, TimesIcon } from '@/assets'
import { isRemoteImageUrl } from '@/helper'
import { API_URL } from '@/constants'

interface ImageShowerProps {
  url: string
}

export const ImageShower = ({ url }: ImageShowerProps) => {
  const dispatch = useDispatch()
  return (
    <div className="fixed z-100 bg-black-700 inset-0">
      <div className="absolute top-[50%] left-[50%]" style={{ transform: 'translate(-50%, -50%)' }}>
        <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="fixed top-[8px] right-[8px] flex justify-end z-100 bg-black-400 p-4 rounded-full">
                <button
                  className="w-[30px] h-[30px] bg-dark-opacity-400 flex items-center justify-center text-white cursor-pointer"
                  onClick={() => zoomIn()}
                >
                  <PlusIcon />
                </button>
                <button
                  className="w-[30px] h-[30px] bg-dark-opacity-400 flex items-center justify-center text-white cursor-pointer"
                  onClick={() => zoomOut()}
                >
                  <MinusIcon />
                </button>
                <button
                  className="w-[30px] h-[30px] bg-dark-opacity-400 flex items-center justify-center text-white cursor-pointer"
                  onClick={() => resetTransform()}
                >
                  <TimesIcon />
                </button>
              </div>
              <TransformComponent>
                <Image
                  src={isRemoteImageUrl(url) ? url : `${API_URL}${url}`}
                  className="object-cover w-[90vw] h-[90vh] lg:w-[50vw]"
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
      <div
        onClick={() => dispatch(setPreviewImageUrl(undefined))}
        className="absolute top-8 right-8 lg:top-32 lg:right-32 cursor-pointer bg-white p-8 rounded-full"
      >
        <TimesIcon className="text-md text-dark font-700" />
      </div>
    </div>
  )
}
