import { useEffect } from 'react'
import { useGuest } from '../user'

export default function useBeforeUnload() {
  const { logoutGuest } = useGuest()

  useEffect(() => {
    const eventListener = () => {
      // event.preventDefault()

      logoutGuest()

    }

    window.addEventListener('beforeunload', eventListener)

    return () => {
      window.removeEventListener('beforeunload', eventListener)
    }
  }, [])
}
