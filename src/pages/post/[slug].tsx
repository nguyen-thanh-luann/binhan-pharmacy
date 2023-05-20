import { empty } from '@/assets'
import { Breadcrumb, Image, PostDetail, Spinner } from '@/components'
import { SWR_KEY } from '@/constants'
import { fromProductSlugToProductId, isObjectHasValue } from '@/helper'
import { usePostDetail } from '@/hooks'
import { postAPI } from '@/services'
import { Main } from '@/templates'
import { Post } from '@/types'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

type IPostUrl = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<IPostUrl> = async () => {
  try {
    const res: any = await postAPI.getPostList({})

    return {
      paths: res?.data?.data?.map((post: Post) => ({
        params: { slug: post?.id },
      })),
      fallback: false,
    }
  } catch (err) {
    console.log(err)
    return {
      paths: [],
      fallback: false,
    }
  }
}

export const getStaticProps: GetStaticProps<IPostUrl, IPostUrl> = async ({ params }) => {
  return {
    props: {
      slug: params!.slug,
    },
  }
}

const PostDetailPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  console.log({ props })

  const post_id = fromProductSlugToProductId((router.query.slug as string) || '')
  const { data: postDetail, isValidating } = usePostDetail({
    key: `${SWR_KEY.get_post_detail}_${post_id}`,
    params: { post_id },
  })

  return (
    <Main title="" description="">
      <div className="container my-24">
        {isValidating ? (
          <div className="flex-center">
            <Spinner />
          </div>
        ) : isObjectHasValue(postDetail) ? (
          <div>
            <Breadcrumb
              breadcrumbList={[
                {
                  path: '/',
                  name: 'Tin tức',
                },
              ]}
            />

            <div className="flex gap-24">
              <div className="w-[300px] hidden md:block ">
                <div className="bg-white p-12 sticky top-header_group_height">
                  {Array?.from({ length: 5 })?.map((_, index) => (
                    <div
                      key={index}
                      className="py-12 border-b border-gray-200 last:border-none flex items-center"
                    >
                      <Image src={empty} imageClassName="w-32 h-32 rounded-full mr-12" />
                      <p className="text-md">{`Danh mục ${index}`}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-white overflow-scroll scrollbar-hide">
                <PostDetail data={postDetail} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Main>
  )
}

export default PostDetailPage
