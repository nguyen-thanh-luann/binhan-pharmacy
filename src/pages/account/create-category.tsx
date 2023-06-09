import { Breadcrumb, NotFound, PostCategoryForm } from '@/components'
import { WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isAdmin } from '@/helper'
import { useChatAccount, useUser } from '@/hooks'
import { selectPostCategoryForm } from '@/store'
import { AccountContainer, Main } from '@/templates'
import { PostCategory } from '@/types'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

const Createcategory = () => {
  const router = useRouter()
  const { data: chatToken } = useChatAccount()
  const currentPostCategory: PostCategory = useSelector(selectPostCategoryForm)
  const { userInfo } = useUser({})

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              name: 'Tạo danh mục tin tức',
              path: '',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">Tạo danh mục tin tức</p>
          </div>

          <div>
            {isAdmin(userInfo?.account) && chatToken ? (
              <div>
                <PostCategoryForm
                  onSubmit={() => {}}
                  // categoryOptions={}
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
