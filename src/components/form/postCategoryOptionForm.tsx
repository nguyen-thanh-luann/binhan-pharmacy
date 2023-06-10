import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { usePostCategory } from '@/hooks'
import { PostCategory } from '@/types'
import { useEffect, useState } from 'react'
import { PostCategoryOption, PostCategoryOptionChild } from '../post'

interface PostCategoryOptionFormProps {
  type: 'single' | 'multiple'
  onChecked: (data: string[]) => void
  defaultCheckedOption?: string[]
}

export const PostCategoryOptionForm = ({
  type = 'single',
  onChecked,
  defaultCheckedOption = [],
}: PostCategoryOptionFormProps) => {
  const { data: postCategoryList } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const [expandCategories, setExpandCategories] = useState<PostCategory[]>()
  const [checkPostCategories, setCheckPostCategory] = useState<string[]>(defaultCheckedOption)

  useEffect(() => {
    onChecked(checkPostCategories)
  }, [checkPostCategories])

  const handleExpandCategory = (data: PostCategory) => {
    const index = expandCategories?.findIndex((c) => c?.id === data?.id)

    if (index !== -1) {
      setExpandCategories([...(expandCategories?.filter((c) => c?.id !== data?.id) || [])])
      return
    }

    setExpandCategories([...(expandCategories || []), data])
  }

  const handleTogglePostCategory = (data: PostCategory) => {
    const index = checkPostCategories?.findIndex((c) => c === data?.id)

    if (type === 'multiple') {
      if (index !== -1) {
        setCheckPostCategory([...(checkPostCategories?.filter((c) => c !== data?.id) || [])])
        return
      }

      setCheckPostCategory([...(checkPostCategories || []), data?.id])
    } else {
      setCheckPostCategory([data?.id])
    }
  }

  return (
    <div>
      <p className="mb-8 text-md">Chọn danh mục cha</p>

      <div className="border p-12 rounded-md border-gray-200 max-h-[500px] overflow-scroll scrollbar-hide">
        {postCategoryList?.map((item) => {
          const isExpand = expandCategories?.includes(item)

          return (
            <div key={item?.id}>
              <PostCategoryOption
                data={item}
                isChecked={checkPostCategories?.includes(item?.id) || false}
                onCheck={handleTogglePostCategory}
                onExpand={handleExpandCategory}
                isExpand={isExpand}
              />

              <div>
                {isExpand ? (
                  <PostCategoryOptionChild
                    className="pl-12"
                    data={item}
                    checkedPostCategory={checkPostCategories}
                    onCheck={handleTogglePostCategory}
                  />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
