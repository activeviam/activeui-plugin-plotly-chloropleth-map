import {
  DashboardState,
  pluginWidgetPivotTable,
} from "@activeviam/activeui-sdk";

/**
 * Returns the state of the dashboard used initially when the user clicks "Create new dashboard"
 */
export const initialDashboardState: DashboardState = {
  pages: {
    "p-0": {
      name: "Page 1",
      content: {
        "1": pluginWidgetPivotTable.initialState,
      },
      layout: { children: [{ leafKey: "1", size: 1 }], direction: "row" },
      filters: [],
    },
  },
  pagesOrder: ["p-0"],
  filters: [],
};
