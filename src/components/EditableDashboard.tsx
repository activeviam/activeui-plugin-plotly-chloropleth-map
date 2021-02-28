/** @jsx jsx */
import Bowser from "bowser";
import { jsx, css } from "@emotion/core";
import { FC, useEffect } from "react";
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
import { useParams } from "react-router-dom";
import { DashboardBasedOnId } from "./DashboardBasedOnId";
import { useSaveDashboard } from "../hooks/useSaveDashboard";

const browser = Bowser.parse(window.navigator.userAgent);

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
  const { id } = useParams<{ id: string }>();
  const saveDashboard = useSaveDashboard();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event[browser.os.name === "macOS" ? "metaKey" : "ctrlKey"] &&
        event.key === "s"
      ) {
        // The default behavior of the browser on a "Ctrl + S" event needs to be overridden.
        event.preventDefault();
        saveDashboard();
      }
    };
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  });

  const selectedWidgetState =
    dashboard?.pages[activePageKey].content[selectedLeafKey!];

  const handleSelectedWidgetStateChanged = (
    newSelectedWidgetState: AWidgetState,
  ) => {
    if (dashboard && selectedLeafKey) {
      const newDashboardState = produce(dashboard, (draft) => {
        _set(
          draft,
          ["pages", activePageKey, "content", selectedLeafKey],
          newSelectedWidgetState,
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
        <DashboardBasedOnId id={id} />
      </div>
    </div>
  );
};
