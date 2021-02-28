/** @jsx jsx */
import { jsx } from "@emotion/core";
import { MouseEvent, FC } from "react";
import { DesktopOutlined } from "@ant-design/icons";
import { useTheme } from "@activeviam/activeui-sdk";

interface ToggleIsPresentingProps {
  isActive: boolean | undefined;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
}

const ToggleIsPresenting: FC<ToggleIsPresentingProps> = (props) => {
  const theme = useTheme();

  return (
    <DesktopOutlined
      onClick={props.onClick}
      style={{ color: props.isActive ? theme.primaryColor : undefined }}
    />
  );
};

export default ToggleIsPresenting;
