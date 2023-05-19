import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useComment, useUser } from '@/hooks'
import classNames from 'classnames'
import { useRef } from 'react'
import { toast } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { NotFound } from '../notFound'
import { Spinner } from '../spinner'
import { CommentItem } from './commentItem'
import { CommentItemLoading } from './commentItemLoading'

interface CommentProps {
  className?: string
  product_id: number
}

export const CommentTab = ({ className, product_id }: CommentProps) => {
  const { userInfo } = useUser({ shouldFetch: false })
  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  const {
    comments,
    isValidating,
    createComment,
    isCreateComment,
    deleteComment,
    hasMore,
    getMore,
  } = useComment({
    key: `${SWR_KEY.get_product_comment}_${product_id}`,
    params: {
      product_id,
      comment_type: ['comment'],
    },
  })

  const handleSubmit = () => {
    if (!userInfo?.account?.partner_id) {
      toast.error('Vui lòng đăng nhập!')
      return
    }

    const comment = commentInputRef.current?.value?.trim()

    if (!comment) {
      commentInputRef?.current?.focus()
      toast('Vui lòng nhập bình luận', {
        icon: '🙏',
      })
      return
    }

    createComment({
      product_id,
      content: comment,
    })

    const commentInput = commentInputRef?.current

    if (commentInput) {
      commentInput.value = ''
      commentInput?.focus()
      commentInput.style.height = '20px'
    }
  }

  const hanldeDeleteComment = (comment_id: number) => {
    deleteComment(comment_id)
  }

  const textareaGrowthUp = () => {
    const textarea = commentInputRef.current
    if (!textarea) return

    textarea.style.height = '20px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const renderCommentLoader = (number?: number, className?: string) => {
    return (
      <div className={classNames('', className)}>
        {Array.from({ length: number || 7 }).map((_, index) => (
          <CommentItemLoading key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={twMerge(classNames(``, className))}>
      <div className="flex items-center bg-background p-4 px-12 rounded-[10px] mb-16">
        <textarea
          id="comment-input"
          style={{ height: 20, maxHeight: 40 }}
          ref={commentInputRef}
          className="flex-1 text resize-none outline-none bg-background"
          placeholder="Thêm bình luận"
          onBlur={() => {}}
          onChange={() => {
            // const { value } = e.target
            textareaGrowthUp()
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter' && !e.shiftKey) {
              handleSubmit()
              e.preventDefault()
            }
          }}
        />

        <div>
          {isCreateComment ? (
            <Spinner />
          ) : (
            <Button
              onClick={handleSubmit}
              title="Gửi"
              className="px-8 border-l rounded-none border-gray-200"
              textClassName="text-primary font-bold active:opacity-50"
            />
          )}
        </div>
      </div>

      <div className="max-h-[50vh] overflow-scroll scrollbar-hide">
        {isValidating || isArrayHasValue(comments) ? (
          <div>
            <InfiniteScroll
              dataLength={comments?.length || 0}
              next={() => getMore()}
              hasMore={hasMore}
              loader={hasMore ? renderCommentLoader() : null}
            >
              <div>
                {isValidating ? (
                  renderCommentLoader()
                ) : (
                  <div>
                    {comments?.map((comment) => (
                      <CommentItem
                        key={comment?.comment_id}
                        data={comment}
                        onDelete={() => hanldeDeleteComment(comment?.comment_id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </InfiniteScroll>
          </div>
        ) : (
          <NotFound notify="Không tìm thấy bình luận nào cho sản phẩm" />
        )}
      </div>
    </div>
  )
}
