import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { usePostCategory } from '@/hooks'
import { PostCategory } from '@/types'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { PostCategoryOption } from './postCategoryOption'
import { PostCategoryOptionGrandChild } from './postCategoryOptionGrandChild'
import { PostCategoryOptionLoading } from './postCategoryOptionLoading'

interface PostCategoryOptionChild {
  data: PostCategory
  onCheck?: (data: PostCategory) => void
  checkedPostCategory?: String[]
  className?: string
}

export const PostCategoryOptionChild = ({
  data,
  onCheck,
  className,
  checkedPostCategory,
}: PostCategoryOptionChild) => {
  const [expandCategories, setExpandCategories] = useState<PostCategory[]>([])

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

  const handleExpandCategory = (data: PostCategory) => {
    const index = expandCategories?.findIndex((c) => c?.id === data?.id)

    if (index !== -1) {
      setExpandCategories([...(expandCategories?.filter((c) => c?.id !== data?.id) || [])])
      return
    }

    setExpandCategories([...(expandCategories || []), data])
  }

  return (
    <div className={classNames('', className)}>
      {isValidating ? (
        <PostCategoryOptionLoading />
      ) : (
        <div>
          {postCategoryList?.map((item: PostCategory) => {
            const isExpand = expandCategories?.includes(item)

            return (
              <div key={item?.id}>
                <PostCategoryOption
                  data={item}
                  isChecked={checkedPostCategory?.includes(item?.id) || false}
                  onCheck={() => onCheck?.(item)}
                  onExpand={handleExpandCategory}
                  isExpand={isExpand}
                />

                <div>
                  {isExpand ? (
                    <PostCategoryOptionGrandChild
                      className="pl-24 animate-fade"
                      data={item}
                      checkedPostCategory={checkedPostCategory}
                      onCheck={onCheck}
                    />
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
