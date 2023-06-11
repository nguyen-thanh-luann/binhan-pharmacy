import { DOMAIN_URL } from '@/constants'
import { generateProductSlug } from '@/helper'
import { PostDetail as IPostDetail } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import { PostTagItem } from '../postTag'
import { ShareSocial } from '../shareSocial'

interface PostDetailProps {
  data: IPostDetail
  className?: string
}

export const PostDetail = ({ data, className }: PostDetailProps) => {
  const router = useRouter()
  return (
    <div className={twMerge(classNames(`post-content bg-white p-12`, className))}>
      <div dangerouslySetInnerHTML={{ __html: data?.content + '' }}></div>

      <div className="border rounded-lg border-primary bg-white my-32 p-32">
        <div className="flex-center mb-12">
          <p className="text-primary text-md font-semibold mr-12">Chia sẻ cùng bạn bè: </p>
          <ShareSocial
            title={data?.title}
            slug={`${DOMAIN_URL}/post-detail?slug=${generateProductSlug(data?.title, data?.id)}`}
          />
        </div>

        <p className="text-base italic mb-12">
          <strong>Lưu ý: </strong> Thông tin trong bài viết chỉ mang tính chất tham khảo, vui lòng
          liên hệ với Bác sĩ, Dược sĩ hoặc chuyên viên y tế để được tư vấn cụ thể.
        </p>

        <div className="flex gap-8 overflow-scroll scrollbar-hide border-t border-gray pt-12">
          {data?.tags?.map((tag) => (
            <PostTagItem
              data={tag}
              onClick={(item) => {
                const { parent_category } = router.query
                router.push({
                  pathname: '/post-list',
                  query: {
                    parent_category,
                    tag_ids: [item?.tag_id],
                  },
                })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
