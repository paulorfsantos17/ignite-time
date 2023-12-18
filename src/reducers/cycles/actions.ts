import { ICycle } from './reducer'

export enum ActionsTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  RESET_CURRENT_CYCLE = 'RESET_CURRENT_CYCLE',
  INTERRUPED_NEW_CYCLE = 'INTERRUPED_NEW_CYCLE',
  FINISHED_NEW_CYCLE = 'FINISHED_NEW_CYCLE',
}

export function addNewCycleAction(newCycle: ICycle) {
  return {
    type: ActionsTypes.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: ActionsTypes.FINISHED_NEW_CYCLE,
  }
}

export function markCurrentCycleAsInterrupedDateAction() {
  return {
    type: ActionsTypes.INTERRUPED_NEW_CYCLE,
  }
}

export function resetSetActiveCycleAction() {
  return {
    type: ActionsTypes.RESET_CURRENT_CYCLE,
  }
}
