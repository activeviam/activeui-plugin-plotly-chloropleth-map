import { DrawerKey } from "../components/leftBar/drawer/drawers";

import { Action } from "./actions";
import { State } from "./store";

export interface ActiveDrawerChangedAction {
  type: "activeDrawerChanged";
  payload: DrawerKey;
}

export const activeDrawerReducer = (
  state: DrawerKey = "contentEditor",
  action: Action,
) => {
  if (action.type === "activeDrawerChanged") {
    return action.payload;
  }
  return state;
};

export const getActiveDrawer = (state: State) => state.activeDrawer;

export const onActiveDrawerChanged = (newActiveDrawer: DrawerKey | null) => ({
  type: "activeDrawerChanged",
  payload: newActiveDrawer,
});
