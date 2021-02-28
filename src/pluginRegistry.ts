import _keyBy from "lodash/keyBy";
import {
  createPluginRegistry,
  allCellsPreset,
  allCellStylesPreset,
  allWidgetsPreset,
  allEventListenersPreset,
  allMenuItemsPreset,
  allTitleBarButtonsPreset,
  TableWidgetPlugin,
  DrillthroughTableWidgetState,
} from "@activeviam/activeui-sdk";

import { pluginMenuItemSaveWidgetAs } from "./plugins/menu-items/pluginMenuItemSaveWidgetAs";
import { pluginChloroplethMap } from "./training/pluginChloroplethMap";

const widgetPlugins = allWidgetsPreset.widget;
widgetPlugins[pluginChloroplethMap.key] = pluginChloroplethMap;

const plotlyWidgetKeys = Object.keys(widgetPlugins).filter((key) =>
  key.startsWith("plotly")
);

plotlyWidgetKeys.forEach((key) => {
  const widgetPlugin = allWidgetsPreset.widget[key];
  widgetPlugin.menuItems = ["remove-widget", "duplicate-widget", "save-as"];
  widgetPlugin.titleBarButtons = ["full-screen", "toggle-query-mode"];
  widgetPlugin.eventListeners = [];
  widgetPlugin.contextMenuItems = [
    "filter-on-selection",
    "open-drillthrough",
    "sort-chart-ascendingly",
    "sort-chart-descendingly",
    "remove-sort",
    "copy-query",
    "refresh-query",
    "export-csv",
  ];
});

const pivotTablePlugin = widgetPlugins["pivot-table"] as TableWidgetPlugin;
pivotTablePlugin.cell = "pivot-table-cell";
pivotTablePlugin.cellStyle = "pivot-table-cell-style";
pivotTablePlugin.menuItems = ["remove-widget", "duplicate-widget", "save-as"];
pivotTablePlugin.titleBarButtons = ["full-screen", "toggle-query-mode"];
pivotTablePlugin.eventListeners = [];
pivotTablePlugin.contextMenuItems = [
  "filter-on-selection",
  "open-drillthrough",
  "sort-pivot-table-ascendingly",
  "sort-pivot-table-descendingly",
  "remove-sort",
  "copy-query",
  "refresh-query",
  "export-csv",
];

const drillthroughTablePlugin = widgetPlugins[
  "drillthrough-table"
] as TableWidgetPlugin<DrillthroughTableWidgetState>;
drillthroughTablePlugin.menuItems = [
  "remove-widget",
  "duplicate-widget",
  "save-as",
];
drillthroughTablePlugin.titleBarButtons = ["full-screen", "toggle-query-mode"];
drillthroughTablePlugin.eventListeners = [];
drillthroughTablePlugin.contextMenuItems = [
  "sort-drillthrough-table-descendingly",
  "sort-drillthrough-table-ascendingly",
];
drillthroughTablePlugin.cellStyle = "alternate-background-cell-style";

widgetPlugins["kpi"].menuItems = [
  "remove-widget",
  "duplicate-widget",
  "save-as",
];
widgetPlugins["kpi"].titleBarButtons = ["full-screen", "toggle-query-mode"];
widgetPlugins["kpi"].eventListeners = [];
widgetPlugins["kpi"].contextMenuItems = ["copy-query", "refresh-query"];

widgetPlugins["quick-filter"].menuItems = [
  "remove-widget",
  "quick-filter-switch-mode",
];
widgetPlugins["quick-filter"].titleBarButtons = [
  "full-screen",
  "toggle-query-mode",
];
widgetPlugins["quick-filter"].eventListeners = [];
widgetPlugins["quick-filter"].contextMenuItems = [];

export const pluginRegistry = createPluginRegistry({
  plugins: {
    "menu-item": _keyBy([pluginMenuItemSaveWidgetAs], "key"),
  },
  presets: [
    allCellsPreset,
    allCellStylesPreset,
    allEventListenersPreset,
    allMenuItemsPreset,
    allTitleBarButtonsPreset,
    allWidgetsPreset,
  ],
});
