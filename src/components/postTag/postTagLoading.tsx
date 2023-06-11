import { TagIcon } from '@/assets'

export const PostTagLoading = () => {
  return (
    <div className="animate-pulse rounded-md p-8 bg-white flex items-center gap-8">
      <TagIcon className="w-[20px] h-[20px] text-gray-300" />
      <div className="w-[150px] h-20 rounded-md bg-gray-300"></div>
    </div>
  )
}
