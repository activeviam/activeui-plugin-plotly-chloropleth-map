import { ContentRecord, DashboardMetaData } from "@activeviam/activeui-sdk";

import { Action } from "./actions";
import { State } from "./store";

export type DashboardsTreeState = ContentRecord<DashboardMetaData> | null;

export interface DashboardsTreeLoadedAction {
  type: "dashboardsTreeLoaded";
  payload: DashboardsTreeState;
}

export const dashboardsTreeReducer = (
  state: DashboardsTreeState = null,
  action: Action,
) => {
  switch (action.type) {
    case "dashboardsTreeLoaded":
      return action.payload;
    default:
      return state;
  }
};

export const onDashboardsTreeLoaded = (
  dashboardsTree: DashboardsTreeState,
) => ({
  type: "dashboardsTreeLoaded",
  payload: dashboardsTree,
});

export const getDashboardsTree = (state: State) => state.dashboardsTree;
