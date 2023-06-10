import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { usePostCategory } from '@/hooks'
import { PostCategory } from '@/types'
import classNames from 'classnames'
import { useEffect } from 'react'
import { PostCategoryOption } from './postCategoryOption'
import { PostCategoryOptionLoading } from './postCategoryOptionLoading'

interface PostCategoryOptionGrandChild {
  data: PostCategory
  checkedPostCategory?: String[]
  onCheck?: (data: PostCategory) => void
  className?: string
}

export const PostCategoryOptionGrandChild = ({
  data,
  onCheck,
  className,
  checkedPostCategory,
}: PostCategoryOptionGrandChild) => {
  const {
    data: postCategoryList,
    isValidating,
    filter,
  } = usePostCategory({
    key: `${SWR_KEY.get_post_category_option}_${data?.id}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  useEffect(() => {
    if (!data) return

    filter({
      parent_id: data?.id,
    })
  }, [])

  return (
    <div>
      {isValidating ? (
        <PostCategoryOptionLoading />
      ) : (
        <div className={classNames('', className)}>
          {postCategoryList?.map((item) => (
            <div key={item?.id}>
              <PostCategoryOption
                data={item}
                isChecked={checkedPostCategory?.includes(item?.id) || false}
                onCheck={() => onCheck?.(item)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
