import { useCountdown } from "@/hooks"
import moment from "moment"
import { useEffect, useMemo } from "react"

interface CountdownProps {
  secondsRemains: number
  onExpiredCoundown?: Function
  className?: string
}

export const CountdownRedirect = ({ onExpiredCoundown, secondsRemains, className }: CountdownProps) => {
  const targetDate = useMemo(() => {
    return moment(new Date(), "DD/MM/YYYY hh:mm:ss").add(secondsRemains, "seconds").toString()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {minutes, seconds} = useCountdown({
    targetDate,
  })

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      onExpiredCoundown?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes, seconds])

  return (
    <span className={`${className}`}>
      {`0${minutes}`.slice(-2)}:{`0${seconds}`.slice(-2)}
    </span>
  )
}
