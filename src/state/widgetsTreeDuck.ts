import { ContentRecord, WidgetMetaData } from "@activeviam/activeui-sdk";

import { Action } from "./actions";
import { State } from "./store";

export type WidgetsTreeState = ContentRecord<WidgetMetaData> | null;

export interface WidgetsTreeLoadedAction {
  type: "widgetsTreeLoaded";
  payload: WidgetsTreeState;
}

export const widgetsTreeReducer = (
  state: WidgetsTreeState = null,
  action: Action,
) => {
  switch (action.type) {
    case "widgetsTreeLoaded":
      return action.payload;
    default:
      return state;
  }
};

export const onWidgetsTreeLoaded = (widgetsTree: WidgetsTreeState) => ({
  type: "widgetsTreeLoaded",
  payload: widgetsTree,
});

export const getWidgetsTree = (state: State) => state.widgetsTree;
