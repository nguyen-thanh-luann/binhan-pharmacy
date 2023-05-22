import { PlusIcon, TimesIcon } from '@/assets'
import { Breadcrumb, Button, Modal, PostCategoryForm, SignupPostAdminForm } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { useChatAccount, useModal } from '@/hooks'
import { AccountContainer, Main } from '@/templates'

const PostCategoryPage = () => {
  const { data: chatToken } = useChatAccount()

  const {
    visible: showPostCategoryModal,
    openModal: OpenCategoryModal,
    closeModal: closeCategoryModal,
  } = useModal()

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
              <p>content here</p>
            </div>
          ) : (
            <SignupPostAdminForm className="md:w-[60%] mx-auto" />
          )}

          {/* modal address form */}
          <Modal
            visible={showPostCategoryModal}
            headerClassName="hidden"
            modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
          >
            <div>
              <div className="flex-between p-12">
                <p className="text-md">Thêm địa chỉ mới</p>
                <div className="cursor-pointer" onClick={closeCategoryModal}>
                  <TimesIcon />
                </div>
              </div>

              <div className="max-h-[400px] h-fit overflow-scroll scrollbar-hide p-12">
                <PostCategoryForm />
              </div>
            </div>
          </Modal>
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PostCategoryPage
