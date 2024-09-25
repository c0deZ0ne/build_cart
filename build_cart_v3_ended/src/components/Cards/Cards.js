import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import React from "react";
import cardPattern from "../../assets/images/card-image.svg";
import Naira from "../Icons/Naira";
import Popup from "../Popup/Popup";
export default function Cards({
  cardDetail,
  width = "",
  h = "",
  bg = "#12355A",
  p = "20px",
  absolute = false,
  bottom,
  bottomFontSize = { base: "18px", lg: "20px", xl: "20px" },
  spacer,
  children,
  onClick = () => {},
}) {
  return (
    <VStack
      onClick={onClick}
      alignItems="flex-start"
      justify="flex-start"
      width={width}
      h={h}
      borderRadius="4px"
      boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
      p={p}
      bgImage={cardPattern}
      bgPosition={"bottom"}
      bgColor="#ffffff"
      borderLeft={`5px solid ${cardDetail?.bg ? cardDetail?.bg : bg}`}
      pos="relative"
    >
      <Flex
        align="center"
        justify={cardDetail?.info === "near" ? "" : "space-between"}
        w="100%"
      >
        <Flex align="center" mr="8px">
          <Flex
            justifyContent="center"
            align="center"
            w="40px"
            h="40px"
            borderRadius="100%"
            bg={`${cardDetail?.color ? cardDetail?.color : bg}29`}
            mr="8px"
            flexShrink={0}
          >
            {cardDetail?.icon}
          </Flex>
          <Text
            mr="auto"
            fontSize="14px"
            fontWeight="600"
            color={cardDetail?.color}
          >
            {cardDetail?.name}
          </Text>
        </Flex>

        {cardDetail?.info && <Popup info={cardDetail?.description} />}
        {cardDetail?.action && cardDetail?.action}
      </Flex>

      {spacer && <Spacer />}
      <Flex w="100%" mt={3} justify="space-between" align="center">
        <Flex
          alignItems="center"
          fontSize={bottomFontSize}
          fontWeight="700"
          pos={absolute ? "absolute" : ""}
          bottom={absolute ? bottom : ""}
          wrap="wrap"
          color={
            cardDetail?.quantity < 0
              ? "red"
              : cardDetail?.bottomColor || "primary"
          }
        >
          {cardDetail?.isCurrency && <Naira fill={cardDetail?.bottomColor} />}{" "}
          {cardDetail?.quantity &&
            new Intl.NumberFormat().format(cardDetail?.quantity ?? 0)}
        </Flex>

        <Box fontSize="14px">
          {cardDetail?.view !== "" && (
            <Box color="secondary"> {cardDetail?.view}</Box>
          )}
        </Box>
      </Flex>

      {children && <Box w="100%"> {children}</Box>}
    </VStack>
  );
}
