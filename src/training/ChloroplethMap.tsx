import React, { FC } from "react";
import { useQueryResult, WidgetPluginProps } from "@activeviam/activeui-sdk";

import { ChloroplethMapState } from "./chloropleth.types";

type ChloroplethMapProps = WidgetPluginProps<ChloroplethMapState>;

const mdx = `
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
`;

export const ChloroplethMap: FC<ChloroplethMapProps> = (props) => {
  const { data, error, isLoading } = useQueryResult({
    serverKey: "my-server",
    queryId: props.queryId,
    query: {
      mdx,
      updateMode: "once",
    },
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
