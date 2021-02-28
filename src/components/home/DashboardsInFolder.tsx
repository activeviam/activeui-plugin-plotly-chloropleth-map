/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FC, useMemo } from "react";
import Breadcrumb from "antd/lib/breadcrumb";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getDashboardsTree } from "../../state/dashboardsTreeDuck";
import {
  getMetaData,
  DashboardMetaData,
  ContentRecord,
  ContentNode,
  getNode,
  TreeObject,
  useUser,
} from "@activeviam/activeui-sdk";

import { FileCard } from "./FileCard";
import { getPathOfIds } from "./getPathOfIds";
import { getDurationAndTimeUnit } from "../../utils/getDurationAndTimeUnit";

const getFolder = (tree: ContentRecord<DashboardMetaData>, path: string[]) =>
  path.reduce<ContentRecord<DashboardMetaData>>(
    (acc, key) => acc.children?.[key]!,
    tree,
  );

interface DashboardsInFolderProps {
  dashboardFolders: TreeObject<ContentNode<DashboardMetaData>> | null;
  pathToFolder: number[];
  onPathChanged: (path: number[]) => void;
}

export const DashboardsInFolder: FC<DashboardsInFolderProps> = ({
  dashboardFolders,
  onPathChanged,
  pathToFolder,
}) => {
  const dashboards = useSelector(getDashboardsTree);
  const { formatMessage, formatRelativeTime } = useIntl();
  const { username } = useUser();

  const files = useMemo(() => {
    if (
      dashboards === null ||
      dashboardFolders === null ||
      pathToFolder === null
    ) {
      return null;
    }
    const pathOfIds = getPathOfIds([dashboardFolders], pathToFolder).slice(1);
    const folder = getFolder(dashboards, pathOfIds);
    const children = folder.children || {};
    const fileIds = Object.keys(children).filter(
      (id) => !id.endsWith("_metadata") && children[id].entry.canRead,
    );
    const defaultDashboardName = formatMessage({ id: "defaultDashboardName" });

    return fileIds
      .map((id, index) => ({
        id,
        index,
        file: children[id],
        metaData: getMetaData(children[id], id),
      }))
      .filter(({ metaData }) => !metaData.isFolder)
      .sort((a, b) =>
        (a.metaData.name || defaultDashboardName).toLowerCase() >
        (b.metaData.name || defaultDashboardName).toLowerCase()
          ? 1
          : -1,
      );
  }, [dashboards, dashboardFolders, pathToFolder, formatMessage]);

  if (!dashboards || !dashboardFolders) {
    return null;
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
      <Breadcrumb
        separator="/"
        style={{
          marginTop: 8,
          marginBottom: 16,
        }}
        css={{
          ".breadcrumb-item": {
            cursor: "pointer",
            fontSize: 16,
            lineHeight: `24px`,
            fontWeight: 600,
          },
        }}
      >
        {pathToFolder.map((childIndex, i) => {
          const path = pathToFolder.slice(0, i + 1);
          const node = getNode(
            {
              children: [dashboardFolders],
              id: "",
              type: "folder",
              metaData: {},
            },
            path,
          );
          return (
            <Breadcrumb.Item
              key={node.id}
              className="breadcrumb-item"
              onClick={() => onPathChanged(path)}
            >
              {node.caption}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <div
        css={css`
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          overflow: auto;
        `}
      >
        {files &&
          files.map(({ id, file, metaData }) => {
            // Remove the root node
            const pathToParentFolder = getPathOfIds(
              [dashboardFolders],
              pathToFolder,
            ).slice(1);
            const { duration, timeUnit } = getDurationAndTimeUnit(
              file.entry.timestamp,
            );

            return (
              <FileCard
                key={id}
                id={id}
                metaData={metaData}
                pathToParentFolder={pathToParentFolder}
                description={`${
                  file.entry.lastEditor === username
                    ? formatMessage({ id: "you" })
                    : file.entry.lastEditor
                } ${formatMessage({
                  id: "edited",
                })} ${
                  duration &&
                  formatRelativeTime(-duration, timeUnit, {
                    numeric: "auto",
                    style: "long",
                  })
                }`}
              />
            );
          })}
      </div>
    </div>
  );
};
