import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { ICycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  markCurrentCycleAsFinishedAction,
  markCurrentCycleAsInterrupedDateAction,
  resetSetActiveCycleAction,
} from '../reducers/cycles/actions'

import { differenceInSeconds } from 'date-fns'

interface ICreateCycleData {
  task: string
  minutesAmount: number
}

interface ICycleContextType {
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  cycles: ICycle[]
  amountSecondsPassed: number
  setAmountSecondsPassed: (second: number) => void
  markCurrentCycleAsFinished: () => void
  interruptCycle: () => void
  createNewCycle: (data: ICreateCycleData) => void

  resetSetActiveCycle: () => void
}

interface ICycleContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as ICycleContextType)

export function CyclesContextProvider({
  children,
}: ICycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJson = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson)
      }

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState

  const activeCycle: ICycle | undefined = cycles.find(
    (cycle) => cycle.id === activeCycleId,
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

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

  const markCurrentCycleAsFinished = () => {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  const markCurrentCycleAsInterrupedDate = () => {
    dispatch(markCurrentCycleAsInterrupedDateAction())
  }

  function interruptCycle() {
    markCurrentCycleAsInterrupedDate()
  }

  function resetSetActiveCycle() {
    dispatch(resetSetActiveCycleAction())
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

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
        setAmountSecondsPassed,
        resetSetActiveCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
