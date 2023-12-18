import { ReactNode, createContext, useReducer, useState } from 'react'
import { ICycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  markCurrentCycleAsFinishedAction,
  markCurrentCycleAsInterrupedDateAction,
  resetSetActiveCycleAction,
} from '../reducers/cycles/actions'

interface ICreateCycleData {
  task: string
  minutesAmount: number
}

interface ICycleContextType {
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  cycles: ICycle[]
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  interruptCycle: () => void
  createNewCycle: (data: ICreateCycleData) => void
  changeAmountSecondsPassed: (second: number) => void
  resetSetActiveCycle: () => void
}

interface ICycleContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as ICycleContextType)

export function CyclesContextProvider({
  children,
}: ICycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const markCurrentCycleAsFinished = () => {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  const markCurrentCycleAsInterrupedDate = () => {
    dispatch(markCurrentCycleAsInterrupedDateAction())
  }

  const activeCycle: ICycle | undefined = cycles.find(
    (cycle) => cycle.id === activeCycleId,
  )

  function interruptCycle() {
    markCurrentCycleAsInterrupedDate()
  }

  function createNewCycle(data: ICreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
  }

  function changeAmountSecondsPassed(second: number) {
    setAmountSecondsPassed(second)
  }

  function resetSetActiveCycle() {
    dispatch(resetSetActiveCycleAction())
  }
  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        cycles,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        createNewCycle,
        interruptCycle,
        changeAmountSecondsPassed,
        resetSetActiveCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
