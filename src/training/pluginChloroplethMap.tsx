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
    query: {
      mdx: `
        SELECT
          NON EMPTY {
            [Measures].[Real GDP per capita (USD).MEAN]
          } ON COLUMNS,
          NON EMPTY Hierarchize(
            Descendants(
              {
                [Countries].[Country].[AllMember]
              },
              2,
              SELF_AND_BEFORE
            )
          ) ON ROWS
          FROM [Green-growth]
      `,
    },
  },
  key: widgetKey,
  translations: {
    "en-US": {
      key: "Chloropleth map",
      defaultName: "New chloropleth map",
    },
  },
};
