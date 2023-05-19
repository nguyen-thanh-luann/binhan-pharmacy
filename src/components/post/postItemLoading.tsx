import React from 'react'

export const PostItemLoading = () => {
  return (
    <div className="animate-pulse rounded-md bg-white">
      <div className="rounded-tl-md rounded-tr-md mb-12 h-[210px] w-full bg-gray-300"></div>
      <div className="p-8">
        <div className="w-full mb-12 h-[10px] rounded-md bg-gray-300"></div>
        <div className="w-[30%] mb-12 h-[20px] rounded-md bg-gray-300"></div>
      </div>
    </div>
  )
}
