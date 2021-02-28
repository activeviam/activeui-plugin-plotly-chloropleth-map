/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, useCallback } from "react";
import { useSelector } from "react-redux";
import Menu from "antd/lib/menu";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { useIntl } from "react-intl";

import {
  ContentTree,
  MenuItemDeleteFile,
  MenuItemCreateFolder,
  ContentNode,
  MenuItemDeleteFolder,
  IconBusinessPuzzle,
  WidgetMetaData,
  TreeContextMenuProps,
  EditorProps,
  MenuItemDeleteFileProps,
  deserializeWidgetState,
  useContentClient,
  useUser,
} from "@activeviam/activeui-sdk";

import { getWidgetsTree } from "../../../state/widgetsTreeDuck";
import { serverKey } from "../../../serverUrls";
import { IconTooltip } from "./IconTooltip";
import { getPathOfIds } from "../../home/getPathOfIds";
import { useRefreshTree } from "../../../hooks/useRefreshTree";

export const WidgetsDrawerIcon: FC<AntdIconProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <IconTooltip title={`${formatMessage({ id: "widgets" })} (Alt + W)`}>
      <span>
        <IconBusinessPuzzle />
      </span>
    </IconTooltip>
  );
};

const ContextMenu = (
  props: TreeContextMenuProps & { node: ContentNode<WidgetMetaData> },
) => {
  const { node, path, trees, ...menuProps } = props;
  const widgetsTree = useSelector(getWidgetsTree);
  const { username, userRoles } = useUser();
  const refreshWidgetsTree = useRefreshTree("widget");

  if (widgetsTree === null) {
    return null;
  }

  // Remove the root node on the left and the clicked node on the right
  const pathToParentFolder = getPathOfIds(trees, path).slice(1, -1);

  const menuItemProps: MenuItemDeleteFileProps & { path: number[] } = {
    contentTree: widgetsTree,
    node,
    path,
    pathToParentFolder,
    type: "widget",
    onClicked: refreshWidgetsTree,
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

/**
 * Drawer allowing the user to drag previously saved widgets into the dashboard.
 */
const WidgetsDrawer: FC<EditorProps> = (props) => {
  const widgetsTree = useSelector(getWidgetsTree);
  const contentClient = useContentClient();

  const { formatMessage } = useIntl();

  const getDefaultCaption = useCallback(
    (node?: ContentNode<WidgetMetaData>) => {
      if (!node?.metaData) {
        return "";
      }

      return formatMessage({
        id: `aui.plugins.widget.${node.metaData.widgetKey}.defaultName`,
      });
    },
    [formatMessage],
  );

  const getWidgetDragItem = useCallback(
    (id: string, metaData: WidgetMetaData) =>
      !metaData.isFolder
        ? {
            type: "WIDGET",
            getState: async () => {
              // TODO add feedback, signaling to the user that the dropped widget is loading.
              const contentFile = await contentClient.fetchFile({
                id,
                type: "widget",
                withMetaData: false,
              });
              const widgetState = deserializeWidgetState({
                ...metaData,
                ...contentFile,
              });
              return widgetState;
            },
          }
        : undefined,
    [contentClient],
  );

  return widgetsTree ? (
    <ContentTree
      getDragItem={getWidgetDragItem}
      structure={widgetsTree}
      isSearchVisible={true}
      ContextMenu={ContextMenu}
      rootNodeCaption={serverKey}
      searchPlaceholder={formatMessage({ id: `aui.search.widget` })}
      getDefaultCaption={getDefaultCaption}
    />
  ) : null;
};

export default WidgetsDrawer;
