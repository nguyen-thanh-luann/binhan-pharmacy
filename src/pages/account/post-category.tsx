import { PlusIcon, TimesIcon } from '@/assets'
import {
  Breadcrumb,
  Button,
  Modal,
  NotFound,
  PostCategoryForm,
  PostCategoryItem,
  SignupPostAdminForm,
  Spinner,
} from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useChatAccount, useModal, usePostCategory } from '@/hooks'
import { selectPostCategoryForm, setPostCategoryForm } from '@/store'
import { AccountContainer, Main } from '@/templates'
import { CreatePostCategory, PostCategory } from '@/types'
import { toast } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'

const PostCategoryPage = () => {
  const { data: chatToken } = useChatAccount()
  const currentPostCategory: PostCategory = useSelector(selectPostCategoryForm)

  const dispatch = useDispatch()

  const {
    visible: showPostCategoryModal,
    openModal: OpenCategoryModal,
    closeModal: closeCategoryModal,
  } = useModal()

  const {
    data: postCategoryList,
    createCategory,
    isValidating,
    hasMore,
    getMore,
    deletePostCategory,
    updateCategory,
  } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const handleCreatePostCategory = (props: CreatePostCategory) => {
    createCategory(
      props,
      () => {
        toast.success('Thêm danh mục thành công!')
        closeCategoryModal()
      },
      () => {
        toast.error('Lỗi, có thể slug đã tồn tại!')
        closeCategoryModal()
      }
    )
  }

  const hanldeDeleteCategory = (id: string) => {
    deletePostCategory(
      id,
      () => {
        toast.success('Xóa danh mục thành công!')
      },
      () => {
        toast.error('Có lỗi xảy ra!')
      }
    )
  }

  const handleUpdateCategory = (data: CreatePostCategory) => {
    updateCategory(
      { ...data, id: currentPostCategory?.id },
      () => {
        dispatch(setPostCategoryForm(undefined))
        toast.success('Cập nhật thông tin thành công!')
      },
      () => {
        toast.error('Có lỗi xảy ra!')
      }
    )
  }

  const handleSelectCategoryItemEdit = (item: PostCategory) => {
    dispatch(setPostCategoryForm(item))
  }
  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Danh mục tin tức',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">Danh mục tin tức</p>

            <Button
              title="Thêm danh mục"
              className="py-8 px-20 active:opacity-50 duration-200 border border-primary"
              textClassName="text-primary"
              icon={<PlusIcon className="text-primary" />}
              onClick={OpenCategoryModal}
            />
          </div>

          {chatToken ? (
            <div>
              {isValidating || isArrayHasValue(postCategoryList) ? (
                <div>
                  <InfiniteScroll
                    dataLength={postCategoryList?.length || 0}
                    next={() => getMore()}
                    hasMore={hasMore}
                    loader={hasMore ? <Spinner /> : null}
                  >
                    <div>
                      {isValidating ? (
                        <div>
                          <Spinner />
                        </div>
                      ) : (
                        <div>
                          {postCategoryList?.map((category) => (
                            <PostCategoryItem
                              data={category}
                              key={category.id}
                              onDelete={hanldeDeleteCategory}
                              onEdit={handleSelectCategoryItemEdit}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </InfiniteScroll>
                </div>
              ) : (
                <NotFound notify="Không tìm thấy danh mục nào!" />
              )}
            </div>
          ) : (
            <SignupPostAdminForm className="md:w-[60%] mx-auto" />
          )}

          {/* modal create post category */}
          <Modal
            visible={showPostCategoryModal}
            headerClassName="hidden"
            modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
          >
            <div>
              <div className="flex-between p-12">
                <p className="text-md">Thêm danh mục</p>
                <div className="cursor-pointer" onClick={closeCategoryModal}>
                  <TimesIcon />
                </div>
              </div>

              <div className="max-h-[400px] h-fit overflow-scroll scrollbar-hide p-12">
                <PostCategoryForm onSubmit={handleCreatePostCategory} />
              </div>
            </div>
          </Modal>

          {/* modal update post category */}

          <Modal
            visible={currentPostCategory !== undefined}
            headerClassName="hidden"
            modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
          >
            <div>
              <div className="flex-between p-12">
                <p className="text-md">Cập nhật danh mục</p>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    dispatch(setPostCategoryForm(undefined))
                  }}
                >
                  <TimesIcon />
                </div>
              </div>

              <div className="max-h-[400px] h-fit overflow-scroll scrollbar-hide p-12">
                <PostCategoryForm onSubmit={handleUpdateCategory} />
              </div>
            </div>
          </Modal>
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PostCategoryPage
