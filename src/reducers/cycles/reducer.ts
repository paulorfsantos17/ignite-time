import { ActionsTypes } from './actions'
import { produce } from 'immer'

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
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })

      break
    case ActionsTypes.RESET_CURRENT_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles],
        activeCycleId: null,
      }
      break
    case ActionsTypes.INTERRUPED_NEW_CYCLE:
      {
        const currentCycleIndex = state.cycles.findIndex((cycle) => {
          return cycle.id === state.activeCycleId
        })

        if (currentCycleIndex < 0) {
          return state
        }

        return produce(state, (draft) => {
          draft.activeCycleId = null
          draft.cycles[currentCycleIndex].interrupedDate = new Date()
        })
      }
      break
    case ActionsTypes.FINISHED_NEW_CYCLE:
      {
        const currentCycleIndex = state.cycles.findIndex((cycle) => {
          return cycle.id === state.activeCycleId
        })

        if (currentCycleIndex < 0) {
          return state
        }

        return produce(state, (draft) => {
          draft.activeCycleId = null
          draft.cycles[currentCycleIndex].finishedDate = new Date()
        })
      }
      break
      break
    default: {
      return state
    }
  }
}
