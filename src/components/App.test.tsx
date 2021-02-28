import { waitFor } from "@testing-library/dom";
import React from "react";

import { getRenderWithMocks } from "../__test_resources__/getRenderWithMocks";

const styleElement = document.createElement("link");
styleElement.id = "ant-style";
document.head.appendChild(styleElement);

describe("ActiveUI application", () => {
  it("Displays its name", async () => {
    const { mockedFetchDataModel, render } = await getRenderWithMocks();
    // `getRenderWithMocks` must be called before loading modules importing `@activeviam/activeui-sdk`.
    const { default: App } = await import("./App");

    const { getAllByText } = render(<App />);

    const loadingMessage = getAllByText("Loading...");
    expect(loadingMessage).toHaveLength(1);

    await waitFor(() => expect(mockedFetchDataModel).toHaveBeenCalledTimes(1));

    const elements = getAllByText("ActiveUI");
    expect(elements).toHaveLength(1);
  });
});
