/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Empty from "antd/lib/empty";
import { FC } from "react";

import { useIntl } from "react-intl";

interface DrawerPlaceholderProps {}

export const DrawerPlaceholder: FC<DrawerPlaceholderProps> = (props) => {
  const { formatMessage } = useIntl();

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Empty description={`${formatMessage({ id: "emptyEditor" })}`} />
    </div>
  );
};
