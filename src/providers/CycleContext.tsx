import { ReactNode, createContext, useReducer, useState } from 'react'

interface ICreateCycleData {
  task: string
  minutesAmount: number
}

export interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interrupedDate?: Date
  finishedDate?: Date
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

interface ICyclesState {
  cycles: ICycle[]
  activeCycleId: string | null
}

export const CyclesContext = createContext({} as ICycleContextType)

export function CyclesContextProvider({
  children,
}: ICycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: ICyclesState, action: any) => {
      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
          break
        case 'INTERRUPED_NEW_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interrupedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
          break
        case 'FINISHED_NEW_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
          break
        default: {
          return state
        }
      }
    },
    { cycles: [], activeCycleId: null },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const markCurrentCycleAsFinished = () => {
    dispatch({
      type: 'FINISHED_NEW_CYCLE',
      payload: {
        data: activeCycleId,
      },
    })
  }

  const markCurrentCycleAsInterrupedDate = () => {
    dispatch({
      type: 'INTERRUPED_NEW_CYCLE',
      payload: {
        data: activeCycleId,
      },
    })
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

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
  }

  function changeAmountSecondsPassed(second: number) {
    setAmountSecondsPassed(second)
  }

  function resetSetActiveCycle() {
    setActiveCycleId(null)
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
