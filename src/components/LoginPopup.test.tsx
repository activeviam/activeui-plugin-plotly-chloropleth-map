import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { getRenderWithMocks } from "../__test_resources__/getRenderWithMocks";

describe("LoginPopup", () => {
  const username = "my username";
  const password = "my password";

  it("handles errors", async () => {
    const { mockedAuthenticate, render } = await getRenderWithMocks();
    // `getRenderWithMocks` must be called before loading modules importing `@activeviam/activeui-sdk`.
    const { default: LoginPopup } = await import("./LoginPopup");

    mockedAuthenticate.mockImplementationOnce(() => {
      throw new Error();
    });

    const { getByLabelText, getByText, getAllByText } = render(
      <LoginPopup onLogin={() => {}} />,
    );

    // Fill the form with username and password
    const usernameInput = getByLabelText("User name");
    fireEvent.change(usernameInput, { target: { value: username } });
    const passwordInput = getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: password } });
    const submitButton = getByText("OK");
    // Submit the form.
    fireEvent.click(submitButton);

    // Check that we display an error message.
    const errorMessages = getAllByText("Incorrect user name or password.");
    expect(errorMessages).toHaveLength(1);
  });

  it("logs in", async () => {
    const { mockedAuthenticate, render } = await getRenderWithMocks();
    // `getRenderWithMocks` must be called before loading modules importing `@activeviam/activeui-sdk`
    const { default: LoginPopup } = await import("./LoginPopup");

    const { getByLabelText, getByText, container } = render(
      <LoginPopup onLogin={() => {}} />,
    );

    // Fill the form with username and password
    const usernameInput = getByLabelText("User name");
    fireEvent.change(usernameInput, { target: { value: username } });
    const passwordInput = getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: password } });
    const submitButton = getByText("OK");
    // Submit the form.
    fireEvent.click(submitButton);

    // Check that the authenticate method has been called with the correct parameters
    await waitFor(() =>
      expect(mockedAuthenticate).toHaveBeenCalledWith(
        window.env.contentServerUrl,
        {
          username,
          password,
        },
      ),
    );

    // The login succeeded
    await waitFor(() => container.querySelector(`[data-status="success"]`));
  });
});
