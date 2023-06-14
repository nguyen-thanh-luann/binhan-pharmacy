import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { ValidAccountRoleToUsePostService } from '@/helper'
import { usePostCategory, useUser } from '@/hooks'
import { AccountType, PostCategory } from '@/types'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { PostCategoryOption, PostCategoryOptionChild, PostCategoryOptionLoading } from '../post'

interface PostCategoryOptionFormProps {
  type: 'single' | 'multiple'
  isReturnParent?: boolean
  onChecked: (data: string[]) => void
  defaultCheckedOption?: string[]
  label?: string
  labelClassName?: string
}

export const PostCategoryOptionForm = ({
  type = 'single',
  isReturnParent = false,
  onChecked,
  defaultCheckedOption = [],
  label,
  labelClassName,
}: PostCategoryOptionFormProps) => {
  const { userInfo } = useUser({ shouldFetch: false })
  const userRole: AccountType = ValidAccountRoleToUsePostService(userInfo)
  const getPostCategoryParams =
    userInfo?.account?.account_type === 'npp'
      ? {
          limit: DEFAULT_LIMIT,
        }
      : {
          limit: DEFAULT_LIMIT,
          role: userRole,
        }

  const { data: postCategoryList, isValidating } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: getPostCategoryParams,
  })

  const [expandCategories, setExpandCategories] = useState<PostCategory[]>([])
  const [checkPostCategories, setCheckPostCategory] = useState<string[]>(defaultCheckedOption)

  useEffect(() => {
    onChecked?.(checkPostCategories)
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
    const index = checkPostCategories?.findIndex((c) => c === data?.id) // kiểm tra xem postCategory được check hay chưa

    //check xem người dùng có muốn return cấp parent hay không
    if (isReturnParent) {
      if (index !== -1) {
        setCheckPostCategory([...(checkPostCategories?.filter((c) => c !== data?.id) || [])])
      } else {
        const parentIndex = checkPostCategories?.findIndex((c) => c === data?.parent_id)
        if (parentIndex !== -1) {
          setCheckPostCategory([...(checkPostCategories || []), data?.id])
        } else {
          if (data?.parent_id) {
            setCheckPostCategory([...(checkPostCategories || []), data?.parent_id, data?.id])
          } else {
            setCheckPostCategory([...(checkPostCategories || []), data?.id])
          }
        }
      }
    } else {
      if (type === 'multiple') {
        if (index !== -1) {
          setCheckPostCategory([...(checkPostCategories?.filter((c) => c !== data?.id) || [])])
          return
        }

        setCheckPostCategory([...(checkPostCategories || []), data?.id])
      } else {
        if (index !== -1) {
          setCheckPostCategory([...(checkPostCategories?.filter((c) => c !== data?.id) || [])])
        } else {
          setCheckPostCategory([data?.id])
        }
      }
    }
  }

  return (
    <div>
      <p className={classNames('mb-8 text-md', labelClassName)}>{label || 'Chọn danh mục'}</p>

      <div className="border rounded-md border-gray-200 max-h-[300px] md:max-h-[400px] overflow-scroll scrollbar-hide">
        {isValidating ? (
          <PostCategoryOptionLoading />
        ) : (
          postCategoryList?.map((item) => {
            const isExpand = expandCategories?.includes(item)

            return (
              <div key={item?.id} className="animate-fade">
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
                      className="pl-24 animate-fade"
                      data={item}
                      checkedPostCategory={checkPostCategories}
                      onCheck={handleTogglePostCategory}
                    />
                  ) : null}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
