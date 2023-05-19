import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Spinner } from '../spinner'

export const Backdrop = () => {
  const backdropVisible = useSelector((state: RootState) => state.common.backdropVisible)

  if (!backdropVisible) return null

  return (
    <div className="fixed inset-[0] bg-black-400 z-[9999] flex-center">
      <div role="status" className="bg-white p-12 rounded-md">
        <Spinner />
      </div>
    </div>
  )
}
