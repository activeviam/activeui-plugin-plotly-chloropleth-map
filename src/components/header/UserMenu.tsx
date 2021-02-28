/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC } from "react";
import Menu from "antd/lib/menu";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";

import { useUser } from "@activeviam/activeui-sdk";
import { useIntl } from "react-intl";
import { getPrefixedLocalStorageKey } from "../../getPrefixedLocalStorageKey";
import Modal from "antd/lib/modal";
import { getOverlayRoot } from "../../getOverlayRoot";

const { Item, SubMenu } = Menu;
const { confirm } = Modal;

interface UserMenuProps {}

export const UserMenu: FC<UserMenuProps> = (props) => {
  const { username } = useUser();
  const { formatMessage } = useIntl();

  return (
    <SubMenu
      title={
        <span>
          <UserOutlined />
          {username}
        </span>
      }
      {...props}
    >
      <Item
        onClick={() => {
          confirm({
            title: `Logout ${username}`,
            content: `Logging out ‘${username}’ will lose any unsaved work.`,
            onOk() {
              localStorage.removeItem(getPrefixedLocalStorageKey("token"));
              window.location.reload();
            },
            getContainer: getOverlayRoot,
          });
        }}
      >
        <LogoutOutlined style={{ marginRight: "8px" }} />
        {formatMessage({ id: "logout" })}
      </Item>
    </SubMenu>
  );
};
