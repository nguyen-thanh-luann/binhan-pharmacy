import React from 'react'

export const PostAdminItemLoading = () => {
  return (
    <div className="animate-pulse rounded-md bg-white flex mb-[24px]">
      <div className="w-[100px] h-[100px] bg-gray-300 rounded-lg"></div>
      <div className="flex-1 ml-[12px]">
        <div className="rounded-[4px] h-[20px] mb-[8px] bg-gray-300 "></div>
        <div className="rounded-[4px] h-[25px] mb-[12px] bg-gray-300 "></div>
        <div className="max-w-[200px] w-full skeleton h-[15px] bg-gray-300 "></div>
      </div>
    </div>
  )
}
