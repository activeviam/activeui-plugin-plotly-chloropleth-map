import { WidgetPlugin } from "@activeviam/activeui-sdk";

import { ChloroplethMapState } from "./chloropleth.types";
import { ChloroplethMap } from "./ChloroplethMap";
import { IconWorld } from "./IconWorld";

const widgetKey = "chloropleth-map";

export const pluginChloroplethMap: WidgetPlugin<ChloroplethMapState> = {
  Component: ChloroplethMap,
  Icon: IconWorld,
  initialState: {
    widgetKey,
  },
  key: widgetKey,
  translations: {
    "en-US": {
      key: "Chloropleth map",
    },
  },
};
