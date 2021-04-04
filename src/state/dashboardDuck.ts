import {
  DashboardState,
  deserializeDashboardState,
} from "@activeviam/activeui-sdk";

import { Action } from "./actions";
import { State } from "./store";
import { serializedDashboard } from "../dashboard";

const initialDashboardState = deserializeDashboardState(serializedDashboard);
export interface DashboardUpdatedAction {
  type: "dashboardUpdated";
  payload: DashboardState;
}

export const dashboardReducer = (
  state: DashboardState = initialDashboardState,
  action: Action
) => {
  switch (action.type) {
    case "dashboardUpdated":
      return action.payload;
    default:
      return state;
  }
};

export const onDashboardUpdated = (newDashboard: DashboardState) => ({
  type: "dashboardUpdated",
  payload: newDashboard,
});

export const getDashboardState = (state: State): DashboardState => {
  return state.dashboard.present ?? initialDashboardState;
};
