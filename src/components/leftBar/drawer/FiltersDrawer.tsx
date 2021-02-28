/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { FiltersEditor, EditorProps } from "@activeviam/activeui-sdk";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";

import { IconTooltip } from "./IconTooltip";
import { useIntl } from "react-intl";

export interface FiltersDrawerProps {}

export const FiltersDrawerIcon: FC<AntdIconProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <IconTooltip title={`${formatMessage({ id: "filters" })} (Alt + F)`}>
      <FilterOutlined />
    </IconTooltip>
  );
};

const FiltersDrawer: FC<EditorProps> = (props) => {
  return <FiltersEditor {...props} />;
};

export default FiltersDrawer;
