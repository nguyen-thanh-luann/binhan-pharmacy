import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { usePostCategory } from '@/hooks'
import { PostCategory } from '@/types'
import { useState } from 'react'
import { PostCategoryOption, PostCategoryOptionChild } from '../post'

export const PostCategoryOptionForm = () => {
  const { data: postCategoryList } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const [expandCategories, setExpandCategories] = useState<PostCategory[]>()

  const handleExpandCategory = (data: PostCategory) => {
    const index = expandCategories?.findIndex((c) => c?.id === data?.id)

    if (index !== -1) {
      setExpandCategories([...(expandCategories?.filter((c) => c?.id !== data?.id) || [])])
      return
    }

    setExpandCategories([...(expandCategories || []), data])
  }

  return (
    <div>
      <p className="mb-8">Danh mục cha</p>

      <div className="border p-12 rounded-md border-gray-200 max-h-[500px] overflow-scroll scrollbar-hide">
        {postCategoryList?.map((postCategoryParent) => {
          const isExpand = expandCategories?.includes(postCategoryParent)

          return (
            <div key={postCategoryParent?.id}>
              <PostCategoryOption
                data={postCategoryParent}
                isActive={false}
                onCheck={() => {}}
                onExpand={handleExpandCategory}
                isExpand={isExpand}
              />

              <div>
                {isExpand ? (
                  <div className="pl-12">
                    <PostCategoryOptionChild
                      data={postCategoryParent}
                      isChecked={false}
                      onCheck={() => {}}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
