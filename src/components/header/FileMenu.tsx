/** @jsx jsx */
import Bowser from "bowser";
import Menu from "antd/lib/menu";

import { css, jsx } from "@emotion/core";
import { FC, useMemo, useState, Fragment } from "react";
import { CloudDownloadOutlined, SaveOutlined } from "@ant-design/icons";
import { IconSaveAs } from "@activeviam/activeui-sdk";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { getDashboardState } from "../../state/dashboardDuck";
import { State } from "../../state/store";
import { SaveAsPopup } from "./SaveAsPopup";
import { getDashboardsTree } from "../../state/dashboardsTreeDuck";
import { useSaveDashboard } from "../../hooks/useSaveDashboard";
import { useSaveDashboardAs } from "../../hooks/useSaveDashboardAs";
import Modal from "antd/lib/modal";

const { SubMenu, Item } = Menu;

interface FileMenuProps {}

const browser = Bowser.parse(window.navigator.userAgent);

export const FileMenu: FC<FileMenuProps> = (props) => {
  const dashboardsTree = useSelector(getDashboardsTree);
  const saveDashboard = useSaveDashboard();
  const saveDashboardAs = useSaveDashboardAs();
  const { formatMessage } = useIntl();

  const history = useHistory();
  const id = useMemo(() => {
    if (!history.location.pathname.startsWith("/dashboard/")) {
      return null;
    }
    return history.location.pathname.slice(11);
  }, [history.location]);

  const dashboard = useSelector(getDashboardState);
  const didUserMakeChanges = useSelector(
    (state: State) => state.dashboard.past.length > 0,
  );

  const [name, setName] = useState<string | undefined>("");
  const [pathToFolder, setPathToFolder] = useState<string[]>([]);

  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  const handleSaveAs = async () => {
    setIsPopupVisible(false);
    await saveDashboardAs({ dashboard, name, pathToFolder });
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
  };

  const handleClickedOnExportToPDF = () => {
    history.push(`${history.location.pathname}/export`);
  };

  return (
    <Fragment>
      <Modal
        visible={isPopupVisible}
        title={formatMessage({ id: "saveDashboardAs" })}
        onOk={handleSaveAs}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: !Boolean(name),
        }}
        okText={formatMessage({ id: "ok" })}
        cancelText={formatMessage({ id: "cancel" })}
      >
        <SaveAsPopup
          contentTree={dashboardsTree}
          value={{ name, pathToFolder }}
          onChange={({ name, pathToFolder }) => {
            setName(name);
            setPathToFolder(pathToFolder);
          }}
        />
      </Modal>
      <SubMenu title={formatMessage({ id: "file" })} {...props}>
        <Item
          disabled={!id || !didUserMakeChanges}
          onClick={() => {
            saveDashboard();
          }}
        >
          <SaveOutlined />
          {formatMessage(
            { id: "save" },
            { key: browser.os.name === "macOS" ? "Cmd" : "Ctrl" },
          )}
        </Item>
        <Item
          onClick={() => {
            setIsPopupVisible(true);
          }}
        >
          <IconSaveAs
            css={css`
              margin-right: 8px;
            `}
          />
          {formatMessage({ id: "saveAs" })}
        </Item>
        <Item onClick={handleClickedOnExportToPDF}>
          <CloudDownloadOutlined />
          {formatMessage({ id: "exportToPDF" })}
        </Item>
      </SubMenu>
    </Fragment>
  );
};
