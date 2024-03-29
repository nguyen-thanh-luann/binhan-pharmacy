import { PlusIcon, TimesIcon } from '@/assets'
import {
  Breadcrumb,
  Button,
  CreateTagForm,
  Modal,
  NotFound,
  Pagination,
  PostTagAdminItem,
  PostTagLoading
} from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isAdmin, isArrayHasValue } from '@/helper'
import { useChatAccount, useChatAdminAccount, useModal, useUser } from '@/hooks'
import { usePostTag } from '@/hooks/post/usePostTag'
import { AccountContainer, Main } from '@/templates'
import { CreatePostTagReq, PostTag, UpdatePostTagReq } from '@/types'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const PostTagsPage = () => {
  const { data: chatToken } = useChatAccount()
  const { data: chatInfo, updateChatAccountRole } = useChatAdminAccount()
  const { userInfo } = useUser({})
  const [currentTag, setCurrentTag] = useState<PostTag>()

  const {
    visible: isShowTagForm,
    closeModal: closeTagForm,
    toggle: toggleTagForm,
    openModal: openTagForm,
  } = useModal()

  const {
    data: postTagsList,
    isValidating,
    createPostTag,
    updatePostTag,
    deletePostTag,
    reStorePostTag,
    limit,
    offset,
    total,
    paginate,
  } = usePostTag({
    key: `${SWR_KEY.get_post_tags}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const handleCreatePostTag = (data: CreatePostTagReq) => {
    createPostTag(data, () => {
      toast.success('Thêm tag thành công!')
      closeTagForm()
    })
  }

  const handleUpdatePostTag = (data: UpdatePostTagReq) => {
    updatePostTag(data, () => {
      toast.success('Cập nhật tag thành công!')
      closeTagForm()
    })
  }

  const hanldeCloseTagForm = () => {
    toggleTagForm()
    setCurrentTag(undefined)
  }

  const handleEditTagClick = (data: PostTag) => {
    setCurrentTag(data)
    openTagForm()
  }

  const hanldeSubmit = (data: CreatePostTagReq) => {
    if (currentTag) {
      handleUpdatePostTag({
        id: currentTag.id,
        ...data,
      })
    } else {
      handleCreatePostTag(data)
    }
  }

  const handleChanegActive = (data: PostTag) => {
    if (data?.active) {
      deletePostTag(data, () => {
        toast.success('Cập nhật trạng thái tag thành công!')
      })
    } else {
      reStorePostTag(data, () => {
        toast.success('Cập nhật trạng thái tag thành công!')
      })
    }
  }

  const handlePaginate = (page: number) => {
    paginate({ page })
  }

  useEffect(() => {
    if (isAdmin(userInfo?.account)) {
      if (chatInfo && chatInfo?.role !== 'npp') {
        updateChatAccountRole({
          id: chatInfo?.id,
          role: 'npp',
        })
      }
    }
  }, [userInfo, chatInfo])
  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '',
              name: 'Quản lí tags',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">Quản lí tags</p>

            <Button
              title="Thêm tag mới"
              className="py-8 px-20 active:opacity-50 duration-200 border border-primary"
              textClassName="text-primary"
              icon={<PlusIcon className="text-primary" />}
              onClick={toggleTagForm}
            />
          </div>

          {isAdmin(userInfo?.account) && chatToken ? (
            <div>
              {isValidating || isArrayHasValue(postTagsList) ? (
                <div>
                  <div
                    className="max-h-[60vh] overflow-scroll scrollbar-hide"
                    id="postTagScrollable"
                  >
                    <div>
                      {isValidating ? (
                        <div>
                          <PostTagLoading />
                        </div>
                      ) : (
                        <div>
                          {postTagsList?.map((postTag) => {
                            return (
                              <div key={postTag.id}>
                                <PostTagAdminItem
                                  className="mb-12"
                                  data={postTag}
                                  onEdit={handleEditTagClick}
                                  onChangeActive={handleChanegActive}
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {!isValidating && (
                    <Pagination
                      forcePage={offset / limit}
                      className={classNames('mt-[24px]')}
                      pageCount={Math.ceil(total / DEFAULT_LIMIT)}
                      onPageChange={({ selected }) => handlePaginate(selected + 1)}
                    />
                  )}
                </div>
              ) : (
                <NotFound notify="Không tìm thấy tag!" />
              )}

              <Modal
                visible={isShowTagForm}
                animationType="fade"
                headerClassName="hidden"
                modalClassName="p-20 h-fit max-h-[550px] w-[500px] max-w-[90%] rounded-[10px] overflow-scroll scrollbar-hide"
              >
                <div className="flex justify-between items-center mb-12">
                  <p className="text-lg font-bold">{currentTag ? 'Cập nhật tag' : 'Tạo tag'}</p>
                  <div className="cursor-pointer" onClick={hanldeCloseTagForm}>
                    <TimesIcon className="w-16 h-16 text-gray" />
                  </div>
                </div>

                <CreateTagForm
                  type={currentTag ? 'update' : 'create'}
                  defaultValue={currentTag}
                  onSubmit={hanldeSubmit}
                />
              </Modal>
            </div>
          ) : (
            // <SignupPostAdminForm className="md:w-[60%] mx-auto" />
            <NotFound notify="Tài khoản của bạn không được cấp phép" />
          )}
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PostTagsPage
