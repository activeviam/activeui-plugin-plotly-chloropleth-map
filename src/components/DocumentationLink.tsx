/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC } from "react";

interface DocumentationLinkProps {
  version: string;
  page: string;
}

export const DocumentationLink: FC<DocumentationLinkProps> = (props) => (
  <a
    href={`https://activeviam.com/activeui/documentation/${props.version}/${props.page}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {props.children}
  </a>
);
