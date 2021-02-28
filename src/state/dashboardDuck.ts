import { DashboardState } from "@activeviam/activeui-sdk";

import { Action } from "./actions";
import { State } from "./store";

export interface DashboardUpdatedAction {
  type: "dashboardUpdated";
  payload: DashboardState | null;
}

export interface DashboardUnloadedAction {
  type: "dashboardUnloaded";
}

export const dashboardReducer = (
  state: DashboardState | null = null,
  action: Action,
) => {
  switch (action.type) {
    case "dashboardUpdated":
      return action.payload;
    case "dashboardUnloaded":
      return null;
    default:
      return state;
  }
};

export const onDashboardUpdated = (newDashboard: DashboardState) => ({
  type: "dashboardUpdated",
  payload: newDashboard,
});

export const onDashboardUnloaded = () => ({
  type: "dashboardUnloaded",
});

export const getDashboardState = (state: State) => {
  return state.dashboard.present;
};
