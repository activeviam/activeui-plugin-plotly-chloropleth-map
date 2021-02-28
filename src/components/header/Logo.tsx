/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { MouseEvent, FC } from "react";
import { Title } from "@activeviam/activeui-sdk";

interface LogoProps {
  isProductNameVisible: boolean;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
}

const Logo: FC<LogoProps> = (props) => (
  <div
    css={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      ...(props.isProductNameVisible && { width: 120 }),
    }}
    onClick={props.onClick}
  >
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 19"
      css={{
        marginLeft: 16,
        marginTop: 8,
        marginBottom: 8,
        marginRight: 8,
      }}
    >
      <g
        id="Assets"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="AUI-Viewport"
          transform="translate(-201.000000, -61.000000)"
          fillRule="nonzero"
        >
          <g id="av-favicon-white" transform="translate(201.000000, 61.000000)">
            <polygon
              id="Path"
              fill="#00AEEF"
              points="11.9515789 0 11.9515789 4.6 15.9349474 6.89957895 15.9461053 6.90673684 11.9515789 9.20021053 11.9515789 13.7997895 23.9025263 6.89957895 11.9522105 0"
            />
            <polygon
              id="Path"
              fill="#FFFFFF"
              points="0 11.5065263 11.9507368 18.4071579 11.9507368 13.8067368 7.95642105 11.5132632 7.96715789 11.5065263 11.9507368 9.20673684 11.9507368 4.60673684"
            />
          </g>
        </g>
      </g>
    </svg>
    {props.isProductNameVisible && (
      <Title
        css={css`
          color: #fff !important;
        `}
        level={2}
      >
        ActiveUI
      </Title>
    )}
  </div>
);

export default Logo;
