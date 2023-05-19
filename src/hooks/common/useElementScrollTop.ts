import { useEffect, useState } from 'react'

export const useElementFromTop = (elementId: string) => {
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    setHeight(document.getElementById(elementId)?.offsetTop || 0)
  }, [])

  return height
}
