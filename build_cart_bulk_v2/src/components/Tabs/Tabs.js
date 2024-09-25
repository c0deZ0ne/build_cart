import {
  Box,
  Flex,
  Tab,
  Tabs as TabBox,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Popup from "../Popup/Popup";

// TODO: Rename the defaultIndex to currentIndex
const Tabs = ({ tabsData, children, defaultIndex = 0, setDefaultIndex }) => {

  const [tabIndex, setTabIndex] = useState(defaultIndex);
  const { headers, body } = tabsData;

  useEffect(() => {
    setTabIndex(defaultIndex);
  }, [defaultIndex]);

  const handleIndexChange = (index) => {
    setTabIndex(index);
    setDefaultIndex && setDefaultIndex(index);
  };

  return (
    <Box overflowX="auto" w="100%">
      <TabBox
        isLazy
        onChange={handleIndexChange}
        index={tabIndex}
        width="100%"
        overflowX="auto"
        minH="40vh"
      >
        <Flex
          overflowX="auto"
          direction={["column", "column", "row", "row"]}
          gap={5}
          justify="space-between"
          width="100%"
          pb={1}
        >
          <TabList borderBottomColor="#F5852C29">
            {headers.map((header, index) => (
              <Tab
                key={index}
                px="32px"
                _selected={{
                  borderBottom: "2px solid #F5862C",
                  fontWeight: "600",
                  color: "primary",
                }}
                width="max-content"
              >
                {header.title}
                {header.info ? (
                  <Popup
                    info={header.info}
                    fill={index === tabIndex ? "#12355A" : "#999999"}
                  />
                ) : (
                  ""
                )}
              </Tab>
            ))}
          </TabList>
          <Box>{children}</Box>
        </Flex>
        <TabPanels>
          {
            body.map((element, index) => (
            <TabPanel px={0} key={index}>
              {element}
            </TabPanel>))
          }
        </TabPanels>
      </TabBox>
    </Box>
  );
};

export default Tabs;
