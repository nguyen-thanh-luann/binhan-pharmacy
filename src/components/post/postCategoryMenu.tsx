import { MenuIcon, RightIcon, TrashIconOutline } from '@/assets'
import { SWR_KEY } from '@/constants'
import {
  fromProductSlugToProductId,
  generateProductSlug,
  isArrayHasValue,
  isObjectHasValue,
} from '@/helper'
import { usePostCategory } from '@/hooks'
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
  const [expandCategory, setExpandCategory] = useState<string>()
  const router = useRouter()
  const { parent_id, category_id } = router.query
  const parent_id_req = fromProductSlugToProductId(parent_id as string)
  const showResetFilterBtn = isObjectHasValue(router?.query) && category_id

  console.log({ parent_id_req })

  const {
    data: postCategoryList,
    isValidating,
    filter,
  } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}_${parent_id_req}`,
    params: {
      parent_id: parent_id_req,
    },
  })

  useEffect(() => {
    filter({
      parent_id: parent_id_req,
    })
  }, [parent_id_req])

  const hanldeCategoryClick = (cate: PostCategory) => {
    if (!cate) return

    if (cate?.children_count > 0) {
      if (expandCategory === cate.id) {
        setExpandCategory(undefined)
      } else {
        setExpandCategory(cate.id)
      }
    }

    router.push({
      pathname: '/post-list',
      query: {
        ...router.query,
        category_id: generateProductSlug(cate.name, cate.id),
      },
    })
  }

  return (
    <div className={classNames('bg-white', className)}>
      <div
        onClick={() => {
          router.push('/post-list')
        }}
        className="p-10 flex items-center gap-12 border-b border-gray-200 cursor-pointer"
      >
        <MenuIcon className="text-text-color w-32 h-32" />

        <p className="title_lg">{`Danh mục tin tức`}</p>
      </div>

      {isValidating ? (
        <div className="my-12 flex-center">
          <Spinner />
        </div>
      ) : (
        <div>
          {postCategoryList?.map((cate) => {
            const isExpand = cate?.id === expandCategory

            return (
              <div key={cate?.id}>
                <div
                  onClick={() => hanldeCategoryClick(cate)}
                  className="flex-between p-12 border-b last:mb-0 border-gray-100 cursor-pointer"
                >
                  <p className="text-md">{cate.name}</p>

                  <div className={classNames('flex-center duration-200 ease-in-out')}>
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
                      {cate?.children?.map((child) => (
                        <div
                          onClick={() => hanldeCategoryClick(child)}
                          className="pl-12 py-8 w-full cursor-pointer"
                          key={child?.id}
                        >
                          <p className="text-md">{child?.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div>
        {showResetFilterBtn ? (
          <Button
            title="Xóa bộ lọc"
            icon={<TrashIconOutline className="text-red text-base" />}
            className="bg-white p-8 rounded-lg w-full"
            textClassName="text-red text-base"
            onClick={() => {
              router.push({
                pathname: '/post-list',
                query: {
                  parent_id: parent_id || undefined,
                },
              })
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
