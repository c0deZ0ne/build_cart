import React from "react";
import { Box, Heading, VStack } from "@chakra-ui/react";
import ProjectsIcon from "../Icons/Projects";

const NoItem = ({ children }) => {
  return (
    <Box bg="#fff" w="100%" my={20}>
      <VStack>
        <ProjectsIcon width="60px" height="60px" />
        <Heading
          mt="5px"
          mb="10px"
          color="#858383"
          textAlign="center"
          fontSize={"22px"}
        >
          {children}
        </Heading>
      </VStack>
    </Box>
  );
};

export default NoItem;
