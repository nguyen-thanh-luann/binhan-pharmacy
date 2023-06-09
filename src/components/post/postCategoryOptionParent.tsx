import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { useModal, usePostCategory } from '@/hooks'
import { PostCategory } from '@/types'
import React from 'react'
import { Spinner } from '../spinner'
import { isArrayHasValue } from '@/helper'
import { PostCategoryOption } from './postCategoryOption'

interface PostCategoryParentProps {
  data: PostCategory
  onCheck?: (data: PostCategory) => void
  isChecked: boolean
}

export const PostCategoryOptionParent = ({ data, onCheck, isChecked }: PostCategoryParentProps) => {
  const { data: postCategoryList, isValidating } = usePostCategory({
    key: `${SWR_KEY.get_post_category_option}_${data?.id}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const {} = useModal()

  return (
    <div>
      {isValidating ? (
        <Spinner />
      ) : (
        <div>
          {isArrayHasValue(postCategoryList) ? (
            <div>
              {postCategoryList?.map((postCategory) => (
                <PostCategoryOption data={postCategory} isActive={false} onCheck={() => {}} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
