import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  serializeDashboardState,
  useContentClient,
  DashboardContent,
  getPathToFolder,
  DashboardMetaData,
  DashboardState,
} from "@activeviam/activeui-sdk";

import { getDashboardState } from "../state/dashboardDuck";
import { State } from "../state/store";
import { useRefreshTree } from "./useRefreshTree";
import { getDashboardsTree } from "../state/dashboardsTreeDuck";

/**
 * React Hook returning a function allowing to save the currently loaded dashboard
 */
export const useSaveDashboard = () => {
  const dashboardFromState = useSelector(getDashboardState);
  const dashboardsTree = useSelector(getDashboardsTree);
  const refreshDashboardsTree = useRefreshTree("dashboard");
  const contentClient = useContentClient();

  const history = useHistory();
  const id = useMemo(() => {
    if (!history.location.pathname.startsWith("/dashboard/")) {
      return null;
    }
    return history.location.pathname.slice(11);
  }, [history.location]);

  const didUserMakeChanges = useSelector(
    (state: State) => state.dashboard.past.length > 0,
  );

  return async (dashboard?: DashboardState) => {
    // It's handy to not have to provide `dashboard` when calling this function, but there is one exception. See Header.tsx
    const _dashboard = dashboard === undefined ? dashboardFromState : dashboard;
    if (
      id &&
      _dashboard &&
      dashboardsTree &&
      (didUserMakeChanges || dashboard !== undefined)
    ) {
      const { name, ...dryDashboard } = serializeDashboardState(_dashboard);
      const pathToFolder = getPathToFolder(dashboardsTree, id);
      if (pathToFolder !== undefined) {
        try {
          await contentClient.updateFile<DashboardContent, DashboardMetaData>({
            content: dryDashboard,
            id,
            metaData: { name },
            pathToFolder,
            type: "dashboard",
          });
          refreshDashboardsTree();
        } catch (err) {
          console.error(err);
        }
      }
    }
  };
};
