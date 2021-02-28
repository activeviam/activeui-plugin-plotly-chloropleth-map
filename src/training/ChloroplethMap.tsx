import React, { FC, useMemo } from "react";
import {
  stringify,
  useQueryResult,
  WidgetPluginProps,
} from "@activeviam/activeui-sdk";

import { ChloroplethMapState } from "./chloropleth.types";

type ChloroplethMapProps = WidgetPluginProps<ChloroplethMapState>;

export const ChloroplethMap: FC<ChloroplethMapProps> = (props) => {
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
    <div style={{ ...props.style, height: "100%", overflow: "auto" }}>
      {data.axes[1].positions.map((position, positionIndex) => {
        return (
          <div
            key={positionIndex}
            style={{
              width: 500,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{position[0].captionPath.join(" / ")}: </span>
            <span>{data.cells[positionIndex].formattedValue}</span>
          </div>
        );
      })}
    </div>
  );
};
