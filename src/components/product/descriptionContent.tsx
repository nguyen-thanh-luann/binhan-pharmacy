import classNames from 'classnames'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

interface DescriptionContentProps {
  content: string // the main content of the description
  onUserScroll?: (data: number) => void
  className?: string
}

export const DescriptionContent = forwardRef(
  ({ content: data, onUserScroll, className }: DescriptionContentProps, ref) => {
    const router = useRouter()
    const [show, setShow] = useState<boolean>(false)
    const [contentHeight, setContentHeight] = useState<number>(0)

    useImperativeHandle(ref, () => ({
      setShow,
      show,
    }))

    useEffect(() => {
      // set contentHeight to set button show more and gradient effect or not
      setContentHeight(document.querySelector('.product_detail_desc-content')?.clientHeight || 0)

      // detect user scroll to each description
      const descTitles: any = document.querySelectorAll('.desc_title')

      const observer = new IntersectionObserver((entries) => {
        entries?.forEach(
          (entry) => {
            if (entry?.isIntersecting) {
              onUserScroll?.(Number(entry?.target?.id.replace('desc_category_', '')))
            }
          },
          {
            threshold: 1,
          }
        )
      })

      descTitles?.forEach((descTitle: any) => {
        observer.observe(descTitle)
      })
    }, [router.query, data])

    return (
      <div className={classNames('product_detail_desc p-12', className)}>
        <div className="relative">
          <div
            className={classNames(
              'product_detail_desc-content h-full overflow-scroll scrollbar-hide',
              contentHeight >= 500 && !show ? 'max-h-[500px]' : ''
            )}
            dangerouslySetInnerHTML={{
              __html: data || '',
            }}
          ></div>
          {contentHeight >= 500 && !show ? (
            <div className="absolute bottom-0 left-0 right-0 h-[70px] gradient"></div>
          ) : null}
        </div>

        {contentHeight >= 500 ? (
          <div className="flex justify-center my-12">
            <button
              onClick={() => setShow(!show)}
              className="bg-white text-primary border border-primary py-8 px-12 rounded-[10px]"
            >
              {show ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        ) : null}
      </div>
    )
  }
)
