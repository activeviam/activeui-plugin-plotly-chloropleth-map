import { useSelector, useDispatch } from "react-redux";
import _omit from "lodash/omit";
import {
  serializeDashboardState,
  useContentClient,
  DashboardContent,
  DashboardMetaData,
  DashboardState,
  useUser,
} from "@activeviam/activeui-sdk";

import { getDashboardsTree } from "../state/dashboardsTreeDuck";
import { useRefreshTree } from "./useRefreshTree";
import { useHistory } from "react-router-dom";
import { onDashboardUpdated } from "../state/dashboardDuck";

/**
 * React Hook returning a function allowing to "save as" the currently loaded dashboard.
 * The function redirects the user to the new dashboard, if it succeeded.
 */
export const useSaveDashboardAs = () => {
  const dashboardsTree = useSelector(getDashboardsTree);
  const { username } = useUser();
  const history = useHistory();
  const dispatch = useDispatch();
  const refreshDashboardsTree = useRefreshTree("dashboard");
  const contentClient = useContentClient();

  return async ({
    dashboard,
    name,
    pathToFolder,
  }: {
    dashboard: DashboardState | null;
    name?: string;
    pathToFolder: string[];
  }): Promise<string | undefined> => {
    if (dashboard && dashboardsTree) {
      const dryDashboard = serializeDashboardState(dashboard);
      try {
        const dashboardId = await contentClient.createFile<
          DashboardContent,
          DashboardMetaData
        >({
          content: _omit(dryDashboard, "name"),
          metaData: { name },
          owners: [username],
          pathToFolder,
          readers: [username],
          type: "dashboard",
        });
        await refreshDashboardsTree();
        history.push(`/dashboard/${dashboardId}`);
        dispatch(onDashboardUpdated(dashboard));
      } catch (err) {
        console.error(err);
      }
    }
    return;
  };
};
