import React, { FC, useMemo, useRef } from "react";
import {
  getMeasures,
  stringify,
  useQueryResult,
  WidgetPluginProps,
} from "@activeviam/activeui-sdk";
// @ts-expect-error
import Plot from "react-plotly.js";
import useComponentSize from "@rehooks/component-size";

import { ChloroplethMapState } from "./chloropleth.types";

type ChloroplethMapProps = WidgetPluginProps<ChloroplethMapState>;

export const ChloroplethMap: FC<ChloroplethMapProps> = (props) => {
  const container = useRef<HTMLDivElement>(null);
  const { mdx } = props.widgetState.query;

  const { width, height } = useComponentSize(container);

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

  const [countries, values] = useMemo(() => {
    if (!data) {
      return [[], []];
    }

    return [
      data.axes[1].positions.map((position) => position[0].captionPath[2]),
      data.cells.map((cell) => cell.value),
    ];
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>Error</h3>
        <p>{error.stackTrace}</p>
      </div>
    );
  }

  if (!data) {
    return <div>No data.</div>;
  }

  return (
    <div ref={container} style={{ ...props.style, height: "100%" }}>
      <Plot
        data={[
          {
            type: "choropleth",
            locationmode: "country names",
            locations: countries,
            z: values,
            text: countries,
            autocolorscale: true,
          },
        ]}
        layout={{
          height,
          width,
          margin: {
            l: 20,
            t: 30,
            r: 20,
            b: 20,
          },
          title: measureName,
          geo: {
            projection: {
              type: "robinson",
            },
          },
        }}
      />
    </div>
  );
};
