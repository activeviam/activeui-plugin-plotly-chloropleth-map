/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC } from "react";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { EditorProps, useWidgetPlugins } from "@activeviam/activeui-sdk";

import { DrawerPlaceholder } from "./DrawerPlaceholder";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { IconTooltip } from "./IconTooltip";
import { useIntl } from "react-intl";

export const ContentEditorDrawerIcon: FC<AntdIconProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <IconTooltip title={`${formatMessage({ id: "contentEditor" })} (Alt + C)`}>
      <EditOutlined />
    </IconTooltip>
  );
};

const ContentEditorDrawer: FC<EditorProps> = (props) => {
  const [{ contentEditor: ContentEditor }] = useWidgetPlugins([
    props.widgetState.widgetKey,
  ]);

  return ContentEditor ? <ContentEditor {...props} /> : <DrawerPlaceholder />;
};

export default ContentEditorDrawer;
