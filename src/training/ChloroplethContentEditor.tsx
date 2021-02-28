import React, { FC } from "react";
import { Tree, ActionProps, useDataModel } from "@activeviam/activeui-sdk";

import { ChloroplethMapState } from "./chloropleth.types";

export const ChloroplethContentEditor: FC<ActionProps<ChloroplethMapState>> = (
  props
) => {
  const dataModel = useDataModel("my-server");

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <Tree
        isSearchVisible={true}
        searchPlaceholder="Search measures"
        value={dataModel?.catalogs?.[0]?.cubes?.[0]?.measures ?? []}
      />
    </div>
  );
};
