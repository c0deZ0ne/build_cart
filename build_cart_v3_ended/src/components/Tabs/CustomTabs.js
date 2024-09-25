import { Box, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";
import Popup from "../Popup/Popup";

/**
 * @typedef {{title: string, info: string}} TabItem
 */

/**
 * @param {{tabs: TabItem[], activeTab: string, setActiveTab: Function}} props
 * @returns
 */

const CustomTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <Box position={"relative"}>
      <Flex>
        {tabs.map((tab) => {
          return (
            <Box
              key={tab.title}
              position="relative"
              as="button"
              fontSize="16px"
              fontWeight="600"
              textAlign="center"
              p="12px 28px"
              borderColor={tab.title === activeTab ? "#F5852C" : "#FDEBDD"}
              onClick={() => setActiveTab(tab.title)}
            >
              <HStack>
                <Text as="span">{tab.title}</Text>
                {tab.info ? (
                  <Popup
                    info={tab.info}
                    fill={tab.title === activeTab ? "#12355A" : "#999999"}
                  />
                ) : null}
              </HStack>
              <Divider
                position={"absolute"}
                bottom={"-4px"}
                left={"0px"}
                h={"4px"}
                bg={tab.title === activeTab ? "#F5852C" : "#FDEBDD"}
                borderRadius={"8px"}
              />
            </Box>
          );
        })}
      </Flex>
      <Divider
        position={"relative"}
        h={"4px"}
        bg={"#FDEBDD"}
        borderRadius={"8px"}
        zIndex={-1}
      />
    </Box>
  );
};

export default CustomTabs;
