/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FC } from "react";
import { produce } from "immer";
import _set from "lodash/set";
import { useSelector, useDispatch } from "react-redux";
import {
  WidgetsRibbon,
  AWidgetState,
  useTheme,
  useIsPresenting,
} from "@activeviam/activeui-sdk";

import { getSelectedLeafKey } from "../state/selectedWidgetDuck";
import { getActivePageKey } from "../state/activePageDuck";
import { getDashboardState, onDashboardUpdated } from "../state/dashboardDuck";
import { DemoDashboard } from "./DemoDashboard";

/**
 * A dashboard based on the current URL.
 * With drawers on the left, allowing to edit it.
 * And a widgets ribbon on the top, allowing to add new widgets in or switch the currently selected widget.
 */
export const EditableDashboard: FC<{}> = () => {
  const theme = useTheme();
  const selectedLeafKey = useSelector(getSelectedLeafKey);
  const activePageKey = useSelector(getActivePageKey);
  const dashboard = useSelector(getDashboardState);
  const isPresenting = useIsPresenting();
  const dispatch = useDispatch();

  const selectedWidgetState =
    dashboard?.pages[activePageKey].content[selectedLeafKey!];

  const handleSelectedWidgetStateChanged = (
    newSelectedWidgetState: AWidgetState
  ) => {
    if (dashboard && selectedLeafKey) {
      const newDashboardState = produce(dashboard, (draft) => {
        _set(
          draft,
          ["pages", activePageKey, "content", selectedLeafKey],
          newSelectedWidgetState
        );
      });
      dispatch(onDashboardUpdated(newDashboardState));
    }
  };

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      {isPresenting ? null : (
        <WidgetsRibbon
          selectedWidgetState={selectedWidgetState}
          onSelectedWidgetStateChanged={handleSelectedWidgetStateChanged}
        />
      )}
      <div
        css={css`
          height: 100%;
          border-left: 1px solid;
          border-top: 1px solid;
          border-color: ${theme.grayScale[4]};
        `}
      >
        <DemoDashboard />
      </div>
    </div>
  );
};
