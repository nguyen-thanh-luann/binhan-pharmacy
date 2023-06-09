import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { useModal, usePostCategory } from '@/hooks'
import { PostCategory } from '@/types'
import { useEffect } from 'react'
import { Spinner } from '../spinner'
import { PostCategoryOption } from './postCategoryOption'

interface PostCategoryOptionChild {
  data: PostCategory
  onCheck?: (data: PostCategory) => void
  isChecked: boolean
}

export const PostCategoryOptionChild = ({
  data,
  onCheck,
  isChecked = false,
}: PostCategoryOptionChild) => {
  const { visible, toggle } = useModal()

  console.log({ data })

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
  }, [postCategoryList])

  console.log({ postCategoryList })

  return (
    <div>
      {isValidating ? (
        <Spinner />
      ) : (
        <div>
          {postCategoryList?.map((postCategoryParent: PostCategory) => (
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
