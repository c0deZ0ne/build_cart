import React, { useEffect, useMemo, useState } from "react";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import defaultProjectImage from "../../../assets/images/project-image.svg";
import ProjectCards from "../../../components/Cards/ProjectCards";
import Message from "../../../components/Icons/Message";
import { FaPhone } from "react-icons/fa6";
import IconContainer from "../../../components/Icons/IconContainer";
import Clock from "../../../components/Icons/Clock";
import Location from "../../../components/Icons/Location";
import { HiChevronRight } from "react-icons/hi2";
import Button from "../../../components/Button";
import ProjectsIcon from "../../../components/Icons/Projects";
import Cards from "../../../components/Cards/Cards";
import Vault from "../../../components/Icons/Vault";
import WalletPlus from "../../../components/Icons/WalletPlus";
import WalletMinus from "../../../components/Icons/WalletMinus";
import Tabs from "../../../components/Tabs/Tabs";
import MaterialSchedule from "./components/materialSchedule";
import RFQ from "./components/rfq";
import Documents from "./components/documents";
import Reports from "./components/reports";
import instance from "../../../utility/webservices";
import { weeksDiff } from "../../../utility/helpers";
import CreateProject from "./modals/createProject";
import CreateRfq from "./modals/createRfq";
import BaseModal from "../../../components/Modals/Modal";
import { TruncateWordCount } from "../../../components/Truncate";
import { IoCheckmarkCircle } from "react-icons/io5";
import MarkProjectComplete from "./modals/markProjectComplete";
import { useHistory, useParams, useLocation } from "react-router-dom";
import PaymentWalletModal from "../../../components/Modals/PaymentWalletModal";
import { FaPlus } from "react-icons/fa";

export default function BuilderCompanyProjectDetails() {
  // Router Values
  const { projectId } = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  useEffect(() => {
    // add a default parameter if not set
    if (!searchParams.get("tab")) {
      searchParams.set("tab", "0");
      history.replace({ search: searchParams.toString() });
    }
  }, [searchParams]);

  const {
    isOpen: isOpenProjectWalletPayment,
    onOpen: onOpenProjectWalletPayment,
    onClose: onCloseProjectWalletPayment,
  } = useDisclosure();

  const [details, setDetails] = useState({});
  const [currentTabIndex, setCurrentTabIndex] = useState(
    Number(searchParams.get("tab") ?? 0),
  );

  const [owner, setOwner] = useState("");
  const [refreshRfq, setRefreshRfq] = useState(true);
  const [projectImage, setProjectImage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRfq,
    onOpen: onOpenRfq,
    onClose: onCloseRfq,
  } = useDisclosure();
  const {
    isOpen: isOpenCompleteProject,
    onOpen: onOpenCompleteProject,
    onClose: onCloseCompleteProject,
  } = useDisclosure();

  const getProjectDetails = async (index) => {
    try {
      const { data } = (
        await instance.get(`/builder/project/${projectId}/details`)
      ).data;

      const projImg = data?.image;
      const img = new Image();

      img.src = projImg || "";
      img.onload = () => {
        setProjectImage(`url(${projImg})`);
      };

      img.onerror = () => {
        setProjectImage(`url(${defaultProjectImage})`);
      };

      setOwner(data?.fundManagers?.length < 1 ?? null);
      setDetails(data);
      setCurrentTabIndex(
        Number(searchParams.get("tab") ?? index ?? currentTabIndex),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isBetween992and1200] = useMediaQuery(
    "(min-width: 992px) and (max-width: 1200px)",
  );

  const projectTabs = [
    {
      name: "Project Wallet",
      quantity: details?.ProjectWallet?.balance ?? 0,
      icon: <Vault opacity="1" fill="#12355A" />,
      action:
        details?.ProjectType === "INVITE" ? (
          ""
        ) : (
          <Box
            rounded={15}
            cursor="pointer"
            p={"5px 8px"}
            color="#fff"
            fontWeight={600}
            bg="#F5852C"
            fontSize="12px"
            _hover={{ backgroundColor: "#F5852Cc7" }}
            onClick={onOpenProjectWalletPayment}
          >
            <Flex alignItems="center" gap={2}>
              <FaPlus fontSize="10px" /> Add Funds
            </Flex>
          </Box>
        ),
      isCurrency: true,
    },
    {
      name: "Budget",
      quantity: details?.fqStats?.rfqBudgets ?? 0,
      description:
        "This is the total budget for the RFQs raised on this project.",
      color: "#074794",
      icon: <WalletPlus fill="#074794" />,
      isCurrency: true,
      info: "far",
    },
    {
      name: "Spend",
      quantity: details?.amountSpent ?? 0,
      bg: "#EE4124",
      icon: <WalletMinus fill="#12355A" />,
      isCurrency: true,
      info: "far",
      description:
        "This is the total amount spent on the RFQs raised on this project.",
    },
    {
      name: "Variance",
      quantity:
        Number(details?.budgetAmount ?? 0) - Number(details?.amountSpent ?? 0),
      bg: "#1C903D",
      icon: <Vault opacity="1" fill="#12355A" />,
      isCurrency: true,
      info: "far",
      description:
        "This is the difference between your total budget and spend on RFQs for this project.",
    },
  ];

  const handleChangeDefaultIndex = (index) => {
    setRefreshRfq(!refreshRfq);
    setCurrentTabIndex(index);
    getProjectDetails();

    searchParams.set("tab", `${index}`);
    history.replace({ search: searchParams.toString() });
  };

  const tabsArray = {
    headers: [
      {
        title: "Material Schedule",
        info: "Upload and manage your material schedule here.",
      },
      {
        title: "Request for Quote (RFQ)",
        info: "Raise RFQ, approve bids, fund and manage orders here.",
      },
      {
        title: "Other Documents",
        info: "Add Documents relevant to this project here.",
      },
      {
        title: "Reports",
        info: "This is where the transaction report for this project is displayed.",
      },
    ],
    body: [
      <MaterialSchedule
        setDefaultIndex={handleChangeDefaultIndex}
        details={details}
      />,
      <RFQ
        setDefaultIndex={handleChangeDefaultIndex}
        refreshRfq={refreshRfq}
        details={details}
      />,
      <Documents
        data={details?.Medias}
        getProjectDetails={getProjectDetails}
        owner={owner}
      />,
      <Reports />,
    ],
  };

  const [isBetween1200and1350] = useMediaQuery(
    "(min-width: 1200px) and (max-width: 1350px)",
  );

  return (
    <DashboardWrapper pageTitle="Project">
      <Flex
        alignItems="center"
        textTransform="capitalize"
        fontSize="12px"
        mb="20px"
        color="#999999"
      >
        <span style={{ cursor: "pointer" }} onClick={() => history.go(-1)}>
          Projects
        </span>{" "}
        <HiChevronRight /> {details?.title}
      </Flex>

      <SimpleGrid
        mb="30px"
        columns={[1, 1, 1, isBetween992and1200 ? 1 : 2]}
        gap={4}
        h="100%"
      >
        <Flex
          p="20px"
          direction={["column", "column", "column", "row"]}
          rounded="8px"
          gap={4}
          bg="primary"
        >
          <Box
            width={["400px", "400px", "400px", "40%"]}
            backgroundImage={projectImage || defaultProjectImage}
            backgroundPosition="center"
            bgRepeat="no-repeat"
            bgColor="rgba(255,255,255,1)"
            height={["150px", "150px", "150px", "100%"]}
            rounded="8px"
            bgSize="cover"
          ></Box>
          <Box width={["100%", "100%", "100%", "60%"]} color="#fff">
            <Text textTransform="capitalize" fontSize="24px">
              {details?.title}
            </Text>
            <Text my="10px" fontSize="12px">
              DESCRIPTION
            </Text>
            <Box fontSize="14px">
              <TruncateWordCount count={400}>
                {details?.description}
              </TruncateWordCount>
            </Box>
          </Box>
        </Flex>
        <Box h="100%">
          <Grid
            templateRows={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
            ]}
            templateColumns="repeat(6, 1fr)"
            gap={4}
          >
            <GridItem colSpan={[6, 6, 6, 4]}>
              <ProjectCards>
                <Text fontSize="12px" fontWeight="600" color="secondary">
                  PROJECT OWNER
                </Text>
                <Box mt="20px">
                  <Flex fontSize="13px">
                    <Avatar
                      name={details?.Owner?.name}
                      src={details?.Owner?.logo}
                    />
                    <VStack ml="10px" justify="center" alignItems="flex-start">
                      <Text fontSize="20px">{details?.Owner?.name}</Text>

                      {details?.Owner?.email && (
                        <Flex alignItems="center">
                          <Message fill="#12355A" width="12" height="12" />
                          <Text color="#999" as="span" ml={2}>
                            {isBetween1200and1350 ? (
                              <TruncateWordCount count={20}>
                                {details?.Owner?.email}
                              </TruncateWordCount>
                            ) : (
                              details?.Owner?.email
                            )}
                          </Text>
                        </Flex>
                      )}

                      <Flex alignItems="center">
                        <FaPhone />
                        <Text color="#999" as="span" ml={2}>
                          {details?.Owner?.phoneNumber}
                        </Text>
                      </Flex>
                    </VStack>
                  </Flex>
                </Box>
              </ProjectCards>
            </GridItem>
            <GridItem rowSpan={2} colSpan={[6, 6, 6, 2]}>
              <Flex h="100%" direction="column" justify="space-between">
                {details?.fundManagers?.length < 1 && (
                  <Box>
                    <Button
                      full
                      borderColor="#F5862E"
                      background="#F5862E"
                      variant
                      onClick={onOpen}
                    >
                      Edit project
                    </Button>
                  </Box>
                )}

                <Spacer />

                <ProjectCards height="160px" padding="20px 10px">
                  <Text fontSize="14px" fontWeight="600" color="primary">
                    Quick Actions
                  </Text>

                  <VStack alignItems="flex-start">
                    <Flex alignItems="center" mt="5px">
                      <IconContainer color="#F5852C">
                        <ProjectsIcon
                          fill="#F5852C"
                          width="22px"
                          height="22px"
                        />
                      </IconContainer>
                      <Text
                        cursor="pointer"
                        fontSize="12px"
                        _hover={{ fontSize: "12.5px" }}
                        onClick={onOpenRfq}
                        fontWeight="600"
                      >
                        Create RFQ
                      </Text>
                    </Flex>

                    {/* <Flex alignItems="center" mt="5px">
                      <IconContainer color="#F5852C">
                        <ExportIcon width="22px" height="22px" fill="#F5852C" />
                      </IconContainer>

                      <Text
                        fontSize="12px"
                        cursor="pointer"
                        _hover={{ fontSize: "12.5px" }}
                        fontWeight="600"
                      >
                        Export Project Report
                      </Text>
                    </Flex> */}

                    <Flex alignItems="center" mt="5px">
                      <IconContainer color="#F5852C">
                        <IoCheckmarkCircle fontSize="22px" fill="#F5852C" />
                      </IconContainer>

                      <Text
                        fontSize="12px"
                        cursor="pointer"
                        _hover={{ fontSize: "12.5px" }}
                        fontWeight="600"
                        onClick={onOpenCompleteProject}
                      >
                        Mark Project as Complete
                      </Text>
                    </Flex>
                  </VStack>
                </ProjectCards>
              </Flex>
            </GridItem>
            <GridItem colSpan={[3, 3, 3, 2]}>
              <ProjectCards padding="20px 10px">
                <Flex h="100%" justify="space-between" direction="column">
                  <Text fontSize="12px" fontWeight="600" color="secondary">
                    PROJECT DURATION
                  </Text>
                  <Flex mb="10px" alignItems="center">
                    <IconContainer color="#12355A" rounded="100%">
                      <Clock fill="#12355A" />
                    </IconContainer>
                    <Text
                      lineHeight="18px"
                      fontSize={["14px", "15px", "16px", "17px"]}
                    >
                      {weeksDiff(details?.startDate, details?.endDate)} Weeks
                    </Text>
                  </Flex>
                </Flex>
              </ProjectCards>
            </GridItem>
            <GridItem colSpan={[3, 3, 3, 2]}>
              <ProjectCards padding="20px 10px">
                <Flex h="100%" justify="space-between" direction="column">
                  <Text fontSize="12px" fontWeight="600" color="secondary">
                    PROJECT LOCATION
                  </Text>
                  <Flex mb="10px" alignItems="center">
                    <IconContainer color="#12355A" rounded="100%">
                      <Location fill="#12355A" />
                    </IconContainer>

                    <Text
                      lineHeight="18px"
                      fontSize={["14px", "15px", "16px", "17px"]}
                    >
                      {details?.location}
                    </Text>
                  </Flex>
                </Flex>
              </ProjectCards>
            </GridItem>
          </Grid>
        </Box>
      </SimpleGrid>

      <SimpleGrid
        mb="30px"
        columns={[1, 2, 2, isBetween992and1200 ? 2 : 4]}
        gap={4}
        h="100%"
        bg="#fbf3ec"
        padding="30px 20px"
      >
        {projectTabs.map((el, i) => {
          return <Cards cardDetail={el} key={i} />;
        })}
      </SimpleGrid>

      <Box>
        <Tabs
          tabsData={tabsArray}
          defaultIndex={currentTabIndex}
          setDefaultIndex={handleChangeDefaultIndex}
        />
      </Box>

      {/* EDIT PROJECT MODAL */}
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Project"
        subtitle="Edit your project here"
      >
        <CreateProject
          onClose={onClose}
          refetch={getProjectDetails}
          isOpen={isOpen}
          project={details}
        />
      </BaseModal>

      {/* CREATE RFQ MODAL */}
      <BaseModal
        isOpen={isOpenRfq}
        onClose={onCloseRfq}
        title="Request For Quote"
        subtitle="Create an RFQ for your project"
        size="xl"
      >
        <CreateRfq
          onclose={onCloseRfq}
          setDefaultIndex={handleChangeDefaultIndex}
          details={details}
        />
      </BaseModal>

      {/* MARK PROJECT AS COMPLETE */}
      <BaseModal
        isOpen={isOpenCompleteProject}
        onClose={onCloseCompleteProject}
        title="Mark project as complete?"
        subtitle=""
        size="md"
      >
        <MarkProjectComplete
          onClose={onCloseCompleteProject}
          projectId={projectId}
        />
      </BaseModal>

      <PaymentWalletModal
        onOpen={onOpenProjectWalletPayment}
        onClose={onCloseProjectWalletPayment}
        isOpen={isOpenProjectWalletPayment}
        title="Fund Project Wallet"
        subtitle="Fund project wallet to make funds available for builders"
        refresh={getProjectDetails}
        projectId={projectId}
        useVault
        paymentPurpose={"FUND_PROJECT_WALLET"} // FUND_PROJECT_WALLET,FUND_WALLET,FUND_ORDER
      />
    </DashboardWrapper>
  );
}
