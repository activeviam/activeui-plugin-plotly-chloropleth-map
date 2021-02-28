import { useDispatch } from "react-redux";
import { useContentClient } from "@activeviam/activeui-sdk";

import { onDashboardsTreeLoaded } from "../state/dashboardsTreeDuck";
import { onWidgetsTreeLoaded } from "../state/widgetsTreeDuck";

/**
 * React Hook returning a function allowing to refresh the dashboards or widgets tree
 */
export const useRefreshTree = (type: "dashboard" | "widget") => {
  const dispatch = useDispatch();
  const contentClient = useContentClient();

  return async () => {
    if(type === "dashboard") {
      const dashboardTree = await contentClient.fetchTree("dashboard");
      dispatch(onDashboardsTreeLoaded(dashboardTree));
    } else {
      const widgetTree = await contentClient.fetchTree("widget");
      dispatch(onWidgetsTreeLoaded(widgetTree));
    }
  };
};
