/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FC } from "react";
import Menu from "antd/lib/menu";
import { BulbOutlined, QuestionOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import Modal from "antd/lib/modal";
import preval from "preval.macro";
import { getOverlayRoot } from "../../getOverlayRoot";

const version = preval`module.exports = require('../../../package.json').version`;

const { SubMenu, Item } = Menu;

interface HelpMenuProps {}

export const HelpMenu: FC<HelpMenuProps> = (props) => {
  const { formatMessage } = useIntl();

  const openDocumentation = () => {
    window.open("https://activeviam.com/activeui/documentation", "_blank");
  };

  const openAboutPopup = () => {
    Modal.info({
      title: formatMessage({ id: "about" }),
      getContainer: getOverlayRoot,
      content: (
        <div
          css={{
            ".about-section": {
              display: "flex",
              justifyContent: "space-between",
            },
          }}
        >
          <div className="about-section">
            <div>ActiveUI</div>
            <div>{version}</div>
          </div>
          <div className="about-section">
            <div>ActivePivot</div>
            <div>5.9.4</div>
          </div>
        </div>
      ),
    });
  };

  return (
    <SubMenu title={formatMessage({ id: "help" })} {...props}>
      <Item onClick={openDocumentation}>
        <BulbOutlined />
        {formatMessage({ id: "documentation" })}
      </Item>
      <Item onClick={openAboutPopup}>
        <QuestionOutlined />
        {formatMessage({ id: "about" })}
      </Item>
    </SubMenu>
  );
};
