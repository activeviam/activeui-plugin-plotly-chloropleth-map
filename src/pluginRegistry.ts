import _keyBy from "lodash/keyBy";
import {
  createPluginRegistry,
  allCellsPreset,
  allCellStylesPreset,
  pluginWidgetPivotTable,
  pluginWidgetPlotlyLineChart,
  pluginWidgetPlotlyScatterPlot,
  pluginWidgetKpi,
  allEventListenersPreset,
  allMenuItemsPreset,
  allTitleBarButtonsPreset,
  TableWidgetPlugin,
} from "@activeviam/activeui-sdk";

import { pluginMenuItemSaveWidgetAs } from "./plugins/menu-items/pluginMenuItemSaveWidgetAs";
import { pluginChloroplethMap } from "./training/pluginChloroplethMap";

const widgetPlugins = {
  [pluginWidgetPivotTable.key]: pluginWidgetPivotTable,
  [pluginWidgetPlotlyLineChart.key]: pluginWidgetPlotlyLineChart,
  [pluginWidgetPlotlyScatterPlot.key]: pluginWidgetPlotlyScatterPlot,
  [pluginWidgetKpi.key]: pluginWidgetKpi,
  [pluginChloroplethMap.key]: pluginChloroplethMap,
};

const plotlyWidgetKeys = Object.keys(widgetPlugins).filter((key) =>
  key.startsWith("plotly")
);

plotlyWidgetKeys.forEach((key) => {
  const widgetPlugin = widgetPlugins[key];
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
    {
      widget: widgetPlugins,
    },
  ],
});
