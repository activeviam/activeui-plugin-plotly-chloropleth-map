/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FC } from "react";

export const SharedWithMe: FC<{}> = () => {
  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 600;
        color: #9d9d9d;
      `}
    >
      Shared with me is coming soon.
    </div>
  );
};
