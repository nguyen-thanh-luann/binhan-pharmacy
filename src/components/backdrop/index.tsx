import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { BackdropElement } from './backdropElement'

export const Backdrop = () => {
  const backdropVisible = useSelector((state: RootState) => state.common.backdropVisible)

  if (!backdropVisible) return null

  return (
    <div>
      <BackdropElement className="fixed inset-[0] bg-black-700 z-[9999] flex-center" />
    </div>
  )
}
