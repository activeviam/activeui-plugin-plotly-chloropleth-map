import React, { FC, useMemo, useRef, useState } from "react";
import {
  getMeasures,
  stringify,
  useQueryResult,
  WidgetPluginProps,
} from "@activeviam/activeui-sdk";
// @ts-expect-error
import Plot from "react-plotly.js";
import { Slider } from "antd";

import { ChloroplethMapState } from "./chloropleth.types";

type ChloroplethMapProps = WidgetPluginProps<ChloroplethMapState>;

export const ChloroplethMap: FC<ChloroplethMapProps> = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(2019);
  const geoLayoutRef = useRef<Plotly.Layout["geo"] | undefined>({
    projection: {
      type: "robinson",
    },
  });
  const { mdx } = props.widgetState.query;

  const stringifiedQuery = useMemo(() => {
    return {
      ...props.widgetState.query,
      mdx: stringify(props.widgetState.query.mdx, { indent: true }),
    };
  }, [props.widgetState.query]);

  const { data, error, isLoading } = useQueryResult({
    serverKey: "my-server",
    queryId: props.queryId,
    query: stringifiedQuery,
  });

  const measureName = useMemo(() => getMeasures(mdx)[0].measureName, [mdx]);

  const layout: Partial<Plotly.Layout> = {
    margin: {
      l: 20,
      t: 30,
      r: 20,
      b: 20,
    },
    title: measureName,
    geo: geoLayoutRef.current,
  };

  const [years, countries, values] = useMemo(() => {
    if (!data) {
      return [[], [], []];
    }

    const columnsAxis = data.axes[0];
    const numberOfYears = columnsAxis.positions.length;

    const rowsAxis = data.axes[1];
    const numberOfCountries = rowsAxis.positions.length;

    const valuesForSelectedYear = new Array(numberOfCountries).fill(null);
    data.cells.forEach((cell) => {
      const rowIndex = Math.floor(cell.ordinal / numberOfYears);
      const columnIndex = cell.ordinal % numberOfYears;
      const year = columnsAxis.positions[columnIndex][0].captionPath[0];
      if (year === `${selectedYear}`) {
        valuesForSelectedYear[rowIndex] = cell.value;
      }
    });

    return [
      columnsAxis.positions.map((position) => position[0].captionPath[0]),
      rowsAxis.positions.map((position) => position[0].captionPath[2]),
      valuesForSelectedYear,
    ];
  }, [data, selectedYear]);

  const handleCountriesSelected = (payload: Plotly.PlotMouseEvent) => {
    if (!payload || !data || !props.onSelectionChange) {
      return;
    }

    const pointIndices = payload.points.map(({ pointIndex }) => pointIndex);
    setSelection(pointIndices);

    geoLayoutRef.current = layout.geo;

    props.onSelectionChange({
      headers: {
        ROWS: pointIndices.map((pointIndex) => [
          {
            dimensionName: "Countries",
            hierarchyName: "Country",
            ...data.axes[1].positions[pointIndex][0],
          },
        ]),
      },
    });
  };

  return (
    <div
      style={{
        ...props.style,
        height: "100%",
      }}
    >
      <div ref={container} style={{ height: "calc(100% - 70px)" }}>
        {isLoading ? (
          "Loading..."
        ) : error ? (
          error.stackTrace
        ) : (
          <Plot
            onSelected={handleCountriesSelected}
            data={[
              {
                type: "choropleth",
                locationmode: "country names",
                locations: countries,
                z: values,
                text: countries,
                autocolorscale: true,
                selectedpoints: selection.length > 0 ? selection : undefined,
              },
            ]}
            layout={{
              height: container.current?.clientHeight,
              width: container.current?.clientWidth,
              ...layout,
            }}
          />
        )}
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: 20 }}>Pick a year:</div>
        <Slider
          style={{ flex: 1 }}
          marks={years.reduce((acc, year) => ({ ...acc, [year]: year }), {})}
          min={1990}
          max={2019}
          value={selectedYear}
          onChange={(newYear: number) => {
            if (years.includes(`${newYear}`)) {
              setSelectedYear(newYear);
            }
          }}
        />
      </div>
    </div>
  );
};
