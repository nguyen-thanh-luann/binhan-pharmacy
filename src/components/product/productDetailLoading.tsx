import React from 'react'

export const ProductDetailLoading = () => {
  return (
    <div className="animate-pulse bg-white grid grid-cols-1 lg:grid-cols-3 p-20 gap-12 rounded-md">
      <div className="bg-gray-300 h-full min-h-[300px] rounded-md"></div>
      <div className="col-span-2 flex flex-col justify-between gap-12">
        <div className="bg-gray-300 h-[20px] w-[30%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[20%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[40%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[30%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[20%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[50%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[20%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[30%] rounded-md"></div>
        <div className="bg-gray-300 h-[20px] w-[40%] rounded-md"></div>
      </div>
    </div>
  )
}
