/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FC, useState, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import Button from "antd/lib/button";
import {
  ClockCircleOutlined,
  ShareAltOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getContentNodes, getNode } from "@activeviam/activeui-sdk";

import Header from "../header/Header";
import { DashboardsTree } from "./DashboardsTree";
import { RecentlyOpened } from "./RecentlyOpened";
import { SharedWithMe } from "./SharedWithMe";
import { DashboardsInFolder } from "./DashboardsInFolder";
import { HomeTitle, HomeSection } from "./HomeTitle";
import { getDashboardsTree } from "../../state/dashboardsTreeDuck";
import { useSelector, useDispatch } from "react-redux";
import { initialDashboardState } from "../../initialDashboardState";
import { onDashboardUnloaded } from "../../state/dashboardDuck";
import { useSaveDashboardAs } from "../../hooks/useSaveDashboardAs";
import { getPathOfIds } from "./getPathOfIds";

export const Home: FC<{}> = () => {
  const { formatMessage } = useIntl();
  const dashboardsTree = useSelector(getDashboardsTree);
  const dispatch = useDispatch();
  const saveDashboardAs = useSaveDashboardAs();
  const [selectedSection, setSelectedSection] = useState<HomeSection>(
    "recentlyOpened",
  );
  const [selectedPath, setSelectedPath] = useState<number[] | null>([0]);
  const [
    isNewDashboardButtonDisabled,
    setIsNewDashboardButtonDisabled,
  ] = useState(false);

  const dashboardFolders = useMemo(() => {
    const areFilesVisible = false;
    return dashboardsTree
      ? getContentNodes(dashboardsTree, {
          rootNodeMetaData: {
            name: formatMessage({ id: "dashboards" }),
            isFolder: true,
          },
          areFilesVisible,
        })
      : null;
  }, [dashboardsTree, formatMessage]);

  useEffect(() => {
    document.title = "ActiveUI 5";
    dispatch(onDashboardUnloaded());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSection !== "dashboards") {
      setSelectedPath(null);
    }
  }, [selectedSection]);

  const handlePathChanged = (idPath: string[]) => {
    if (dashboardFolders !== null) {
      const indexPath: number[] = [];
      let i = 0;
      while (i < idPath.length) {
        const id = idPath[i];
        const node = getNode(dashboardFolders, indexPath);
        if (!node.children) {
          break;
        }
        const index = node.children.findIndex((child) => child.id === id);
        indexPath.push(index);
        i++;
      }
      setSelectedPath([0, ...indexPath]);
    }
  };

  const handleNewDashboardButtonClicked = async () => {
    if (dashboardFolders) {
      setIsNewDashboardButtonDisabled(true);
      const pathToFolder = selectedPath
        ? getPathOfIds([dashboardFolders], selectedPath).slice(1)
        : [];
      saveDashboardAs({ dashboard: initialDashboardState, pathToFolder });
    }
  };

  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <Header
        height={40}
        isMenuVisible={false}
        isProductNameVisible={true}
        isSearchVisible={true}
        isTitleVisible={false}
        onPathChanged={handlePathChanged}
      />
      <div
        css={css`
          flex-grow: 1;
          display: flex;
          overflow: hidden;
          height: 100%;
        `}
      >
        <div
          css={css`
            height: 100%;
            width: 100%;
            display: flex;
          `}
        >
          <div
            css={css`
              height: 100%;
              flex-shrink: 0;
              display: flex;
              flex-direction: column;
              padding-left: 16px;
              padding-right: 16px;
              width: 280px;
            `}
          >
            <Button
              type="primary"
              style={{
                marginBottom: 16,
                marginTop: 8,
              }}
              onClick={handleNewDashboardButtonClicked}
              disabled={isNewDashboardButtonDisabled}
            >
              <PlusOutlined />
              {formatMessage({ id: "createDashboard" })}
            </Button>
            <HomeTitle
              section="recentlyOpened"
              icon={ClockCircleOutlined}
              isSelected={selectedSection === "recentlyOpened"}
              onClick={setSelectedSection}
            />
            <HomeTitle
              section="sharedWithMe"
              icon={ShareAltOutlined}
              isSelected={selectedSection === "sharedWithMe"}
              onClick={setSelectedSection}
            />
            <DashboardsTree
              css={css`
                flex-grow: 1;
                margin-left: 2px;
              `}
              dashboardFolders={dashboardFolders}
              lineHeight={30}
              onClick={(node, path) => {
                setSelectedSection("dashboards");
                setSelectedPath(path);
              }}
              selectedPath={selectedPath}
            />
          </div>
          <div
            css={css`
              height: 100%;
              flex-grow: 1;
              padding-left: 16px;
            `}
          >
            {selectedSection === "recentlyOpened" && <RecentlyOpened />}
            {selectedSection === "sharedWithMe" && <SharedWithMe />}
            {selectedSection === "dashboards" && (
              // If the selected section is "dashboard", then `selectedPath` is defined.
              <DashboardsInFolder
                dashboardFolders={dashboardFolders}
                pathToFolder={selectedPath!}
                onPathChanged={setSelectedPath}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
