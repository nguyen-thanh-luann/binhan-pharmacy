import React from 'react'

export const PostDetailLoading = () => {
  return (
    <div className="animate-pulse rounded-md bg-white p-12">
      <div className="mb-12 h-[20px] w-[50%] rounded-full bg-gray-300"></div>
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="w-full mb-12 h-[10px] rounded-full bg-gray-300"></div>
      ))}

      <br />

      <div className="mb-12 h-[20px] w-[50%] rounded-full bg-gray-300"></div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="w-full mb-12 h-[10px] rounded-full bg-gray-300"></div>
      ))}
      <br />
    </div>
  )
}
