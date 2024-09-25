import React from "react";
import { useHistory } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import { MdChevronLeft } from "react-icons/md";

const GoBackButton = ({ text = "Back" }) => {
  const history = useHistory();
  return (
    <div>
      <button onClick={history.goBack}>
        <Flex alignItems={"center"} color="black">
          <MdChevronLeft fontSize={"22px"} /> <Text> {text}</Text>
        </Flex>
      </button>
    </div>
  );
};

export default GoBackButton;
