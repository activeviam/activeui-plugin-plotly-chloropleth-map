/** @jsx jsx */
import { jsx } from "@emotion/core";
import _map from "lodash/map";
import _orderBy from "lodash/orderBy";
import Bowser from "bowser";
import { FC, useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import { useHistory } from "react-router-dom";
import {
  deserializeDashboardState,
  useContentClient,
  DashboardState,
  getPathToFolder,
  findContentRecords,
  Dashboard,
  pluginWidgetPivotTable,
  DashboardPageState,
  useUser,
} from "@activeviam/activeui-sdk";
import { PageNotFound } from "./PageNotFound";
import { getDashboardsTree } from "../state/dashboardsTreeDuck";
import { getAccessLogs, onAccessLogsUpdated } from "../state/accessLogsDuck";
import {
  getSelectedLeafKey,
  onSelectedWidget,
} from "../state/selectedWidgetDuck";
import { getDashboardState, onDashboardUpdated } from "../state/dashboardDuck";
import { getActivePageKey, onActivePageChanged } from "../state/activePageDuck";

const browser = Bowser.parse(window.navigator.userAgent);

interface DashboardBasedOnIdProps {
  id: string;
}

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
export const DashboardBasedOnId: FC<DashboardBasedOnIdProps> = ({ id }) => {
  const contentClient = useContentClient();
  const dispatch = useDispatch();
  const dashboardsTree = useSelector(getDashboardsTree);
  const accessLogs = useSelector(getAccessLogs);
  const { username } = useUser();
  const { formatMessage } = useIntl();
  const [isDashboardContentLoaded, setIsDashboardContentLoaded] = useState(
    false,
  );

  const activePageKey = useSelector(getActivePageKey);
  const selectedLeafKey = useSelector(getSelectedLeafKey);
  const dashboardState = useSelector(getDashboardState);
  const history = useHistory();
  const isExportingToPDF = history.location.pathname.endsWith("/export");

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

  // Fetch the content of the dashboard when `id` changes.
  useEffect(() => {
    const initDashboard = async () => {
      if (id && dashboardsTree) {
        const pathToFolder = getPathToFolder(dashboardsTree, id);
        if (pathToFolder !== undefined) {
          const dashboardState = await contentClient.fetchFile<
            DashboardState<"serialized">
          >({
            id,
            pathToFolder,
            type: "dashboard",
          });
          if (dashboardState !== undefined) {
            if (dashboardState.name) {
              document.title = dashboardState.name;
            }
            const hydratedDashboardState = deserializeDashboardState(
              dashboardState,
            );
            dispatch(onDashboardUpdated(hydratedDashboardState));
            // Clear Undo/Redo history when a new dashboard is loaded
            dispatch(ActionCreators.clearHistory());
          }
        }
        setIsDashboardContentLoaded(true);
      }
    };
    initDashboard();
  }, [id, contentClient, dashboardsTree, dispatch]);

  // Update the recently opened dashboards content when `id` changes.
  useEffect(
    () => {
      if (id && dashboardsTree) {
        const accessibleDashboards = findContentRecords(
          dashboardsTree,
          _map(accessLogs, "id"),
        );

        const updatedAccessLogs = _orderBy(
          [
            ...(accessLogs || []).filter(
              (accessLog) =>
                accessLog.id !== id &&
                accessibleDashboards[accessLog.id] !== undefined &&
                accessibleDashboards[accessLog.id].node.entry.canRead,
            ),
            {
              id,
              lastOpened: Date.now(),
            },
          ],
          "lastOpened",
          "desc",
        );

        dispatch(onAccessLogsUpdated(updatedAccessLogs));

        contentClient.updateAccessLogs({
          username,
          accessLogs: updatedAccessLogs,
          type: "dashboard",
        });
      }
    },
    // Leaving out `accessLogs`, otherwise this would loop infinitely.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, dashboardsTree, dispatch, username, contentClient],
  );

  const handleDashboardChanged = useCallback(
    (newDashboardState: DashboardState) => {
      dispatch(onDashboardUpdated(newDashboardState));
    },
    [dispatch],
  );

  const handleActivePageChange = useCallback(
    (newActivePageKey: string) => {
      dispatch(onActivePageChanged(newActivePageKey));
    },
    [dispatch],
  );

  const handleSelectedWidgetChange = useCallback(
    (newSelectedLeafKey: string) => {
      dispatch(onSelectedWidget(activePageKey, newSelectedLeafKey));
    },
    [dispatch, activePageKey],
  );

  const handleExportToPDFFinished = useCallback(() => {
    history.push(history.location.pathname.replace(/\/export$/, ""));
  }, [history]);

  if (!isDashboardContentLoaded) {
    return null;
  }

  if (dashboardState === null) {
    return (
      <PageNotFound
        message={formatMessage(
          { id: "error.dashboardNotFound" },
          {
            id,
          },
        )}
      />
    );
  }

  return (
    <Dashboard
      activePageKey={activePageKey}
      state={dashboardState}
      isExportingToPDF={isExportingToPDF}
      onAfterPrint={handleExportToPDFFinished}
      onActivePageChange={handleActivePageChange}
      onChange={handleDashboardChanged}
      onWidgetSelected={handleSelectedWidgetChange}
      selectedLeafKey={selectedLeafKey}
      style={{ height: "100%" }}
      initialPageState={initialPageStateWithPivotTable}
    />
  );
};
