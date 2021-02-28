import { Action } from "./actions";
import { State } from "./store";
import { getDashboardState } from "./dashboardDuck";
import { getActivePageKey } from "./activePageDuck";

/**
 * The key of the selected widget in each page.
 */
export interface WidgetSelectionState {
  [pageKey: string]: string;
}

export interface WidgetSelectedAction {
  type: "widgetSelected";
  payload: {
    pageKey: string;
    leafKey: string;
  };
}

export const widgetSelectionReducer = (
  state: WidgetSelectionState = {},
  action: Action,
) => {
  if (action.type === "widgetSelected") {
    return {
      ...state,
      [action.payload.pageKey]: action.payload.leafKey,
    };
  }
  return state;
};

export const onSelectedWidget = (pageKey: string, leafKey: string) => ({
  type: "widgetSelected",
  payload: { pageKey, leafKey },
});

/**
 * Returns the leafKey of the selected widget, identifying it in its parent dashboard page.
 */
export const getSelectedLeafKey = (state: State) => {
  const dashboard = getDashboardState(state);
  const activePageKey = getActivePageKey(state);
  if (!dashboard) {
    return undefined;
  }
  const selectedLeafKey = state.widgetSelection[activePageKey];
  if (
    selectedLeafKey &&
    state.dashboard.present?.pages[activePageKey].content[selectedLeafKey] !==
      undefined
  ) {
    return selectedLeafKey;
  }
  const { content } = dashboard.pages[activePageKey];
  return Object.keys(content)[0];
};
