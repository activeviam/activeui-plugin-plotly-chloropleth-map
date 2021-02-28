/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC, useState, ReactElement, cloneElement, CSSProperties } from "react";
import Tooltip from "antd/lib/tooltip";
interface IconTooltipProps {
  title: string;
  style?: CSSProperties;
}

export const IconTooltip: FC<IconTooltipProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const iconProps = {
    onClick: () => setVisible(false),
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => {
      setVisible(false);
    },
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      position: "absolute",
      left: 0,
    },
  };

  return (
    <Tooltip visible={visible} placement="right" title={props.title}>
      {cloneElement(props.children as ReactElement, iconProps)}
    </Tooltip>
  );
};
