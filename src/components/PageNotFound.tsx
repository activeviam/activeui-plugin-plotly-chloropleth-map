import React, { FC } from "react";
import Result from "antd/lib/result";

import { useHistory } from "react-router-dom";
import Button from "antd/lib/button";
import { useIntl } from "react-intl";

interface PageNotFoundProps {
  message?: string;
}

export const PageNotFound: FC<PageNotFoundProps> = ({ message }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const handleClicked = () => {
    history.push("/");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Result
        status="info"
        subTitle={
          message !== undefined
            ? message
            : formatMessage({ id: "error.urlNotFound" })
        }
        extra={
          <Button onClick={handleClicked} type="primary">
            {formatMessage({ id: "goToHomePage" })}
          </Button>
        }
      />
    </div>
  );
};
