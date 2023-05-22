import { PlusIcon } from '@/assets'
import { Breadcrumb, Button, SignupPostAdminForm } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { useChatAccount } from '@/hooks'
import { AccountContainer, Main } from '@/templates'

const PostPage = () => {
  const { data: chatToken } = useChatAccount()

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Tin tức',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">Tin tức</p>

            <Button
              title="Thêm tin tức"
              className="py-8 px-20 active:opacity-50 duration-200 border border-primary"
              textClassName="text-primary"
              icon={<PlusIcon className="text-primary" />}
              // onClick={()}
            />
          </div>

          {chatToken ? (
            <div>
              <p>content here</p>
            </div>
          ) : (
            <SignupPostAdminForm className="md:w-[60%] mx-auto" />
          )}
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PostPage
