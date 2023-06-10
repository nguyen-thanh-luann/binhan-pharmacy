import { MenuIcon, RightIcon, TrashIconOutline } from '@/assets'
import { SWR_KEY } from '@/constants'
import {
  fromProductSlugToProductId,
  generateProductSlug,
  isArrayHasValue,
  isDrugStore,
} from '@/helper'
import { usePostCategory, useUser } from '@/hooks'
import { PostCategory } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '../button'
import { Spinner } from '../spinner'

interface PostCategoryMenuProps {
  className?: string
}

export const PostCategoryMenu = ({ className }: PostCategoryMenuProps) => {
  const [expandCategories, setExpandCategories] = useState<string[]>([])
  const router = useRouter()
  const { userInfo } = useUser({})

  const { parent_category, category_id } = router.query
  const currentPostCategoryId = fromProductSlugToProductId(category_id as string)

  const {
    data: postCategoryList,
    isValidating,
    filter,
  } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}_${parent_category}`,
    params: {
      parent_id: parent_category as string,
    },
  })

  useEffect(() => {
    filter({
      parent_id: parent_category as string,
    })
  }, [parent_category])

  const hanldeCategoryClick = (cate: PostCategory) => {
    if (!cate) return

    if (currentPostCategoryId === cate?.id) {
      router.push({
        query: {},
      })
      return
    }

    router.push({
      pathname: '/post-list',
      query: {
        ...router.query,
        category_id: generateProductSlug(cate.name, cate.id),
      },
    })
  }

  const handleExpandCategory = (data: PostCategory) => {
    const index = expandCategories?.findIndex((c) => c === data?.id)

    if (index !== -1) {
      setExpandCategories([...(expandCategories?.filter((c) => c !== data?.id) || [])])
      return
    }

    setExpandCategories([...(expandCategories || []), data?.id])
  }

  if (!parent_category) return <div></div>

  return (
    <div className={classNames('bg-white', className)}>
      <div className="p-10 flex items-center gap-12 border-b border-gray-200">
        <MenuIcon className="text-text-color w-32 h-32" />

        <p className="title_lg">{`Danh mục tin tức`}</p>
      </div>

      {isValidating ? (
        <div className="my-12 flex-center">
          <Spinner />
        </div>
      ) : (
        <div>
          {postCategoryList &&
            (isDrugStore(userInfo?.account)
              ? postCategoryList
              : postCategoryList.filter((postCategory) => postCategory.role !== 'npp')
            )?.map((cate) => {
              const isExpand = expandCategories?.includes(cate?.id)

              return (
                <div key={cate?.id}>
                  <div className="flex-between p-12 border-b last:mb-0 border-gray-100">
                    <p
                      onClick={() => hanldeCategoryClick(cate)}
                      className={classNames(
                        'text-md hover:text-primary cursor-pointer',
                        cate?.id === currentPostCategoryId ? 'text-primary' : ''
                      )}
                    >
                      {cate.name}
                    </p>

                    <div
                      onClick={() => handleExpandCategory(cate)}
                      className={classNames(
                        'flex flex-1 justify-end duration-200 ease-in-out cursor-pointer'
                      )}
                    >
                      <RightIcon
                        className={classNames(
                          'text-sm text-text-color duration-200 ease-in-out',
                          isExpand ? 'rotate-90' : '',
                          cate.children_count > 0 ? 'block' : 'hidden'
                        )}
                      />
                    </div>
                  </div>

                  <div className={classNames(isExpand ? 'block' : 'hidden')}>
                    {isArrayHasValue(cate?.children) ? (
                      <div className="px-12">
                        {cate?.children?.map((child) => {
                          const isActive = child?.id === currentPostCategoryId

                          return (
                            <div
                              onClick={() => hanldeCategoryClick(child)}
                              className="pl-12 py-8 w-full cursor-pointer"
                              key={child?.id}
                            >
                              <p
                                className={classNames(
                                  'text-md border-b w-fit hover:text-primary',
                                  isActive ? 'text-primary border-primary' : 'border-white'
                                )}
                              >
                                {child?.name}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
        </div>
      )}

      <div>
        {currentPostCategoryId ? (
          <Button
            title="Xóa bộ lọc"
            icon={<TrashIconOutline className="text-red text-base" />}
            className="bg-white p-8 rounded-lg w-full"
            textClassName="text-red text-base"
            onClick={() => {
              const { parent_category } = router.query

              router.push({
                pathname: '/post-list',
                query: {
                  parent_category,
                },
              })
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
