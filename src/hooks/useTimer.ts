import { useEffect, useState, useCallback } from 'react'

export const useTimer = (initialSeconds: number, autoStart = false) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(autoStart)

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, timeLeft])

  const start = useCallback(() => {
    setTimeLeft(initialSeconds)
    setIsActive(true)
  }, [initialSeconds])

  const stop = useCallback(() => setIsActive(false), [])
  const reset = useCallback(() => setTimeLeft(initialSeconds), [initialSeconds])

  return { timeLeft, isActive, start, stop, reset }
}
