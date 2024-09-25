import { Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";
import Upload from "./Icons/Upload";
import { IoIosCloseCircle } from "react-icons/io";

export default function InputUploadFile({
  imagePlaceholder = "Upload file",
  image,
  setImagePlaceholder,
  setImage,
  randomImgKey,
}) {
  const imageHandler = async (e) => {
    if (e.target.files[0] === null) return false;
    setImage(e.target.files[0]);
    setImagePlaceholder(e.target.files[0].name);
  };
  return (
    <HStack
      justifyContent="space-between"
      spacing="16px"
      flexWrap={{ base: "wrap", md: "nowrap" }}
      w="100%"
    >
      <Flex
        align="center"
        bgColor="rgba(18, 53, 90, 0.04)"
        h="48px"
        borderRadius="8px"
        border="0.5px solid #999"
        w="100%"
      >
        <Flex
          as="label"
          p="8px 16px"
          htmlFor={randomImgKey}
          align="center"
          cursor="pointer"
          w={{ base: "100%", md: "80%" }}
        >
          <Upload />
          <Text ml="8px" fontSize="12px">
            {imagePlaceholder}
          </Text>
          <input
            key={randomImgKey}
            type="file"
            id={randomImgKey}
            accept={"image/*"}
            onChange={(e) => {
              imageHandler(e);
            }}
            hidden
          />
        </Flex>
        <Flex
          align="center"
          ml="auto"
          pr="16px"
          cursor="pointer"
          onClick={() => {
            setImage(null);
            setImagePlaceholder("Upload file");
          }}
        >
          {image && <IoIosCloseCircle color="#999999" />}
        </Flex>
      </Flex>
    </HStack>
  );
}
