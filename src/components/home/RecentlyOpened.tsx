/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import _map from "lodash/map";
import { FC, useMemo } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import {
  getMetaData,
  findContentRecords,
  DashboardMetaData,
  AccessLog,
} from "@activeviam/activeui-sdk";

import { getDashboardsTree } from "../../state/dashboardsTreeDuck";
import { getAccessLogs } from "../../state/accessLogsDuck";
import { FileCard } from "./FileCard";
import { getDurationAndTimeUnit } from "../../utils/getDurationAndTimeUnit";

/**
 * Component showing the list of recently opened dashboards.
 */
export const RecentlyOpened: FC<{}> = () => {
  const accessLogs = useSelector(getAccessLogs);
  const dashboardsTree = useSelector(getDashboardsTree);
  const { formatMessage, formatRelativeTime } = useIntl();

  const recentlyOpenedDashboardsMetaData = useMemo(() => {
    const metaData: (DashboardMetaData &
      AccessLog & {
        pathToParentFolder: string[];
      })[] = [];

    if (dashboardsTree === null || accessLogs === null) {
      return metaData;
    }

    const dashboardContentRecords = findContentRecords<DashboardMetaData>(
      dashboardsTree,
      _map(accessLogs, "id"),
    );

    accessLogs.forEach(({ id, lastOpened }) => {
      const dashboardContentRecord = dashboardContentRecords[id];
      if (dashboardContentRecord) {
        const { node, pathToParentFolder } = dashboardContentRecord;
        // Only show dashboards that are still accessible to the current user
        if (node.entry.canRead) {
          metaData.push({
            id,
            lastOpened,
            pathToParentFolder,
            ...getMetaData(node, id),
          });
        }
      }
    });

    return metaData;
  }, [dashboardsTree, accessLogs]);

  if (accessLogs === null) {
    return null;
  }

  if (recentlyOpenedDashboardsMetaData.length === 0) {
    return (
      <div
        css={css`
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          color: #9d9d9d;
        `}
      >
        <div>{formatMessage({ id: "welcome" })}</div>
        <div>{formatMessage({ id: "recentlyOpenedPlaceholder" })}</div>
      </div>
    );
  }

  return (
    <div
      css={css`
        height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={{
          fontSize: 16,
          lineHeight: `24px`,
          fontWeight: 600,
          marginTop: 8,
          marginBottom: 16,
          color: "#262626",
        }}
      >
        {formatMessage({ id: "recentlyOpened" })}
      </div>
      <div
        css={css`
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          overflow: auto;
        `}
      >
        {recentlyOpenedDashboardsMetaData.map(
          ({ id, lastOpened, pathToParentFolder, ...metaData }) => {
            const { duration, timeUnit } = getDurationAndTimeUnit(lastOpened);
            return (
              <FileCard
                key={id}
                id={id}
                metaData={metaData}
                description={`${formatMessage({
                  id: "opened",
                })} ${
                  duration &&
                  formatRelativeTime(-duration, timeUnit, {
                    numeric: "auto",
                    style: "long",
                  })
                }`}
                pathToParentFolder={pathToParentFolder}
              />
            );
          },
        )}
      </div>
    </div>
  );
};
