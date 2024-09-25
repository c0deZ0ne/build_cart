import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import Popup from "../../../../components/Popup/Popup";
export default function TopCards({
  cardPattern,
  cardDetail,
  setActiveCard,
  activeCard,
  isFill = false,
}) {
  return (
    <Box
      w="283px"
      borderRadius="8px"
      h="144px"
      boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
      p="24px"
      bgImage={cardPattern}
      bgColor={
        activeCard === cardDetail.name || isFill ? cardDetail.color : "#fff"
      }
      borderLeft={`4px solid ${cardDetail.color}`}
      color={
        activeCard === cardDetail.name || isFill ? "#fff" : cardDetail.color
      }
      cursor="pointer"
      _hover={{
        bgColor: `${cardDetail.color}`,
        color: "#fff",
      }}
      onClick={() => setActiveCard && setActiveCard(cardDetail.name)}
    >
      <Flex align="center">
        <Flex
          justifyContent="center"
          align="center"
          w="40px"
          h="40px"
          borderRadius="100%"
          bg={`${cardDetail.color}29`}
          mr="8px"
        >
          <IoCheckmarkCircle fontSize="24px" />
        </Flex>
        <Text mr="auto" fontSize="16px" fontWeight="600">
          {cardDetail.name}
        </Text>
        {cardDetail?.description && (
          <Popup
            info={cardDetail.description}
            ml="auto"
            triggerIcon={
              <Icon viewBox="0 0 16 16">
                <g opacity="0.56">
                  <path
                    d="M7.003.332C3.329.332.336 3.325.336 6.999c0 3.673 2.993 6.666 6.667 6.666 3.673 0 6.666-2.993 6.666-6.666 0-3.674-2.993-6.667-6.666-6.667zm-.5 4c0-.273.226-.5.5-.5.273 0 .5.227.5.5v3.333c0 .274-.227.5-.5.5a.504.504 0 01-.5-.5V4.332zm1.113 5.587a.688.688 0 01-.14.22.77.77 0 01-.22.14.664.664 0 01-.253.053.664.664 0 01-.254-.053.77.77 0 01-.22-.14.688.688 0 01-.14-.22.664.664 0 01-.053-.254c0-.086.02-.173.053-.253a.77.77 0 01.14-.22.77.77 0 01.22-.14.667.667 0 01.507 0 .77.77 0 01.22.14.77.77 0 01.14.22c.033.08.053.167.053.253 0 .087-.02.174-.053.254z"
                    fill={
                      activeCard === cardDetail.name
                        ? "#ffffff"
                        : "currentColor"
                    }
                  />
                </g>
              </Icon>
            }
          />
        )}
      </Flex>
      <Box mt="16px" fontSize="32px" fontWeight="700">
        {cardDetail.quantity ?? 0}
      </Box>
    </Box>
  );
}
