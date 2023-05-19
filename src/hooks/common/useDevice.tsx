import {  DESKTOP_WIDTH, MOBILE_WIDTH, TABLET_WIDTH } from '@/constants'
import { useMediaQuery } from 'react-responsive'

const useDevice = () => {
  const isDesktop = useMediaQuery({ query: `(min-width: ${DESKTOP_WIDTH}px)` })
  const isTablet = useMediaQuery({ query: `(min-width: ${TABLET_WIDTH}px)` })
  const isMobile = useMediaQuery({ query: `(min-width: ${MOBILE_WIDTH}px)` })

  return {
    isDesktop,
    isTablet,
    isMobile,
  }
}

export { useDevice }
