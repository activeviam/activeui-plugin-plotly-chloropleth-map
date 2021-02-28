/** @jsx jsx */
import Bowser from "bowser";
import Menu from "antd/lib/menu";

import { jsx } from "@emotion/core";
import { FC } from "react";
import {
  RedoOutlined,
  RollbackOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { ActionCreators } from "redux-undo";
import { State } from "../../state/store";

const { SubMenu, Item } = Menu;

const browser = Bowser.parse(window.navigator.userAgent);

interface EditMenuProps {}

export const EditMenu: FC<EditMenuProps> = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const numberOfUndoableStates = useSelector(
    (state: State) => state.dashboard.past.length,
  );
  const numberOfRedoableStates = useSelector(
    (state: State) => state.dashboard.future.length,
  );

  const handleUndo = () => {
    dispatch(ActionCreators.undo());
  };

  const handleRedo = () => {
    dispatch(ActionCreators.redo());
  };

  const handleReset = () => {
    dispatch(ActionCreators.jumpToPast(0));
  };

  return (
    <SubMenu title={formatMessage({ id: "edit" })} {...props}>
      <Item onClick={handleUndo} disabled={numberOfUndoableStates === 0}>
        <UndoOutlined />
        {formatMessage(
          { id: "undo" },
          { key: browser.os.name === "macOS" ? "Cmd" : "Ctrl" },
        )}
      </Item>
      <Item onClick={handleRedo} disabled={numberOfRedoableStates === 0}>
        <RedoOutlined />
        {formatMessage(
          { id: "redo" },
          { key: browser.os.name === "macOS" ? "Cmd" : "Ctrl" },
        )}
      </Item>
      <Item onClick={handleReset} disabled={numberOfUndoableStates === 0}>
        <RollbackOutlined />
        {formatMessage({ id: "resetDashboard" })}
      </Item>
    </SubMenu>
  );
};
