import { Settings } from "@activeviam/activeui-sdk";
import { Action } from "./actions";
import { State } from "./store";

export type SettingsState = Settings | null;

export interface SettingsLoadedAction {
  type: "settingsLoaded";
  payload: SettingsState;
}

export const settingsReducer = (
  state: SettingsState = null,
  action: Action,
) => {
  if (action.type === "settingsLoaded") {
    return action.payload;
  }
  return state;
};

export const getSettings = (state: State) => state.settings;

export const onSettingsLoaded = (settings: SettingsState) => ({
  type: "settingsLoaded",
  payload: settings,
});
