import React, { FC, useMemo } from "react";
import { produce } from "immer";
import {
  Tree,
  ActionProps,
  useDataModel,
  getMeasures,
  Measure,
  removeAllMeasures,
  addMeasure,
} from "@activeviam/activeui-sdk";

import { ChloroplethMapState } from "./chloropleth.types";

export const ChloroplethContentEditor: FC<ActionProps<ChloroplethMapState>> = (
  props
) => {
  const dataModel = useDataModel("my-server");
  const { mdx } = props.widgetState.query;

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

  /**
   * Switches the target measure, when the user clicks it.
   */
  const handleMeasureClicked = (measure: Measure) => {
    if (!dataModel || !mdx) {
      return;
    }
    const cube = dataModel.catalogs[0].cubes[0];
    const mdxWithoutMeasure = removeAllMeasures(mdx, { cube });
    const mdxWithNewMeasure = addMeasure(mdxWithoutMeasure, {
      cube,
      measureName: measure.name,
    });
    const updatedWidgetState = produce(props.widgetState, (draft) => {
      draft.query.mdx = mdxWithNewMeasure;
    });
    props.onWidgetChange(updatedWidgetState);
  };

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <Tree
        onClick={handleMeasureClicked}
        isSearchVisible={true}
        searchPlaceholder="Search measures"
        value={measures}
      />
    </div>
  );
};
