import { Breadcrumb, StoreProfile, UserProfile } from '@/components'
import { WEB_DESCRIPTION } from '@/constants'
import { useUser } from '@/hooks'
import { AccountContainer, Main } from '@/templates'

const ProfilePage = () => {
  const { userInfo } = useUser({})

  return (
    <Main title={'Tài khoản'} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Hồ sơ cá nhân',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <p className="text-xl capitalize font-semibold border-b border-gray-200 pb-12 mb-24">
            Hồ sơ cá nhân
          </p>

          {userInfo?.account?.medicine_account_type === 'drugstore_account' ? (
            <StoreProfile data={userInfo} />
          ) : (
            <UserProfile data={userInfo} />
          )}
        </div>
      </AccountContainer>
    </Main>
  )
}

export default ProfilePage
