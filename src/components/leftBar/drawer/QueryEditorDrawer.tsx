/** @jsx jsx */
import { FC } from "react";
import { jsx } from "@emotion/core";
import { CodeOutlined } from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { useIntl } from "react-intl";
import { EditorProps, useWidgetPlugins } from "@activeviam/activeui-sdk";
import { IconTooltip } from "./IconTooltip";
import { DrawerPlaceholder } from "./DrawerPlaceholder";

export interface EditorDrawerProps {}

export const QueryEditorDrawerIcon: FC<AntdIconProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <IconTooltip title={`${formatMessage({ id: "queryEditor" })} (Alt + Q)`}>
      <CodeOutlined />
    </IconTooltip>
  );
};

const QueryEditorDrawer: FC<EditorProps> = (props) => {
  const [{ queryEditor: QueryEditor }] = useWidgetPlugins([
    props.widgetState.widgetKey,
  ]);

  return QueryEditor ? <QueryEditor {...props} /> : <DrawerPlaceholder />;
};

export default QueryEditorDrawer;
