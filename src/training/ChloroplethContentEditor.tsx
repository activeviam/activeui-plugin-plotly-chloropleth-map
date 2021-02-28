import React, { FC, useMemo } from "react";
import {
  Tree,
  ActionProps,
  useDataModel,
  MdxSelect,
  parse,
  getMeasures,
} from "@activeviam/activeui-sdk";

import { ChloroplethMapState } from "./chloropleth.types";

export const ChloroplethContentEditor: FC<ActionProps<ChloroplethMapState>> = (
  props
) => {
  const dataModel = useDataModel("my-server");

  const mdx = useMemo(
    () =>
      props.widgetState.query
        ? parse<MdxSelect>(props.widgetState.query.mdx)
        : undefined,
    [props.widgetState.query]
  );

  const selectedMeasureName = useMemo(
    () => (mdx ? getMeasures(mdx)[0].measureName : undefined),
    [mdx]
  );

  const measures = useMemo(() => {
    if (!dataModel) {
      return [];
    }
    return dataModel.catalogs[0].cubes[0].measures.map((measure) => ({
      ...measure,
      isDisabled: measure.name === selectedMeasureName,
    }));
  }, [dataModel, selectedMeasureName]);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <Tree
        isSearchVisible={true}
        searchPlaceholder="Search measures"
        value={measures}
      />
    </div>
  );
};
