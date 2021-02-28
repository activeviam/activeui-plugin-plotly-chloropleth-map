/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, CSSProperties, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ContentNode,
  DashboardMetaData,
  MenuItemDeleteFile,
  MenuItemCreateFolder,
  MenuItemDeleteFolder,
  useTheme,
  Tree,
  TreeObject,
  TreeContextMenuProps,
  MenuItemDeleteFileProps,
  useUser,
} from "@activeviam/activeui-sdk";

import Menu from "antd/lib/menu";
import { getDashboardsTree } from "../../state/dashboardsTreeDuck";
import { getPathOfIds } from "./getPathOfIds";
import { useRefreshTree } from "../../hooks/useRefreshTree";

const ContextMenu = (props: TreeContextMenuProps) => {
  const { node, path, trees, ...menuProps } = props;
  const dashboardsTree = useSelector(getDashboardsTree);
  const { username, userRoles } = useUser();
  const refreshDashboardsTree = useRefreshTree("dashboard");

  if (dashboardsTree === null) {
    return null;
  }

  // Remove the root node on the left and the clicked node on the right
  const pathToParentFolder = getPathOfIds(trees, path).slice(1, -1);

  const menuItemProps: MenuItemDeleteFileProps & { path: number[] } = {
    node,
    path,
    contentTree: dashboardsTree,
    pathToParentFolder,
    type: "dashboard",
    onClicked: refreshDashboardsTree,
  };

  return (
    <Menu {...menuProps}>
      <MenuItemDeleteFile {...menuItemProps} />
      <MenuItemCreateFolder
        {...menuItemProps}
        availableRoles={userRoles}
        owners={[username]}
        readers={[username]}
        username={username}
      />
      <MenuItemDeleteFolder {...menuItemProps} />
    </Menu>
  );
};

const hoverStyle: CSSProperties = {};

interface DashboardsTreeProps {
  className?: string;
  dashboardFolders: TreeObject<ContentNode<DashboardMetaData>> | null;
  lineHeight: number;
  onClick: (node: ContentNode<DashboardMetaData>, path: number[]) => void;
  selectedPath?: number[] | null;
}

export const DashboardsTree: FC<DashboardsTreeProps> = (props) => {
  const theme = useTheme();

  const selectionStyle = useMemo(
    () => ({
      color: theme.primaryColor,
    }),
    [theme],
  );

  const value = useMemo(
    () => (props.dashboardFolders ? [props.dashboardFolders] : null),
    [props.dashboardFolders],
  );

  return value ? (
    <Tree<ContentNode<DashboardMetaData>>
      className={props.className}
      ContextMenu={ContextMenu}
      doesSelectionIncludeChildren={false}
      hoverStyle={hoverStyle}
      isSearchVisible={false}
      isSelectable={true}
      lineHeight={props.lineHeight}
      onClick={props.onClick}
      selectedPaths={props.selectedPath ? [props.selectedPath] : []}
      selectionStyle={selectionStyle}
      value={value}
    />
  ) : null;
};
