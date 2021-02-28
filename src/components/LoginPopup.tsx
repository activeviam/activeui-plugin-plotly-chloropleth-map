/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FC, KeyboardEvent, useState } from "react";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import AntModal from "antd/lib/modal";
import UserOutlined from "@ant-design/icons/UserOutlined";
import LockOutlined from "@ant-design/icons/LockOutlined";
import { authenticate } from "@activeviam/activeui-sdk";
import { useIntl } from "react-intl";

import { contentServerUrl } from "../serverUrls";

interface LoginPopupProps {
  username?: string | null;
  onLogin: (username: string, token: string) => void;
}

const LoginPopup: FC<LoginPopupProps> = (props) => {
  const { formatMessage } = useIntl();

  const [errorCounter, setErrorCounter] = useState<number>(0);
  const [username, setUsername] = useState<string>(props.username || "");
  const [password, setPassword] = useState<string>();
  const [status, setStatus] = useState<
    "initial" | "pending" | "success" | "error"
  >("initial");

  const handleSubmit = async () => {
    if (username && password) {
      try {
        setStatus("pending");
        const token = await authenticate(contentServerUrl, {
          username,
          password,
        });
        setStatus("success");
        props.onLogin(username, token);
      } catch (err) {
        setStatus("error");
        setErrorCounter(errorCounter + 1);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const hasErrored = errorCounter > 0;
  const hasMoreTries = errorCounter < 3;

  return (
    <AntModal
      title={formatMessage({ id: "login" })}
      centered
      onOk={handleSubmit}
      visible={true}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div
        data-status={status}
        css={css`
          width: 100%;
          min-width: 300px;
        `}
      >
        {hasErrored ? (
          <div
            css={css`
              color: red;
              padding: 5px;
              border-radius: 3px;
              margin-bottom: 10px;
            `}
          >
            {hasMoreTries
              ? formatMessage({ id: "incorrectUsernameOrPassword" })
              : formatMessage({ id: "cannotMatchUsernameAndPassword" })}
          </div>
        ) : null}
        <Form
          layout="horizontal"
          labelCol={{ span: 5 }}
          initialValues={{ username }}
        >
          <Form.Item
            validateStatus={hasErrored ? "error" : undefined}
            name="username"
            label={formatMessage({ id: "username" })}
          >
            <Input
              tabIndex={1}
              placeholder={formatMessage({ id: "username" })}
              prefix={<UserOutlined />}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              autoFocus={props.username == null}
              disabled={!hasMoreTries}
              onKeyDown={handleKeyDown}
            />
          </Form.Item>
          <Form.Item
            validateStatus={hasErrored ? "error" : undefined}
            name="password"
            label={formatMessage({ id: "password" })}
          >
            <Input.Password
              tabIndex={2}
              placeholder={formatMessage({ id: "password" })}
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoFocus={props.username != null}
              disabled={!hasMoreTries}
              onKeyDown={handleKeyDown}
            />
          </Form.Item>
        </Form>
      </div>
    </AntModal>
  );
};

export default LoginPopup;
