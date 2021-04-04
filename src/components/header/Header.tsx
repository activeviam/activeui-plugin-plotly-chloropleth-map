/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FC, CSSProperties, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePrevious } from "react-use";
import { MenuProps } from "antd/lib/menu";
import { useIsPresenting } from "@activeviam/activeui-sdk";

import Menu from "antd/lib/menu";

import Logo from "./Logo";
import { EditMenu } from "./EditMenu";
import { HelpMenu } from "./HelpMenu";
import { getDashboardState } from "../../state/dashboardDuck";
import ToggleIsPresenting from "./ToggleIsPresenting";
import { onIsPresentingChanged } from "../../state/isPresentingDuck";
import { useIntl } from "react-intl";

const menuStyle: CSSProperties = {
  backgroundColor: "#001529 !important",
  marginTop: 0,
  borderBottom: "none !important",
  color: "rgba(255, 255, 255, 0.65) !important",
};

const HeaderMenu: FC<MenuProps> = (props) => (
  <Menu
    // Missing prop in Ant Design types
    triggerSubMenuAction="click"
    mode="horizontal"
    selectable={false}
    css={{
      ...menuStyle,
    }}
    {...props}
  />
);

interface HeaderProps {
  height: number;
  isMenuVisible: boolean;
  isProductNameVisible: boolean;
  isTitleVisible: boolean;
  onPathChanged?: (path: string[]) => void;
}

const Header: FC<HeaderProps> = (props) => {
  const { formatMessage } = useIntl();

  const dashboard = useSelector(getDashboardState);
  const isPresenting = useIsPresenting();

  const defaultDashboardName = formatMessage({ id: "defaultDashboardName" });
  const [title, setTitle] = useState<string>();

  const dashboardName = dashboard?.name || defaultDashboardName;
  const previousDashboardName = usePrevious(
    title === undefined ? "" : dashboardName
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // When loading a dashboard, use its name as title
    if (
      dashboard &&
      dashboardName !== previousDashboardName &&
      dashboardName !== title
    ) {
      setTitle(dashboardName);
    }
  }, [dashboard, dashboardName, previousDashboardName, title]);

  const handleIsPresentingToggled = () => {
    dispatch(onIsPresentingChanged(!isPresenting));
  };

  return (
    <div
      css={css`
        background: #00152a;
        color: #d9dcdf;
        height: ${props.height}px;
        display: flex;
        align-items: center;
        /* adds up to 16px with the 12px padding of the help menu */
        padding-right: 4px;
      `}
    >
      <Logo isProductNameVisible={props.isProductNameVisible} />
      <h1
        style={{
          color: "#fff",
          fontSize: "1.5em",
          marginBottom: 0,
          marginRight: 50,
        }}
      >
        When you are done with the ActiveUI tutorial, you will have this.
      </h1>
      {props.isMenuVisible && (
        <HeaderMenu
          css={{
            marginLeft: "0px !important",
          }}
        >
          <EditMenu />
          <HelpMenu />
        </HeaderMenu>
      )}
      <HeaderMenu
        css={{
          marginLeft: "auto !important",
        }}
      >
        {dashboard ? (
          <Menu.Item
            title={formatMessage({ id: isPresenting ? "edit" : "present" })}
          >
            <ToggleIsPresenting
              isActive={isPresenting}
              onClick={handleIsPresentingToggled}
            />
          </Menu.Item>
        ) : null}
      </HeaderMenu>
    </div>
  );
};

export default Header;
