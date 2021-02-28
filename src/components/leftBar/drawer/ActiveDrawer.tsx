/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getActiveDrawer } from "../../../state/activeDrawerDuck";

import drawers from "./drawers";
import {
  AWidgetState,
  DashboardState,
  getLayoutPath,
  getPage,
  updateWidget,
  useTheme,
  useSwitchedWidgetState,
} from "@activeviam/activeui-sdk";
import { getSelectedLeafKey } from "../../../state/selectedWidgetDuck";
import { getActivePageKey } from "../../../state/activePageDuck";
import {
  getDashboardState,
  onDashboardUpdated,
} from "../../../state/dashboardDuck";
import { DrawerPlaceholder } from "./DrawerPlaceholder";

interface ActiveDrawerProps {}

const ActiveDrawer: FC<ActiveDrawerProps> = () => {
  const activeDrawer = useSelector(getActiveDrawer);
  const theme = useTheme();
  const selectedLeafKey = useSelector(getSelectedLeafKey);
  const activePageKey = useSelector(getActivePageKey);
  const dashboardState = useSelector(getDashboardState);
  const dispatch = useDispatch();

  const pageState = getPage(dashboardState, activePageKey);

  const selectedWidgetState: AWidgetState =
    dashboardState?.pages[activePageKey].content[selectedLeafKey!];
  const switchedWidgetState = useSwitchedWidgetState(selectedWidgetState);

  const handleSelectedWidgetStateChanged = useCallback(
    (newWidgetState: AWidgetState) => {
      if (dashboardState && activePageKey && selectedLeafKey) {
        const newDashboard = updateWidget(
          dashboardState,
          activePageKey,
          selectedLeafKey,
          () => newWidgetState,
        );
        dispatch(onDashboardUpdated(newDashboard));
      }
    },
    [dashboardState, activePageKey, selectedLeafKey, dispatch],
  );

  const handleDashboardChanged = useCallback(
    (newDashboardState: DashboardState) => {
      dispatch(onDashboardUpdated(newDashboardState));
    },
    [dispatch],
  );

  const layout = pageState?.layout;
  const layoutPath = useMemo(
    () =>
      layout && selectedLeafKey
        ? getLayoutPath(layout, selectedLeafKey)
        : undefined,
    [layout, selectedLeafKey],
  );

  const DrawerComponent = drawers[activeDrawer].component;

  if (!selectedWidgetState || !dashboardState) {
    return <DrawerPlaceholder />;
  }

  return (
    <div
      key={activeDrawer}
      style={{
        height: "100%",
        background: theme.grayScale[1],
        padding: 8,
      }}
    >
      <DrawerComponent
        widgetState={switchedWidgetState}
        onWidgetChange={handleSelectedWidgetStateChanged}
        dashboardState={dashboardState}
        onDashboardChange={handleDashboardChanged}
        pageKey={activePageKey}
        leafKey={selectedLeafKey}
        layoutPath={layoutPath}
        queryId={`${activePageKey}/${selectedLeafKey}`}
      />
    </div>
  );
};

export default ActiveDrawer;
