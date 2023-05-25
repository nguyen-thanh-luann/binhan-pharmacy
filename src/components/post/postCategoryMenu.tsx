import { MenuIcon, RightIcon, TrashIconOutline } from '@/assets'
import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { generateProductSlug, isArrayHasValue, isObjectHasValue } from '@/helper'
import { usePostCategory } from '@/hooks'
import classNames from 'classnames'
import { useState } from 'react'
import { Spinner } from '../spinner'
import { PostCategory } from '@/types'
import { useRouter } from 'next/router'
import { Button } from '../button'

interface PostCategoryMenuProps {
  className?: string
}

export const PostCategoryMenu = ({ className }: PostCategoryMenuProps) => {
  const [expandCategory, setExpandCategory] = useState<string>()
  const router = useRouter()
  const showResetFilterBtn = isObjectHasValue(router?.query)

  const { data: postCategoryList, isValidating } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

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
        post_id: generateProductSlug(cate.name, cate.id),
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

        <p className="title_lg">{`Danh mục sống khỏe`}</p>
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
                    <div className="">
                      {cate?.children?.map((child) => (
                        <div
                          onClick={() => hanldeCategoryClick(child)}
                          className="px-12 w-full"
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
              router.push('/post-list')
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
