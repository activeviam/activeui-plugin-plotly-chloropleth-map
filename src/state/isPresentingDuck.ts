import { Action } from "./actions";
import { State } from "./store";

export type IsPresentingState = boolean;

export interface IsPresentingAction {
  type: "isPresentingChanged";
  payload: IsPresentingState;
}

export const isPresentingReducer = (
  state: IsPresentingState = false,
  action: Action,
) => {
  if (action.type === "isPresentingChanged") {
    return action.payload;
  }
  return state;
};

export const getIsPresenting = (state: State) => state.isPresenting;

export const onIsPresentingChanged = (newIsPresenting: IsPresentingState) => ({
  type: "isPresentingChanged",
  payload: newIsPresenting,
});
