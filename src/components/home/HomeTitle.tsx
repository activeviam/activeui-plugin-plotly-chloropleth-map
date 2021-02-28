/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FC, ComponentType } from "react";
import { useTheme } from "@activeviam/activeui-sdk";
import { useIntl } from "react-intl";

export type HomeSection = "recentlyOpened" | "sharedWithMe" | "dashboards";

interface HomeTitleProps {
  icon: ComponentType;
  isSelected: boolean;
  section: HomeSection;
  onClick: (section: HomeSection) => void;
}

export const HomeTitle: FC<HomeTitleProps> = (props) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  return (
    <div
      css={css`
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        color: ${props.isSelected ? theme.primaryColor : theme.textColor};
      `}
      onClick={() => {
        props.onClick(props.section);
      }}
    >
      <props.icon
        css={css`
          margin-right: 8px;
        `}
      />
      {formatMessage({ id: props.section })}
    </div>
  );
};
