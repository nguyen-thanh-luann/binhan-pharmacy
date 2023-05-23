import React from 'react'

export const PostCategoryItemLoading = () => {
  return (
    <div className="animate-pulse bg-white border p-12 border-gray-300 rounded-lg">
      <div className="rounded-full mb-12 h-[10px] w-[90px] bg-gray-300"></div>
      <div className="rounded-full mb-12 h-[10px] w-[150px] bg-gray-300"></div>
      <div className="rounded-full h-[10px] w-[200px] bg-gray-300"></div>
    </div>
  )
}
