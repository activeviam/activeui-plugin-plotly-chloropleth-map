import { AccessLog } from "@activeviam/activeui-sdk";
import { Action } from "./actions";
import { State } from "./store";

export type AccessLogsState = AccessLog[] | null;

export interface AccessLogsLoadedAction {
  type: "accessLogsLoaded";
  payload: AccessLogsState;
}

export interface AccessLogsUpdatedAction {
  type: "accessLogsUpdated";
  payload: AccessLogsState;
}

export const accessLogsReducer = (
  state: AccessLogsState = null,
  action: Action,
) => {
  switch (action.type) {
    case "accessLogsLoaded":
    case "accessLogsUpdated":
      return action.payload;
    default:
      return state;
  }
};

export const onAccessLogsLoaded = (accessLogs: AccessLogsState) => ({
  type: "accessLogsLoaded",
  payload: accessLogs,
});

export const onAccessLogsUpdated = (accessLogs: AccessLogsState) => ({
  type: "accessLogsLoaded",
  payload: accessLogs,
});

export const getAccessLogs = (state: State) => state.accessLogs;
