/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FC, CSSProperties, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { usePrevious } from "react-use";
import { MenuProps } from "antd/lib/menu";
import {
  TitleInput,
  useTheme,
  useIsPresenting,
} from "@activeviam/activeui-sdk";

import Menu from "antd/lib/menu";

import Logo from "./Logo";
import { FileMenu } from "./FileMenu";
import { EditMenu } from "./EditMenu";
import { HelpMenu } from "./HelpMenu";
import { UserMenu } from "./UserMenu";
import {
  getDashboardState,
  onDashboardUpdated,
} from "../../state/dashboardDuck";
import { useSaveDashboard } from "../../hooks/useSaveDashboard";
import { HomeSearch } from "./HomeSearch";
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
  isSearchVisible: boolean;
  isTitleVisible: boolean;
  onPathChanged?: (path: string[]) => void;
}

const Header: FC<HeaderProps> = (props) => {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const dashboard = useSelector(getDashboardState);
  const isPresenting = useIsPresenting();

  const defaultDashboardName = formatMessage({ id: "defaultDashboardName" });
  const [title, setTitle] = useState<string>();

  const dashboardName = dashboard?.name || defaultDashboardName;
  const previousDashboardName = usePrevious(
    title === undefined ? "" : dashboardName,
  );

  const saveDashboard = useSaveDashboard();
  const dispatch = useDispatch();

  const theme = useTheme();

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

  const goHome = () => {
    history.push("/");
  };

  const isPlaceholder = title === defaultDashboardName;
  const handleTitleBlurred = () => {
    // do not save a title that is the default name
    if (isPlaceholder) {
      return;
    }

    if (dashboard && title !== dashboardName) {
      if (title) {
        const newDashboard = {
          ...dashboard,
          name: title,
        };
        dispatch(onDashboardUpdated(newDashboard));
        saveDashboard(newDashboard);
      } else {
        setTitle(dashboardName);
      }
    }
  };

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
      <Logo
        onClick={goHome}
        isProductNameVisible={props.isProductNameVisible}
      />
      {props.isTitleVisible && (
        <TitleInput
          css={{
            display: "flex",
            alignItems: "center",
            width: 440,
          }}
          inputCss={{
            background: "transparent",
            boxShadow: "none",
            height: 24,
            marginTop: 8,
            marginBottom: 8,
            width: 440,
            fontSize: 16,
            fontWeight: 400,
            color: isPlaceholder ? theme.grayScale[7] : theme.white,
            ":hover": {
              borderColor: theme.grayScale[9],
            },
            ":focus": {
              borderColor: theme.white,
              color: theme.white,
            },
          }}
          tooltipValue={formatMessage({ id: "aui.rename" })}
          value={title || ""}
          onChange={setTitle}
          onBlur={handleTitleBlurred}
          isPlaceholder={isPlaceholder}
        />
      )}
      {props.isMenuVisible && (
        <HeaderMenu
          css={{
            marginLeft: "0px !important",
          }}
        >
          <FileMenu />
          <EditMenu />
          <HelpMenu />
        </HeaderMenu>
      )}
      {props.isSearchVisible && (
        <HomeSearch onPathChanged={props.onPathChanged} />
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
        <UserMenu />
      </HeaderMenu>
    </div>
  );
};

export default Header;
