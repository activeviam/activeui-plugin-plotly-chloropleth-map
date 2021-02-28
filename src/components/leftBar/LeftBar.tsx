/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, useEffect } from "react";
import Menu from "antd/lib/menu";
import { useDispatch, useSelector } from "react-redux";

import drawers, { DrawerKey } from "./drawer/drawers";
import {
  getActiveDrawer,
  onActiveDrawerChanged,
} from "../../state/activeDrawerDuck";

const { Item } = Menu;

export const leftBarWidth = 32; // px

const shortcuts: { [key in number | string]: DrawerKey } = {
  w: "widgets",
  f: "filters",
  c: "contentEditor",
  y: "styleEditor",
  q: "queryEditor",
};

const LeftBar: FC = () => {
  const activeDrawer = useSelector(getActiveDrawer);
  const dispatch = useDispatch();

  const handleClick = ({ key }: { key: string | number }) => {
    // The Ant Design menu only calls back keys of its underlying menu items, which are all of type DrawerKey here.
    // eslint-disable-next-line
    const drawerKey = key as DrawerKey;
    if (key === activeDrawer) {
      // hides the drawer
      dispatch(onActiveDrawerChanged(null));
    } else {
      dispatch(onActiveDrawerChanged(drawerKey));
    }
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const targetDrawer = shortcuts[event.key];
      if (event.altKey && targetDrawer && targetDrawer !== activeDrawer) {
        dispatch(onActiveDrawerChanged(targetDrawer));
      }
    };

    document.body.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.removeEventListener("keydown", handleKeydown);
    };
  });

  return (
    <Menu
      style={{
        height: "100%",
        width: leftBarWidth,
        backgroundColor: "#00152A",
        borderRight: "none",
        color: "rgba(255, 255, 255, 0.65)",
      }}
      selectedKeys={activeDrawer ? [activeDrawer] : []}
      onClick={handleClick}
    >
      {Object.entries(drawers).map(([key, drawer]) => (
        <Item key={key}>
          <drawer.icon />
        </Item>
      ))}
    </Menu>
  );
};

export default LeftBar;
