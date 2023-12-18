import { ActionsTypes } from './actions'

export interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interrupedDate?: Date
  finishedDate?: Date
}

interface ICyclesState {
  cycles: ICycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: ICyclesState, action: any) {
  switch (action.type) {
    case ActionsTypes.ADD_NEW_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }

      break
    case ActionsTypes.RESET_CURRENT_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles],
        activeCycleId: null,
      }
      break
    case ActionsTypes.INTERRUPED_NEW_CYCLE:
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
    case ActionsTypes.FINISHED_NEW_CYCLE:
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
}
