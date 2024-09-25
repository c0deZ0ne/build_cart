import {
  Box,
  Button as ChakraButton,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { FaAngleLeft, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { TiLocation } from "react-icons/ti";
import { useHistory } from "react-router-dom/";
import Pattern from "../../../assets/images/card-pattern.svg";
import Cards from "../../../components/Cards/Cards";
import Balance from "../../../components/Icons/Balance";
import WalletMinus from "../../../components/Icons/WalletMinus";
import WalletPlus from "../../../components/Icons/WalletPlus";
import Tabs from "../../../components/Tabs/Tabs";
import DashboardWrapper from "../../../layouts/dashboard";
import { addTransparency } from "../../../utility/helpers";
import Others from "../projects/components/documents";
import MaterialSchedule from "../projects/components/materialSchedule";
import Reports from "../projects/components/reports";
import RFQ from "../projects/components/rfq";

const JumboTron = () => {
  return (
    <Flex
      background={"primary"}
      p={"24px"}
      gap={"1.5rem"}
      borderRadius={"8px"}
      maxWidth={"100%"}
      flexWrap={{ base: "wrap", md: "nowrap" }}
    >
      <Image
        minHeight="200px"
        maxWidth="200px"
        borderRadius="8px"
        objectFit={"cover"}
        src={"http://unsplash.it/300/300?random&gravity=center"}
      ></Image>
      <Box color={"white"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"1rem"}
        >
          <Text
            fontSize={{ base: "32px", md: "40px" }}
            fontWeight={"600"}
            as={"h1"}
            lineHeight={1}
          >
            Fund Manager{" "}
          </Text>
        </Flex>

        <Box mt={"1rem"}>
          <Text fontSize="12px" fontWeight={"600"} textTransform={"uppercase"}>
            Description
          </Text>

          <Text
            fontSize={{ base: "14px", md: "1rem" }}
            lineHeight={"24px"}
            mt={"0.5rem"}
            pr="1rem"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
            commodi fugit, tenetur dignissimos iste doloremque recusandae
            laboriosam! Maxime, sequi numquam rerum aliquam accusantium velit
            quisquam quasi corporis? Dignissimos provident asperiores veniam
            possimus.
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

function FundManagerInfo() {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "1fr 1fr",
        md: "1fr 1fr 1fr",
        xl: "1fr 1fr",
      }}
      color={"#666"}
      fontSize={"12px"}
      gap={"1.5rem"}
      width={"100%"}
    >
      <GridItem
        p={"24px"}
        borderRadius={"8px"}
        boxShadow="xs"
        border={"1px solid rgba(18, 53, 90, 0.02)"}
        backgroundImage={`url(${Pattern})`}
        gridColumn={{ base: "span 1", sm: "1/-1", md: "span 1", xl: "1/-1" }}
      >
        <Text color={"secondary"} fontWeight={600} fontSize={"12px"}>
          FUND MANAGER
        </Text>

        <Flex mt={"8px"} gap={"9px"}>
          <Image
            borderRadius={"50%"}
            height={"40px"}
            width={"40px"}
            src="http://unsplash.it/200/200?random&gravity=center"
          ></Image>

          <Box>
            <Text fontSize={{ base: "1rem", md: "1.25rem" }} lineHeight={"1.5"}>
              'MY NAME'
            </Text>
            <Flex alignItems={"center"} gap={"5px"} fontSize={"12px"}>
              <FaEnvelope color={addTransparency("#12355A", 0.8)} />{" "}
              <Text>{"email@email.com"}</Text>
            </Flex>
            <Flex
              alignItems={"center"}
              gap={"5px"}
              mt={"6px"}
              fontSize={"12px"}
            >
              <FaPhoneAlt color={addTransparency("#12355A", 0.8)} />{" "}
              <Text>{"2349045990606"}</Text>
            </Flex>
          </Box>
        </Flex>
      </GridItem>

      <GridItem
        p={"24px"}
        borderRadius={"8px"}
        boxShadow="xs"
        border={"1px solid rgba(18, 53, 90, 0.02)"}
        backgroundImage={`url(${Pattern})`}
      >
        <Text
          color={"secondary"}
          textTransform={"uppercase"}
          fontWeight={600}
          mb={"1.5rem"}
          whiteSpace={"nowrap"}
        >
          Project durations
        </Text>

        <Flex alignItems={"center"} fontSize={"1.25rem"} gap={"0.5rem"}>
          <Box
            height={"2.5rem"}
            width={"2.5rem"}
            borderRadius={"50%"}
            backgroundColor={"rgba(18, 53, 90, 0.16)"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <MdOutlineWatchLater color="#12355A" size={"24px"} />
          </Box>
          <Text as="span" whiteSpace={"nowrap"}>
            52 weeks
          </Text>
        </Flex>
      </GridItem>

      <GridItem
        p={"24px"}
        borderRadius={"8px"}
        boxShadow="xs"
        border={"1px solid rgba(18, 53, 90, 0.02)"}
        backgroundImage={`url(${Pattern})`}
      >
        <Text
          color={"secondary"}
          textTransform={"uppercase"}
          fontWeight={600}
          mb={"1.5rem"}
          whiteSpace={"nowrap"}
        >
          PROJECT LOCATION
        </Text>

        <Flex alignItems={"center"} fontSize={"1.25rem"} gap={"0.5rem"}>
          <Box
            height={"2.5rem"}
            width={"2.5rem"}
            borderRadius={"50%"}
            backgroundColor={"rgba(18, 53, 90, 0.16)"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <TiLocation color="#12355A" size={"24px"} />
          </Box>
          <Text as="span">Lagos</Text>
        </Flex>
      </GridItem>
    </Grid>
  );
}

const QuickActions = () => {
  return (
    <Box
      p={"16px"}
      boxShadow="xs"
      border={"1px solid rgba(18, 53, 90, 0.02)"}
      backgroundImage={`url(${Pattern})`}
      borderRadius={"8px"}
    >
      <Text fontSize={"14px"} color={"primary"} fontWeight={"500"} mb={"8px"}>
        Quick Actions
      </Text>

      <Box>
        <ChakraButton
          color={"white"}
          variant={"unstyled"}
          display={"flex"}
          alignItems={"center"}
          gap={"8px"}
        >
          <Flex
            as={"span"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"40px"}
            width={"40px"}
            borderRadius={"8px"}
            bg={addTransparency("#F5852C", 0.16)}
          >
            <Flex
              alignItems={"center"}
              height={"24px"}
              width={"24px"}
              background={"secondary"}
              borderRadius={"8px"}
              padding={"0.25rem"}
            >
              <BsArrowUpRight size={"24px"} />
            </Flex>
          </Flex>
          <Text as={"span"} fontSize={"12px"} fontWeight={600} color={"#333"}>
            Export Project Report
          </Text>
        </ChakraButton>
      </Box>
    </Box>
  );
};

const FundsDetails = () => {
  const arr = [
    {
      name: "Project Wallet",
      quantity: 0,
      icon: <WalletPlus fill="#12355A" />,
      isCurrency: true,
      bg: "#12355A",
    },
    {
      name: "Budget",
      quantity: 10000000000,
      icon: <WalletMinus fill="#12355A" />,
      isCurrency: true,
      bg: "#12355A",
    },
    {
      name: "Spend",
      quantity: 0,
      icon: <Balance opacity="1" fill="#12355A" />,
      isCurrency: true,
      bg: "#EE4124",
    },
    {
      name: "Balance",
      quantity: 0,
      icon: <Balance opacity="1" fill="#12355A" />,
      isCurrency: true,
      bg: "#1C903D",
    },
  ];

  return (
    <Grid
      templateColumns={{ base: "1fr", sm: "1fr 1fr", xl: "repeat(4, 1fr)" }}
      gap={"24px"}
    >
      {arr.map((a) => {
        return (
          <GridItem key={a.name}>
            <Cards cardDetail={a} h="100%" bottom="38px" />
          </GridItem>
        );
      })}
    </Grid>
  );
};

const FundManagerProjectDetails = () => {
  const tabsArray = {
    headers: [
      {
        title: "Material Schedule",
        info: "Material Schedule details",
      },
      { title: "Request for Quote (RFQ)", info: "Request for quote details" },
      { title: "Other Documents", info: "Other Documents details" },
      { title: "Reports", info: "Reports details" },
    ],
    body: [<MaterialSchedule />, <RFQ />, <Others />, <Reports />],
  };

  const history = useHistory();
  return (
    <DashboardWrapper pageTitle="Fund Manager">
      <Box>
        <Box mb={"2rem"} onClick={() => history.goBack()} width={"max-content"}>
          <ChakraButton
            variant={"ghost"}
            leftIcon={<FaAngleLeft size={"24px"} strokeWidth={"1px"} />}
          >
            Back
          </ChakraButton>
        </Box>
      </Box>

      <Grid
        templateColumns={{ base: "1fr", xl: "2fr auto" }}
        gap={"24px"}
        alignItems={"flex-start"}
      >
        <JumboTron />

        <Box flex={1}>
          <FundManagerInfo />
        </Box>

        {/* <Box>
          <QuickActions />
        </Box> */}
      </Grid>

      <Box mt={"24px"}>
        <FundsDetails />
      </Box>

      <Box
        mt={"40px"}
        p={"24px 40px"}
        bg={addTransparency("#f5852c", 0.04)}
        borderRadius={"8px"}
      >
        <Tabs tabsData={tabsArray} />
      </Box>
    </DashboardWrapper>
  );
};

export default FundManagerProjectDetails;
