import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { useModal, usePostCategory } from '@/hooks'
import { PostCategory } from '@/types'
import React from 'react'
import { Spinner } from '../spinner'
import { PostCategoryOption } from './postCategoryOption'

interface PostCategoryOptionGrandChild {
  data: PostCategory
  onCheck?: (data: PostCategory) => void
  isChecked: boolean
}

export const PostCategoryOptionGrandChild = ({
  data,
  onCheck,
  isChecked,
}: PostCategoryOptionGrandChild) => {
  const { visible, toggle } = useModal()

  const { data: postCategoryList, isValidating } = usePostCategory({
    key: `${SWR_KEY.get_post_category_option}_${data?.id}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  return (
    <div>
      {isValidating ? (
        <Spinner />
      ) : (
        <div>
          {postCategoryList?.map((postCategoryParent) => (
            <div key={postCategoryParent?.id}>
              <PostCategoryOption
                data={postCategoryParent}
                isActive={isChecked}
                onCheck={() => onCheck?.(postCategoryParent)}
                onExpand={toggle}
                isExpand={visible}
              />

              <div>
                {/* {visible ? (
                  <PostCategoryOptionChild data={postCategoryParent} isChecked onCheck={() => {}} />
                ) : null} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
