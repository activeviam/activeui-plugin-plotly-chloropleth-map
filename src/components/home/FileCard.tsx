/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FC } from "react";
import Card from "antd/lib/card";
import Menu from "antd/lib/menu";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FileImageOutlined } from "@ant-design/icons";
import {
  DashboardMetaData,
  useTheme,
  MenuItemDeleteFile,
  MenuItemDeleteFileProps,
  ContentNode,
} from "@activeviam/activeui-sdk";
import { useIntl } from "react-intl";

import Dropdown from "antd/lib/dropdown";
import { MenuProps } from "antd/lib/menu";
import { getDashboardsTree } from "../../state/dashboardsTreeDuck";
import { useRefreshTree } from "../../hooks/useRefreshTree";

const ContextMenu = (
  props: MenuProps & {
    node: ContentNode<DashboardMetaData>;
    pathToParentFolder: string[];
  },
) => {
  const { node, pathToParentFolder, ...menuProps } = props;
  const dashboardsTree = useSelector(getDashboardsTree);
  const refreshDashboardsTree = useRefreshTree("dashboard");

  if (dashboardsTree === null) {
    return null;
  }

  const menuItemProps: MenuItemDeleteFileProps = {
    contentTree: dashboardsTree,
    node,
    pathToParentFolder,
    type: "dashboard",
  };

  return (
    <div
      onClick={(event) => {
        // Avoids navigating to the underlying dashboard when the user clicks one of its menu items.
        event.stopPropagation();
      }}
    >
      <Menu {...menuProps}>
        <MenuItemDeleteFile
          {...menuItemProps}
          onClicked={refreshDashboardsTree}
        />
      </Menu>
    </div>
  );
};

interface FileCardProps {
  id: string;
  metaData: DashboardMetaData;
  pathToParentFolder: string[];
  description: string;
}

export const FileCard: FC<FileCardProps> = (props) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { pathToParentFolder, metaData } = props;

  const node: ContentNode<DashboardMetaData> = {
    caption: metaData.name || formatMessage({ id: "defaultDashboardName" }),
    id: props.id,
    type: "file",
    metaData,
  };

  return (
    <Link to={`dashboard/${props.id}`}>
      <Dropdown
        trigger={["contextMenu"]}
        overlay={
          <ContextMenu node={node} pathToParentFolder={pathToParentFolder} />
        }
        css={{
          ".ant-card-meta-detail > div:not(:last-child)": {
            fontSize: 14,
            marginBottom: 4,
          },
        }}
      >
        <Card
          key={props.id}
          hoverable
          style={{
            height: 220,
            width: 240,
            margin: "0 16px 16px 0",
          }}
          bodyStyle={{ padding: 12 }}
          cover={
            <div
              css={css`
                height: 150px;
                background: ${theme.grayScale[4]};
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  align-items: center;
                  justify-content: center;
                  font-size: 48px;
                  opacity: 0.05;
                `}
              >
                <FileImageOutlined />
              </div>
            </div>
          }
        >
          <Card.Meta
            title={<span title={node.caption}>{node.caption}</span>}
            description={props.description}
          />
        </Card>
      </Dropdown>
    </Link>
  );
};
