import { Action } from "./actions";
import { State } from "./store";

/**
 * The key of the selected widget in each page.
 */
export type ActivePageState = string;

export interface ActivePageChangedAction {
  type: "activePageChanged";
  payload: ActivePageState;
}

export const activePageReducer = (
  state: ActivePageState = "p-0",
  action: Action,
) => {
  if (action.type === "activePageChanged") {
    return action.payload;
  }
  return state;
};

export const onActivePageChanged = (newActivePageKey: string) => ({
  type: "activePageChanged",
  payload: newActivePageKey,
});

export const getActivePageKey = (state: State) => {
  const activePage = state.activePage;
  if (state.dashboard.present?.pagesOrder.includes(activePage)) {
    return activePage;
  }
  return "p-0";
};
