import { DashboardUpdatedAction } from "./dashboardDuck";
import { ActiveDrawerChangedAction } from "./activeDrawerDuck";
import { DataModelLoadedAction } from "./dataModelDuck";
import { WidgetSelectedAction } from "./selectedWidgetDuck";
import { ActivePageChangedAction } from "./activePageDuck";
import { IsPresentingAction } from "./isPresentingDuck";

export type ActionType =
  | "activePageChanged"
  | "activeDrawerChanged"
  | "dashboardUpdated"
  | "dataModelLoaded"
  | "isPresentingChanged"
  | "widgetSelected";

export type Action =
  | ActivePageChangedAction
  | ActiveDrawerChangedAction
  | DashboardUpdatedAction
  | DataModelLoadedAction
  | IsPresentingAction
  | WidgetSelectedAction;
