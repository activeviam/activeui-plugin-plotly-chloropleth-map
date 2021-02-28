import {
  DashboardUpdatedAction,
  DashboardUnloadedAction,
} from "./dashboardDuck";
import { ActiveDrawerChangedAction } from "./activeDrawerDuck";
import { DataModelLoadedAction } from "./dataModelDuck";
import { WidgetSelectedAction } from "./selectedWidgetDuck";
import { ActivePageChangedAction } from "./activePageDuck";
import { LoggedOutAction, LoggedInAction } from "./credentialsDuck";
import { DashboardsTreeLoadedAction } from "./dashboardsTreeDuck";
import { WidgetsTreeLoadedAction } from "./widgetsTreeDuck";
import {
  AccessLogsLoadedAction,
  AccessLogsUpdatedAction,
} from "./accessLogsDuck";
import { IsPresentingAction } from "./isPresentingDuck";
import { SettingsLoadedAction } from "./settingsDuck";

export type ActionType =
  | "activePageChanged"
  | "activeDrawerChanged"
  | "dashboardsTreeLoaded"
  | "dashboardUnloaded"
  | "dashboardUpdated"
  | "dataModelLoaded"
  | "isPresentingChanged"
  | "loggedIn"
  | "loggedOut"
  | "accessLogsLoaded"
  | "accessLogsUpdated"
  | "settingsLoaded"
  | "widgetSelected"
  | "widgetsTreeLoaded";

export type Action =
  | ActivePageChangedAction
  | ActiveDrawerChangedAction
  | DashboardsTreeLoadedAction
  | DashboardUnloadedAction
  | DashboardUpdatedAction
  | DataModelLoadedAction
  | IsPresentingAction
  | LoggedInAction
  | LoggedOutAction
  | AccessLogsLoadedAction
  | AccessLogsUpdatedAction
  | SettingsLoadedAction
  | WidgetSelectedAction
  | WidgetsTreeLoadedAction;
