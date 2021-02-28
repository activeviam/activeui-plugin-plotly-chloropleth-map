/** @jsx jsx */
import { jsx } from "@emotion/core";
import { CloseCircleOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { ComponentType } from "react";
import { FallbackProps } from "react-error-boundary";
import { ExpiredLicenseError } from "@activeviam/activeui-sdk";
import { useIntl } from "react-intl";

/**
 * Displays a message specific to the error thrown by the App.
 */
export const ErrorPage: ComponentType<FallbackProps> = (props) => {
  const { formatMessage } = useIntl();
  let errorMessage: string | undefined;

  if (props.error instanceof ExpiredLicenseError) {
    errorMessage = formatMessage(
      { id: "error.licenseExpired" },
      {
        expirationDate: props.error.expirationDate.toLocaleDateString(),
      },
    );
  } else {
    errorMessage = props.error?.message;
  }
  return (
    <div
      css={{
        paddingLeft: 16,
        paddingRight: 16,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        css={{
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "22px",
        }}
      >
        <CloseCircleOutlined style={{ color: "red" }} />
        &nbsp;
        <span>{formatMessage({id: "error.anErrorOccurred"})}</span>
      </div>
      {errorMessage ? <Text>{errorMessage}</Text> : undefined}
    </div>
  );
};
