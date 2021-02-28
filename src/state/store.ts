import { createStore, combineReducers } from "redux";
import undoable, { StateWithHistory } from "redux-undo";
import { DashboardState } from "@activeviam/activeui-sdk";

import { dashboardReducer } from "./dashboardDuck";
import { activeDrawerReducer } from "./activeDrawerDuck";
import { DataModelState, dataModelReducer } from "./dataModelDuck";
import {
  widgetSelectionReducer,
  WidgetSelectionState,
} from "./selectedWidgetDuck";
import { activePageReducer, ActivePageState } from "./activePageDuck";
import { CredentialsState, credentialsReducer } from "./credentialsDuck";
import {
  DashboardsTreeState,
  dashboardsTreeReducer,
} from "./dashboardsTreeDuck";
import { WidgetsTreeState, widgetsTreeReducer } from "./widgetsTreeDuck";
import { accessLogsReducer, AccessLogsState } from "./accessLogsDuck";
import { DrawerKey } from "../components/leftBar/drawer/drawers";
import { isPresentingReducer, IsPresentingState } from "./isPresentingDuck";
import { settingsReducer, SettingsState } from "./settingsDuck";

export interface State {
  activeDrawer: DrawerKey;
  activePage: ActivePageState;
  credentials: CredentialsState;
  dashboard: StateWithHistory<DashboardState | null>;
  dashboardsTree: DashboardsTreeState;
  dataModel: DataModelState;
  isPresenting: IsPresentingState;
  accessLogs: AccessLogsState;
  settings: SettingsState;
  widgetSelection: WidgetSelectionState;
  widgetsTree: WidgetsTreeState;
}

export const reducer = combineReducers({
  activeDrawer: activeDrawerReducer,
  activePage: activePageReducer,
  credentials: credentialsReducer,
  dashboard: undoable(dashboardReducer, { limit: 20 }),
  dashboardsTree: dashboardsTreeReducer,
  dataModel: dataModelReducer,
  isPresenting: isPresentingReducer,
  accessLogs: accessLogsReducer,
  settings: settingsReducer,
  widgetSelection: widgetSelectionReducer,
  widgetsTree: widgetsTreeReducer,
});

const store = createStore(
  reducer,
  // @ts-expect-error: __REDUX_DEVTOOLS_EXTENSION__ and __REDUX_DEVTOOLS_EXTENSION__() do not exist on window
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
