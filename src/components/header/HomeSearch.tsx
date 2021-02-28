/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { SearchOutlined } from "@ant-design/icons";
import Input from "antd/lib/input";
import { ChangeEvent, FC, KeyboardEvent, useMemo, useState } from "react";
import {
  ContentRecord,
  DashboardMetaData,
  HighlightedSearchResult,
  search,
  useTheme,
} from "@activeviam/activeui-sdk";
import Menu from "antd/lib/menu";
import { useSelector } from "react-redux";

import { getDashboardsTree } from "../../state/dashboardsTreeDuck";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import Dropdown from "antd/lib/dropdown";

const maxNumberOfResults = 7;

/**
 * Returns all folders and files found under `node`, recursively.
 */
const getFoldersAndFiles = (
  node: ContentRecord<DashboardMetaData>,
  path: string[] = [],
  acc: { metaData: DashboardMetaData; path: string[] }[] = [],
): { metaData: DashboardMetaData; path: string[] }[] => {
  if (path.length > 0) {
    const metaData = node?.children?.[`${path[path.length - 1]}_metadata`].entry
      .content!;
    acc.push({
      metaData,
      path,
    });
  }

  const children = node.children || {};
  Object.keys(children).forEach((childId) => {
    getFoldersAndFiles(children[childId], [...path, childId], acc);
  });

  return acc;
};

interface HomeSearchProps {
  onPathChanged?: (path: string[]) => void;
}

/**
 * The search input used in the header of the home page to search and navigate to dashboards or folders
 */
export const HomeSearch: FC<HomeSearchProps> = (props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const dashboardsTree = useSelector(getDashboardsTree);
  const theme = useTheme();
  const history = useHistory();
  const { formatMessage } = useIntl();

  const allDashboardsAndFolders = useMemo(() => {
    if (dashboardsTree === null) {
      return [];
    }
    return getFoldersAndFiles(dashboardsTree);
  }, [dashboardsTree]);

  const searchResults = useMemo(() => {
    if (searchValue.length === 0) {
      return [];
    }
    return search(allDashboardsAndFolders, searchValue, {
      keys: ["metaData.name"],
    }).slice(0, maxNumberOfResults);
  }, [allDashboardsAndFolders, searchValue]);

  const handleItemSelected = (item: {
    metaData: DashboardMetaData;
    path: string[];
  }) => {
    if (item.metaData.isFolder && props.onPathChanged) {
      props.onPathChanged(item.path);
    } else {
      history.push(`/dashboard/${item.path[item.path.length - 1]}`);
    }
    setSearchValue("");
  };

  /**
   * Handles the selection of the focused search result
   */
  const handleInputKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchResults[focusedIndex]) {
      handleItemSelected(searchResults[focusedIndex]);
    }
  };

  /**
   * Handles keyboard navigation amongst search results
   */
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setFocusedIndex(Math.min(maxNumberOfResults - 1, focusedIndex + 1));
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      setFocusedIndex(Math.max(0, focusedIndex - 1));
      event.preventDefault();
    }
  };

  const handleSearchValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const menu = (
    <Menu>
      {searchResults.map((searchResult, i) => (
        <Menu.Item
          key={i}
          css={css`
            background: ${focusedIndex === i
              ? theme.selectionColor
              : "transparent"};
          `}
          onClick={() => {
            handleItemSelected(searchResult);
          }}
        >
          <HighlightedSearchResult
            caption={
              searchResult.metaData.name ??
              formatMessage({ id: "defaultDashboardName" })
            }
            searchValue={searchValue}
          />
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown visible={searchValue.length > 0} overlay={menu}>
      <Input
        prefix={<SearchOutlined />}
        value={searchValue}
        onChange={handleSearchValueChanged}
        onKeyUp={handleInputKeyUp}
        onKeyDown={handleInputKeyDown}
        placeholder={"Search in ActiveUI"}
        style={{
          marginLeft: 176,
          width: 600,
          height: 28,
        }}
      />
    </Dropdown>
  );
};
