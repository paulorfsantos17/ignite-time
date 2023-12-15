import { useContext, useEffect } from 'react'
import { CountdownContainer, Separator } from './style'
import { differenceInSeconds } from 'date-fns'

import { CyclesContext } from '../../../../providers/CycleContext'

export function CountDown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFininished,
    amountSecondsPassed,
    changeAmountSecondsPassed,
    resetSetActiveCycle,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} -  ${activeCycle.task}`
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFininished()
          changeAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
          resetSetActiveCycle()
        } else {
          changeAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFininished,
    changeAmountSecondsPassed,
    resetSetActiveCycle,
  ])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
