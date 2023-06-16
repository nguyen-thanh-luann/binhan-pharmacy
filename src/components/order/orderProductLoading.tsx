import React from 'react'

export const OrderProductLoading = () => {
  return (
    <div className="animate-pulse rounded-md bg-white flex items-start gap-12 mb-12 last:mb-0">
      <div className="rounded-md h-[60px] w-[60px] min-w-[60px] bg-gray-300"></div>
      <div>
        <div className="w-[200px] mb-12 h-[10px] rounded-full bg-gray-300"></div>
        <div className="w-[100px] h-[10px] rounded-full bg-gray-300"></div>
      </div>
    </div>
  )
}
