/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC } from "react";
import { BgColorsOutlined } from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { useWidgetPlugins, EditorProps } from "@activeviam/activeui-sdk";

import { DrawerPlaceholder } from "./DrawerPlaceholder";
import { IconTooltip } from "./IconTooltip";
import { useIntl } from "react-intl";

export const StyleEditorDrawerIcon: FC<AntdIconProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <IconTooltip title={`${formatMessage({ id: "styleEditor" })} (Alt + Y)`}>
      <BgColorsOutlined />
    </IconTooltip>
  );
};

const StyleEditorDrawer: FC<EditorProps> = (props) => {
  const [{ styleEditor: StyleEditor }] = useWidgetPlugins([
    props.widgetState.widgetKey,
  ]);

  return StyleEditor ? <StyleEditor {...props} /> : <DrawerPlaceholder />;
};

export default StyleEditorDrawer;
