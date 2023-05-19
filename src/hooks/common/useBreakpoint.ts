import _ from "lodash"
import { useEffect, useState } from "react"

export const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(window.innerWidth)

  useEffect(() => {
    const calcInnerWidth = _.throttle(function () {
      setBrkPnt(window.innerWidth)
    }, 200)
    window.addEventListener("resize", calcInnerWidth)
    return () => window.removeEventListener("resize", calcInnerWidth)
  }, [])

  return brkPnt
}

