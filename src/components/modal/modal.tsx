import { TimesIcon } from '@/assets'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import ReactPortal from './portal'
import { useModalTransition } from './useModalTransition'

export type ModalTransitionType =
  | 'fade'
  | 'slideDown'
  | 'slideUp'
  | 'slideFromLeft'
  | 'slideFromRight'

export type ModalProps = {
  children?: ReactNode
  visible: boolean
  className?: string
  modalClassName?: string
  allowOverlayclose?: boolean
  animationType?: ModalTransitionType
  header?: JSX.Element
  headerClassName?: string
  headerTitle?: string
  overlayclassName?: string
  footer?: JSX.Element
  onClose?: () => void
}

export const Modal = ({
  children,
  headerTitle,
  visible,
  allowOverlayclose = true,
  className,
  modalClassName,
  animationType = 'slideDown',
  overlayclassName,
  header,
  headerClassName,
  footer,
  onClose,
}: ModalProps) => {
  const { fadeInVariants, variants } = useModalTransition(animationType)

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <AnimatePresence>
        {visible && (
          <div
            className={twMerge(
              classNames('fixed inset-0 flex-center items-end z-[1000]', className)
            )}
          >
            <ModalChildren />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
              className={twMerge(
                classNames(
                  'z-10 rounded-[5px] bg-white flex flex-col w-[400px] h-[400px]',
                  modalClassName
                )
              )}
            >
              {header || (
                <div
                  className={twMerge(classNames('h-[56px] flex items-center p-4', headerClassName))}
                >
                  <p className="text-lg line-clamp-1 flex-1">{headerTitle}</p>
                  <button className="p-[4px]" onClick={onClose}>
                    <TimesIcon className="text-sm" />
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">{children}</div>

              {footer || null}
            </motion.div>

            {/* Overlay */}
            <motion.div
              className={twMerge(classNames('bg-black-500 absolute inset-0', overlayclassName))}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInVariants}
              onClick={allowOverlayclose ? onClose : undefined}
            />
          </div>
        )}
      </AnimatePresence>
    </ReactPortal>
  )
}

const ModalChildren = () => {
  useEffect(() => {
      document.documentElement.style.overflow = 'hidden'
      return () => {
      document.documentElement.style.overflow = 'auto'
    }
  })
  return null
}
