import Link from 'next/link'
import { BreadcrumbItem } from '@/types'
import { RightIcon } from '@/assets'

interface BreadcrumbProps {
  breadcrumbList: BreadcrumbItem[]
}

export const Breadcrumb = ({ breadcrumbList }: BreadcrumbProps) => {
  return (
    <div className="p-8 my-12 text-sm leading-8">
      <ul className="flex items-center gap-8 overflow-scroll scrollbar-hide">
        <li className="flex items-center gap-8 min-w-fit text-text-color">
          <Link href="/" className="forward-link">
            <span>{`Trang chủ`}</span>
          </Link>
          <RightIcon className="text-xs text-text-color" />
        </li>

        {breadcrumbList?.length > 0 &&
          breadcrumbList.map(
            (item, index) =>
              item.name && (
                <li key={index} className="flex items-center gap-8 min-w-fit text-text-color">
                  {index !== breadcrumbList.length - 1 ? (
                    <>
                      <Link href={item.path} className="forward-link">
                        <span className="line-clamp-2">{item.name}</span>
                      </Link>
                      <RightIcon className="text-sm text-text-color" />
                    </>
                  ) : (
                    <>
                      {item?.path !== '/' && item?.path !== '' ? (
                        <Link href={item.path} className="forward-link">
                          <span className="line-clamp-2">{item.name}</span>
                        </Link>
                      ) : (
                        <span className="text-text-color line-clamp-2">{item.name}</span>
                      )}
                    </>
                  )}
                </li>
              )
          )}
      </ul>
    </div>
  )
}
