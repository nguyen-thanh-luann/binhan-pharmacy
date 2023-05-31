import { FacebookIconOutline, TelePhoneIconOutline, ThreeDotsIcon, TimesIcon } from '@/assets'
import { CONTACT_PHONE_NUMBER } from '@/constants'
import classNames from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const ContactOptions = () => {
  const [expandOption, setExpandOption] = useState<boolean>(true)

  const zaloChatBtn: HTMLElement | null = document.querySelector('.zalo-chat-widget')

  const isDisplay: boolean =
    (zaloChatBtn && window.getComputedStyle(zaloChatBtn).display !== 'none') || false

  useEffect(() => {
    setExpandOption(isDisplay)
  }, [isDisplay])

  const hanldeToggleOption = () => {
    setExpandOption(!expandOption)

    if (zaloChatBtn) {
      if (expandOption) {
        zaloChatBtn.style.display = 'none'
      } else {
        zaloChatBtn.style.display = 'block'
      }
    }
  }

  return (
    <div>
      <div
        onClick={hanldeToggleOption}
        className={classNames(
          'fixed z-50 bottom-[60px] md:bottom-[12px] right-[32px] cursor-pointer border bg-white border-primary animate-bounce p-12 rounded-full'
        )}
      >
        {expandOption ? (
          <TimesIcon className="text-primary" />
        ) : (
          <ThreeDotsIcon className="text-primary" />
        )}
      </div>

      <div
        className={classNames(
          'flex flex-col fixed z-50 bottom-[180px] md:bottom-[130px] right-[30px] gap-12 animate-fade',
          expandOption ? 'block' : 'hidden'
        )}
      >
        <div className={classNames('rounded-full bg-blue p-10 cursor-pointer duration-200')}>
          <Link href={'https://www.facebook.com/duocbinhan'} target="_blank">
            <FacebookIconOutline className="text-white font-bold w-32 h-32" />
          </Link>
        </div>

        <div className={classNames('rounded-full bg-orange p-10 cursor-pointer duration-150')}>
          <Link href={`tel:${CONTACT_PHONE_NUMBER}`} target="_blank">
            <TelePhoneIconOutline className="text-white font-bold  w-32 h-32" />
          </Link>
        </div>
      </div>
    </div>
  )
}
