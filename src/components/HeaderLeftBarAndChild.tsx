/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Resizable, useIsPresenting, useTheme } from "@activeviam/activeui-sdk";

import LeftBar, { leftBarWidth } from "./leftBar/LeftBar";
import ActiveDrawer from "./leftBar/drawer/ActiveDrawer";
import { getActiveDrawer } from "../state/activeDrawerDuck";
import { usePersisted } from "../hooks/usePersisted";
import drawers from "./leftBar/drawer/drawers";
import Header from "./header/Header";
import { getPrefixedLocalStorageKey } from "../getPrefixedLocalStorageKey";

const minDrawerWidth = 100;

/**
 * Component that renders its child with the `Header` bar on top, and the drawers
 * bar on the left, which provide navigation and edition menus.
 */
export const HeaderLeftBarAndChild: FC<{}> = ({ children }) => {
  const theme = useTheme();
  const activeDrawer = useSelector(getActiveDrawer);
  const isPresenting = useIsPresenting();

  const typeOfActiveDrawer = activeDrawer
    ? drawers[activeDrawer].type
    : "single";
  const [drawerWidths, setDrawerWidths] = usePersisted<{
    [key: string]: number;
  }>(getPrefixedLocalStorageKey("drawer-widths"), {
    single: 240,
    double: 480,
  });

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <Header
        height={40}
        isMenuVisible={true}
        isProductNameVisible={false}
        isTitleVisible={true}
      />
      <div
        css={css`
          flex-grow: 1;
          display: flex;
          height: 100%;
        `}
      >
        {isPresenting ? null : <LeftBar />}
        <Resizable
          css={{
            width: isPresenting ? "100%" : `calc(100% - ${leftBarWidth}px)`,
          }}
          minSize={isPresenting || activeDrawer === null ? 0 : minDrawerWidth}
          size={
            isPresenting || activeDrawer === null
              ? 0
              : drawerWidths[typeOfActiveDrawer]
          }
          dragHandleStyle={{
            background: `${theme.grayScale[1]} padding-box`,
          }}
          onResizeEnd={(width: number) => {
            if (activeDrawer !== null) {
              setDrawerWidths({
                ...drawerWidths,
                [typeOfActiveDrawer]: width,
              });
            }
          }}
        >
          {isPresenting ? null : <ActiveDrawer />}
          {children}
        </Resizable>
      </div>
    </div>
  );
};
