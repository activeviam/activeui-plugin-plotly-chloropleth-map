/** @jsx jsx */
import { jsx } from "@emotion/core";
import Bowser from "bowser";
import { FC, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import {
  DashboardState,
  Dashboard,
  pluginWidgetPivotTable,
  DashboardPageState,
} from "@activeviam/activeui-sdk";
import {
  getSelectedLeafKey,
  onSelectedWidget,
} from "../state/selectedWidgetDuck";
import { getDashboardState, onDashboardUpdated } from "../state/dashboardDuck";
import { getActivePageKey, onActivePageChanged } from "../state/activePageDuck";

const browser = Bowser.parse(window.navigator.userAgent);

const initialPageStateWithPivotTable: Partial<DashboardPageState> = {
  content: {
    "0": pluginWidgetPivotTable.initialState,
  },
  layout: {
    children: [
      {
        leafKey: "0",
        size: 1,
      },
    ],
    direction: "row",
  },
};

/*
 * Renders a dashboard with an initial state corresponding to the saved dashboard with the given id.
 */
export const DemoDashboard: FC<{}> = () => {
  const dispatch = useDispatch();

  const activePageKey = useSelector(getActivePageKey);
  const selectedLeafKey = useSelector(getSelectedLeafKey);
  const dashboardState = useSelector(getDashboardState);

  // Undo/Redo on (Ctrl/Cmd) + Z/Y
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event[browser.os.name === "macOS" ? "metaKey" : "ctrlKey"]) {
        if (event.key === "z") {
          // Only fire the first event. "event.repeat" returns true if the given key is being held down.
          // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
          if (!event.repeat) {
            dispatch(ActionCreators.undo());
          }
        } else if (event.key === "y") {
          // On macOS chrome, Cmd + Y also opens up the history tab.
          if (browser.os.name === "macOS") {
            event.preventDefault();
          }
          if (!event.repeat) {
            dispatch(ActionCreators.redo());
          }
        }
      }
    };
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  const handleDashboardChanged = useCallback(
    (newDashboardState: DashboardState) => {
      dispatch(onDashboardUpdated(newDashboardState));
    },
    [dispatch]
  );

  const handleActivePageChange = useCallback(
    (newActivePageKey: string) => {
      dispatch(onActivePageChanged(newActivePageKey));
    },
    [dispatch]
  );

  const handleSelectedWidgetChange = useCallback(
    (newSelectedLeafKey: string) => {
      dispatch(onSelectedWidget(activePageKey, newSelectedLeafKey));
    },
    [dispatch, activePageKey]
  );

  return (
    <Dashboard
      activePageKey={activePageKey}
      state={dashboardState}
      onActivePageChange={handleActivePageChange}
      onChange={handleDashboardChanged}
      onWidgetSelected={handleSelectedWidgetChange}
      selectedLeafKey={selectedLeafKey}
      style={{ height: "100%" }}
      initialPageState={initialPageStateWithPivotTable}
    />
  );
};
