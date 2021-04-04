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
import { DrawerKey } from "../components/leftBar/drawer/drawers";
import { isPresentingReducer, IsPresentingState } from "./isPresentingDuck";

export interface State {
  activeDrawer: DrawerKey;
  activePage: ActivePageState;
  dashboard: StateWithHistory<DashboardState>;
  dataModel: DataModelState;
  isPresenting: IsPresentingState;
  widgetSelection: WidgetSelectionState;
}

export const reducer = combineReducers({
  activeDrawer: activeDrawerReducer,
  activePage: activePageReducer,
  dashboard: undoable(dashboardReducer, { limit: 20 }),
  dataModel: dataModelReducer,
  isPresenting: isPresentingReducer,
  widgetSelection: widgetSelectionReducer,
});

const store = createStore(
  reducer,
  // @ts-expect-error: __REDUX_DEVTOOLS_EXTENSION__ and __REDUX_DEVTOOLS_EXTENSION__() do not exist on window
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
