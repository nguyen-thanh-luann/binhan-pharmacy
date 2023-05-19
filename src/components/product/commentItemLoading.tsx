export const CommentItemLoading = () => {
  return (
    <div className="animate-pulse flex gap-12 mb-12 last:mb-0">
      <div className="w-32 h-32 rounded-full bg-gray-300"></div>
      <div className="flex-1">
        <div className="w-[150px] mb-8 h-[8px] rounded-full bg-gray-300"></div>
        <div className="w-[150px] mb-8 h-[8px] rounded-full bg-gray-300"></div>
        <div className="w-[150px] mb-8 h-[8px] rounded-full bg-gray-300"></div>
      </div>
    </div>
  )
}
