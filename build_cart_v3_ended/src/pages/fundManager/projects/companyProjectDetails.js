import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Spacer,
  Spinner,
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
import { HiChevronRight, HiPlus } from "react-icons/hi2";
import Button from "../../../components/Button";
import ProjectsIcon from "../../../components/Icons/Projects";
import ExportIcon from "../../../components/Icons/Export";
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
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { weeksDiff } from "../../../utility/helpers";
import CreateProject from "./modals/createProject";
import BaseModal from "../../../components/Modals/Modal";
import { TruncateWordCount } from "../../../components/Truncate";
import { FaHeart, FaPlus } from "react-icons/fa";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Bids from "./components/bids";
import ConfirmationModal from "../../../components/Modals/ConfirmationModal";
import PaymentWalletModal from "../../../components/Modals/PaymentWalletModal";

export default function BuilderCompanyProjectDetails() {
  const { projectId } = useParams();
  const [details, setDetails] = useState({});
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [refreshRfq, setRefreshRfq] = useState(true);
  const [isTenderAccepted, setTenderAccepted] = useState(true);
  const [isLoadingData, setLoadingData] = useState(true);
  const [projectImage, setProjectImage] = useState("");
  const [projectType, setProjectType] = useState("");
  const [owner, setOwner] = useState({});
  const [developers, setDevelopers] = useState([]);
  const [devPosition, setDevPosition] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenProjectWalletPayment,
    onOpen: onOpenProjectWalletPayment,
    onClose: onCloseProjectWalletPayment,
  } = useDisclosure();

  const {
    isOpen: isOpenApproveProject,
    onOpen: onOpenApproveProject,
    onClose: onCloseApproveProject,
  } = useDisclosure();

  const getProjectDetails = async (index) => {
    setLoadingData(true);
    try {
      const { data } = (
        await instance.get(`/fundManager/project/${projectId}/details`)
      ).data;

      const projImg = data?.project?.Medias.find(
        (e) => e.mediaType === "IMAGE",
      );
      const img = new Image();

      img.src = projImg?.url || "";
      img.onload = () => {
        setProjectImage(`url(${projImg.url})`);
      };

      img.onerror = () => {
        setProjectImage(`url(${defaultProjectImage})`);
      };

      const findAcceptTender = data?.project?.Tenders?.some(
        (e) => e?.status === "AWARDED",
      );

      setProjectType(data?.project?.ProjectType);
      setLoadingData(false);
      setTenderAccepted(findAcceptTender);
      setDetails(data?.project);
      setDefaultIndex(index);
      setOwner(data?.project?.projectFundManager?.fundManager ?? null);
      setDevelopers(data?.project?.developers);
    } catch (error) {
      console.log(error);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    getProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projectTabs = [
    {
      name: "Project Wallet",
      quantity: details?.ProjectWallet?.balance ?? 0,
      icon: <Vault opacity="1" fill="#12355A" />,
      action: (
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
      quantity: details?.budgetAmount ?? 0,
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
    setDefaultIndex(index);
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
        data={details?.materialSchedules ?? []}
        setDefaultIndex={handleChangeDefaultIndex}
      />,
      <RFQ
        setDefaultIndex={handleChangeDefaultIndex}
        refreshRfq={refreshRfq}
        data={details?.Rfqs}
      />,
      <Documents
        data={details?.Medias}
        getProjectDetails={getProjectDetails}
        setDefaultIndex={handleChangeDefaultIndex}
        owner={owner}
      />,
      <Reports data={details?.Rfqs} />,
    ],
  };
  const [isBetween992and1200] = useMediaQuery(
    "(min-width: 992px) and (max-width: 1200px)",
  );
  const [isBetween1200and1350] = useMediaQuery(
    "(min-width: 1200px) and (max-width: 1350px)",
  );
  return (
    <DashboardWrapper pageTitle="Project">
      <Flex alignItems="center" fontSize="12px" mb="20px" color="#999999">
        Projects <HiChevronRight />{" "}
        <Text as="span" textTransform="capitalize">
          {details?.title}
        </Text>
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
            bgRepeat="no-repeat"
            bgColor="rgba(255,255,255,1)"
            height={["150px", "150px", "150px", "100%"]}
            rounded="8px"
            bgSize="cover"
          ></Box>
          <Box width={["100%", "100%", "100%", "60%"]} color="#fff">
            <Flex justify="space-between" align="center">
              <Text fontSize="20px" textTransform="capitalize">
                {details?.title}
              </Text>
              <Text fontSize="20px" _hover={{ color: "#f5852c" }}>
                <FaHeart cursor="pointer" />{" "}
              </Text>
            </Flex>
            <Flex justify="space-between" wrap="wrap" gap={2}>
              {details?.Groups?.map((e, i) => (
                <Box
                  bg="#fff"
                  p="5px 10px"
                  color="primary"
                  rounded={50}
                  fontSize={"12px"}
                  fontWeight={600}
                  key={i}
                  w="fit-content"
                >
                  {e.name ?? "GROUP NAME"}
                </Box>
              ))}
            </Flex>
            <Text my="10px" fontSize="12px">
              DESCRIPTION
            </Text>
            <Box fontSize="14px">
              <TruncateWordCount count={300}>
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
              {developers?.length > 0 ? (
                <ProjectCards>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" fontWeight="600" color="secondary">
                      DEVELOPER
                    </Text>
                    <Center
                      fontSize="12px"
                      color="#fff"
                      w="30px"
                      h="30px"
                      rounded={50}
                      fontWeight="600"
                      bg="primary"
                    >
                      {details?.developers?.length}
                    </Center>
                  </Flex>
                  <Box mt="20px">
                    <Flex alignItems="flex-end" justify="space-between">
                      <Flex fontSize="12px">
                        <Avatar
                          name={developers[devPosition]?.businessName}
                          src={developers[devPosition]?.logo}
                        />
                        <VStack
                          ml="10px"
                          justify="center"
                          alignItems="flex-start"
                        >
                          <Text fontSize="20px">
                            {developers[devPosition]?.businessName}
                          </Text>

                          <Flex alignItems="center" mb={3}>
                            <Message fill="#12355A" width="16" height="16" />
                            <Text color="#999" as="span" ml={2}>
                              {isBetween1200and1350 ? (
                                <TruncateWordCount count={20}>
                                  {developers[devPosition]?.email}
                                </TruncateWordCount>
                              ) : (
                                developers[devPosition]?.email
                              )}
                            </Text>
                          </Flex>

                          <Flex alignItems="center">
                            <FaPhone />
                            <Text color="#999" as="span" ml={2}>
                              {developers[devPosition]?.owner?.phoneNumber}
                            </Text>
                          </Flex>
                        </VStack>
                      </Flex>
                      <Flex fontSize={"1.2em"} gap={2}>
                        <GoArrowLeft
                          cursor="pointer"
                          color={devPosition === 0 ? "#999" : ""}
                          onClick={
                            devPosition > 0
                              ? () => {
                                  setDevPosition(devPosition - 1);
                                }
                              : null
                          }
                        />

                        <GoArrowRight
                          cursor="pointer"
                          color={
                            !(devPosition < developers.length - 1) ? "#999" : ""
                          }
                          onClick={
                            devPosition < developers.length - 1
                              ? () => {
                                  setDevPosition(devPosition + 1);
                                }
                              : null
                          }
                        />
                      </Flex>
                    </Flex>
                  </Box>
                </ProjectCards>
              ) : (
                <ProjectCards>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" fontWeight="600" color="secondary">
                      PROJECT OWNER
                    </Text>
                  </Flex>
                  <Box mt="20px">
                    <Flex alignItems="flex-end" justify="space-between">
                      <Flex fontSize="12px">
                        <Avatar name={owner?.businessName} src={owner?.logo} />
                        <VStack
                          ml="10px"
                          justify="center"
                          alignItems="flex-start"
                        >
                          <Text fontSize="20px">{owner?.businessName}</Text>

                          <Flex alignItems="center" mb={3}>
                            <Message fill="#12355A" width="16" height="16" />
                            <Text color="#999" as="span" ml={2}>
                              {isBetween1200and1350 ? (
                                <TruncateWordCount count={20}>
                                  {owner?.email}
                                </TruncateWordCount>
                              ) : (
                                owner?.email
                              )}
                            </Text>
                          </Flex>

                          <Flex alignItems="center">
                            <FaPhone />
                            <Text color="#999" as="span" ml={2}>
                              {owner?.phone}
                            </Text>
                          </Flex>
                        </VStack>
                      </Flex>
                    </Flex>
                  </Box>
                </ProjectCards>
              )}
            </GridItem>
            <GridItem rowSpan={2} colSpan={[6, 6, 6, 2]}>
              <Flex h="100%" direction="column" gap={2} justify="space-between">
                {owner && (
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

                <ProjectCards height="200px" mt="10px" padding="15px 10px">
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
                        fontWeight="600"
                        onClick={onOpenProjectWalletPayment}
                      >
                        Add Funds
                      </Text>
                    </Flex>

                    <Flex alignItems="center" mt="5px">
                      {/* <IconContainer color="#F5852C">
                        <ExportIcon width="22px" height="22px" fill="#F5852C" />
                      </IconContainer>
 <Text
                        fontSize="12px"
                        cursor="pointer"
                        _hover={{ fontSize: "12.5px" }}
                        fontWeight="600"
                      >
                        Export Project Report
                      </Text> */}
                    </Flex>

                    <Box mt="5px" fontWeight="600" w="100%">
                      <Text fontSize="14px" cursor="pointer" fontWeight="400">
                        Approve Project:
                      </Text>

                      <SimpleGrid
                        fontSize="13px"
                        columns={2}
                        gap={[10, 10, 20, 2]}
                        textAlign="center"
                        my={1}
                        cursor="pointer"
                      >
                        <Box
                          _hover={{ background: "#F5852C19" }}
                          rounded="8px"
                          onClick={onOpenApproveProject}
                          color="#F5852C"
                          bg={"#F5852C29"}
                          p="10px"
                        >
                          Yes
                        </Box>
                        <Box
                          _hover={{ background: "#12355A19" }}
                          rounded="8px"
                          color="#12355A"
                          bg={"#12355A29"}
                          p="10px"
                        >
                          No
                        </Box>
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </ProjectCards>
              </Flex>
            </GridItem>
            <GridItem colSpan={[3, 3, 3, 2]}>
              <ProjectCards padding="20px 10px">
                <Flex h="100%" justify="space-around" direction="column">
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
                <Flex h="100%" justify="space-around" direction="column">
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
          return <Cards cardDetail={el} key={i} p="20px 10px" />;
        })}
      </SimpleGrid>

      <Box bg="#fbf3ec" p={5}>
        {isLoadingData ? (
          <Center p={20}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#12355A"
              size="xl"
            />
          </Center>
        ) : !owner ? (
          <Tabs
            tabsData={tabsArray}
            defaultIndex={defaultIndex}
            setDefaultIndex={handleChangeDefaultIndex}
          />
        ) : isTenderAccepted ? (
          <Tabs
            tabsData={tabsArray}
            defaultIndex={defaultIndex}
            setDefaultIndex={handleChangeDefaultIndex}
          />
        ) : (
          <Bids
            setDefaultIndex={handleChangeDefaultIndex}
            refreshRfq={refreshRfq}
            getProjectDetails={getProjectDetails}
            data={details}
          />
        )}
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

      {/* MARK PROJECT AS COMPLETE */}

      <ConfirmationModal
        isOpen={isOpenApproveProject}
        onClose={onCloseApproveProject}
        // handleAction={handleAction}
        title={"Approve Project"}
        message={
          "Are you satisfied with builder's work and want to mark project as completed?"
        }
        // isLoading={isLoading}
      />

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
