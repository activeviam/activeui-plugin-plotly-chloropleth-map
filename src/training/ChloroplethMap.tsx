import React, { FC } from "react";
import { WidgetPluginProps } from "@activeviam/activeui-sdk";

import { ChloroplethMapState } from "./chloropleth.types";

type ChloroplethMapProps = WidgetPluginProps<ChloroplethMapState>;

export const ChloroplethMap: FC<ChloroplethMapProps> = (props) => {
  return <div style={props.style}>Hello world!</div>;
};
