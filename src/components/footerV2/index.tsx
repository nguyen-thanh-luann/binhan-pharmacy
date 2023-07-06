import { TelePhoneIcon } from '@/assets'
import { CONTACT_PHONE_NUMBER } from '@/constants'
import { useFooter } from '@/hooks/footer'
import classNames from 'classnames'
import React from 'react'
import { useRouter } from 'next/router'
import { CustomImage } from '../customImage'
import { generateProductSlug, isRemoteImageUrl } from '@/helper'
import { FooterLine } from '@/types'

export const FooterV2 = () => {
  const router = useRouter()
  const { footerData, isValidating } = useFooter({})

  if (isValidating || !footerData) return null

  const columnCount = footerData?.length

  const hanldeDescriptionLineClick = (props: FooterLine) => {
    if (props.description_style === 'description_none') return

    if (props.description_style === 'description_html') {
      router.push({
        pathname: '/info',
        query: {
          target: `${generateProductSlug(props.line_name, props.line_id)}`,
        },
      })
    } else {
      if (isRemoteImageUrl(props.description_url)) {
        window.open(props.description_url, '_blank')
      }
    }
  }

  return (
    <footer className="footer relative w-full py-80 px-24">
      <div
        className={classNames(
          `container px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columnCount} gap-40`
        )}
      >
        {footerData?.map((column) => (
          <div
            key={column?.column_id}
            className={classNames(
              `col-span-1 flex flex-col z-10`,
              column?.column_margin === 'left'
                ? 'items-start'
                : column?.column_margin === 'center'
                ? 'items-center'
                : 'items-end'
            )}
          >
            {/* heading of column */}
            {column?.data_view ? (
              column?.data_view === 'text' ? (
                <p className="text-primary font-bold text-lg leading-10 mb-24">
                  {column?.column_name}
                </p>
              ) : (
                <div className="mb-24">
                  <CustomImage
                    src={column?.image_url?.image_url}
                    className={`w-[${column?.image_size?.width}px] h-[${column?.image_size?.height}px]`}
                    imageClassName={`w-full max-w-[${column?.image_size?.width}px] object-cover`}
                  />
                </div>
              )
            ) : null}

            {/* content in column */}
            {column?.footer_line_ids?.map((line) => (
              <div key={line.line_id}>
                {line?.data_view ? (
                  line.data_view === 'text' ? (
                    <div
                      onClick={() => hanldeDescriptionLineClick(line)}
                      className={classNames(
                        'text-md text-text-color font-normal mb-12',
                        line.description_style === 'description_html' ||
                          line.description_style === 'description_url'
                          ? 'forward-link'
                          : ''
                      )}
                    >
                      {line?.line_name}
                    </div>
                  ) : (
                    <div
                      className={classNames(
                        'mb-24',
                        line.content_inline ? 'flex items-center gap-16' : ''
                      )}
                    >
                      <CustomImage
                        onClick={() => hanldeDescriptionLineClick(line)}
                        src={line?.image_url?.image_url}
                        className={classNames(
                          `w-[${line?.image_size?.width}px] h-[${line?.image_size?.height}px]`,
                          line.description_style === 'description_html' ||
                            line.description_style === 'description_url'
                            ? 'cursor-pointer'
                            : ''
                        )}
                        imageClassName={`w-full max-w-[${line?.image_size?.width}px] object-cover`}
                      />

                      {line?.content_inline?.map((content) => (
                        <div key={content.line_id} className={classNames('')}>
                          {content?.data_view === 'text' ? (
                            <div
                              className={classNames('text-md text-text-color font-normal mb-12')}
                            >
                              {content?.line_name}
                            </div>
                          ) : (
                            <CustomImage
                              onClick={() => hanldeDescriptionLineClick(line)}
                              src={content?.image_url?.image_url}
                              className={classNames(
                                `w-[${line?.image_size?.width}px] h-[${line?.image_size?.height}px]`,
                                line.description_style === 'description_html' ||
                                  line.description_style === 'description_url'
                                  ? 'cursor-pointer'
                                  : ''
                              )}
                              imageClassName={`w-full max-w-[${content?.image_size?.width}px] object-cover`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/*contact button*/}
      <a
        href={`tel:${CONTACT_PHONE_NUMBER}`}
        className="absolute top-[-25px] z-10 right-[5%] py-8 px-16 rounded-full bg-primary text-white flex-center gap-12"
      >
        <TelePhoneIcon className="w-16 h-16 text-white" />

        <p className="text-white text-base font-normal leading-10">{`${CONTACT_PHONE_NUMBER}`}</p>
      </a>

      {/* background linear */}
      <div className="absolute top-0 bottom-0 left-0 right-0 background-default z-0"></div>
    </footer>
  )
}
