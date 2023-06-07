import { PostCategory } from '@/types'
import classNames from 'classnames'

interface PostCategoryRoleTagProps {
  data: PostCategory
}

export const PostCategoryRoleTag = ({ data }: PostCategoryRoleTagProps) => {
  return (
    <div
      className={classNames(
        'border rounded-lg w-fit min-w-[100px] text-center mb-8',
        data?.role === 'npp'
          ? 'border-primary text-primary'
          : data?.role === 'th'
          ? 'border-green text-green'
          : 'border-blue text-blue'
      )}
    >
      {data?.role === 'npp' ? 'Riêng tư' : data?.role === 'th' ? 'Người dùng' : 'Công khai'}
    </div>
  )
}
