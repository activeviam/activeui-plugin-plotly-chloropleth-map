/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, useState, MouseEvent } from "react";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import _omit from "lodash/omit";
import Menu from "antd/lib/menu";
import { MenuItemProps as AntMenuItemProps } from "antd/lib/menu/MenuItem";
import { SaveOutlined } from "@ant-design/icons";
import {
  MenuItemPlugin,
  MenuItemProps,
  getAntMenuItemProps,
  AWidgetState,
  useContentClient,
  WidgetContent,
  WidgetMetaData,
  serializeWidgetState,
  useUser,
} from "@activeviam/activeui-sdk";
import Modal from "antd/lib/modal";
import { SaveAsPopup } from "../../components/header/SaveAsPopup";
import { getWidgetsTree } from "../../state/widgetsTreeDuck";
import { useRefreshTree } from "../../hooks/useRefreshTree";

interface SaveWidgetAsPopupProps {
  isVisible: boolean;
  onClose: (event: MouseEvent) => void;
  widgetState: AWidgetState;
}

const SaveWidgetAsPopup: FC<SaveWidgetAsPopupProps> = (props) => {
  const { username } = useUser();
  const widgetsTree = useSelector(getWidgetsTree);
  const { formatMessage } = useIntl();
  const contentClient = useContentClient();
  const refreshWidgetsTree = useRefreshTree("widget");

  const [name, setName] = useState<string | undefined>(props.widgetState.name);
  const [pathToFolder, setPathToFolder] = useState<string[]>([]);

  const handleSubmit = async (event: MouseEvent) => {
    if (name && props.widgetState) {
      const serializedWidgetState = serializeWidgetState(props.widgetState);

      try {
        await contentClient.createFile<WidgetContent, WidgetMetaData>({
          content: {
            ..._omit(serializedWidgetState, ["name", "widgetKey"]),
          },
          metaData: {
            name,
            widgetKey: props.widgetState.widgetKey,
          },
          owners: [username],
          pathToFolder,
          readers: [username],
          type: "widget",
        });

        refreshWidgetsTree();
      } catch (err) {
        console.error(err);
      }
    }
    props.onClose(event);
  };

  return (
    <Modal
      visible={props.isVisible}
      title={formatMessage({
        id: "aui.plugins.menu-item.save-as.saveWidgetAs",
      })}
      onOk={handleSubmit}
      onCancel={props.onClose}
      okButtonProps={{
        disabled: !Boolean(name),
      }}
      okText={formatMessage({ id: "ok" })}
      cancelText={formatMessage({ id: "cancel" })}
    >
      <SaveAsPopup
        contentTree={widgetsTree}
        value={{ name, pathToFolder }}
        onChange={({ name, pathToFolder }) => {
          setName(name);
          setPathToFolder(pathToFolder);
        }}
      />
    </Modal>
  );
};

const SaveAsMenuItem: FC<MenuItemProps> = (props) => {
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  const { formatMessage } = useIntl();

  const handleClick: AntMenuItemProps["onClick"] = (clickParam) => {
    if (props.onClick) {
      props.onClick(clickParam);
    }
    setIsPopupVisible(true);
  };

  return (
    <Menu.Item {...getAntMenuItemProps(props)} onClick={handleClick}>
      <SaveOutlined />
      <SaveWidgetAsPopup
        widgetState={props.widgetState}
        isVisible={isPopupVisible}
        onClose={(event) => {
          // Stop the propagation so that the click does not bubble up to the menu item and reopen the popup.
          event.stopPropagation();
          setIsPopupVisible(false);
        }}
      />
      {formatMessage({ id: "saveAs" })}
    </Menu.Item>
  );
};

export const pluginMenuItemSaveWidgetAs: MenuItemPlugin = {
  key: "save-as",
  Component: SaveAsMenuItem,
  translations: {
    "en-US": {
      saveWidgetAs: "Save widget as…",
    },
    "fr-FR": {
      saveWidgetAs: "Enregistrer le widget sous…",
    },
  },
};
