import { Breadcrumb, NotFound, PostCategoryForm } from '@/components'
import { SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isAdmin } from '@/helper'
import { useChatAccount, usePostCategory, useUser } from '@/hooks'
import { selectPostCategoryForm, setPostCategoryForm } from '@/store'
import { AccountContainer, Main } from '@/templates'
import { CreatePostCategory, PostCategory } from '@/types'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

const Createcategory = () => {
  const { data: chatToken } = useChatAccount()
  const { userInfo } = useUser({})
  const dispatch = useDispatch()
  const router = useRouter()
  const { category_id } = router.query

  const currentPostCategory: PostCategory = useSelector(selectPostCategoryForm)
  const title = currentPostCategory ? 'Cập nhật danh mục tin tức' : 'Tạo danh mục tin tức'

  const { createCategory, updateCategory } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {},
  })

  useEffect(() => {
    if (!category_id) {
      dispatch(setPostCategoryForm(undefined))
    }
  }, [category_id])

  const handleCreatePostCategory = (props: CreatePostCategory) => {
    createCategory(
      props,
      () => {
        toast.success('Thêm danh mục thành công!')
        router.push('/account/post-category')
      },
      () => {
        toast.error('Lỗi, có thể slug đã tồn tại!')
      }
    )
  }

  const handleUpdateCategory = (data: CreatePostCategory) => {
    updateCategory(
      { ...data, id: currentPostCategory?.id },
      () => {
        dispatch(setPostCategoryForm(undefined))
        toast.success('Cập nhật thông tin thành công!')
        router.push('/account/post-category')
      },
      () => {
        toast.error('Có lỗi xảy ra!')
      }
    )
  }

  const onPostCategoryFormSubmit = (data: CreatePostCategory) => {
    if (currentPostCategory) {
      handleUpdateCategory(data)
    } else {
      handleCreatePostCategory(data)
    }
  }

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              name: 'Danh mục tin tức',
              path: '/account/post-category',
            },
            {
              name: `${title}`,
              path: '',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">{title}</p>
          </div>

          <div>
            {isAdmin(userInfo?.account) && chatToken ? (
              <div>
                <PostCategoryForm
                  onSubmit={onPostCategoryFormSubmit}
                  defaultPostCategory={category_id ? currentPostCategory : undefined}
                />
              </div>
            ) : (
              <NotFound notify="Tài khoản của bạn không được cấp phép" />
            )}
          </div>
        </div>
      </AccountContainer>
    </Main>
  )
}

export default Createcategory
