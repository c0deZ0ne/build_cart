import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../../layouts/dashboard";
import { useParams } from "react-router-dom";
import {
  useGetFundManagerBidsQuery,
  useGetFundManagerProjectDetailsQuery,
} from "../../../../redux/api/super-admin/fundManagerSlice";
import { HiChevronRight } from "react-icons/hi2";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { TruncateWordCount } from "../../../../components/Truncate";
import ProjectCards from "../../../../components/Cards/ProjectCards";
import Message from "../../../../components/Icons/Message";
import { FaPhone } from "react-icons/fa";
import IconContainer from "../../../../components/Icons/IconContainer";
import ClockIcon from "../../../../components/Icons/Clock";
import { weeksDiff } from "../../../../utility/helpers";
import LocationIcon from "../../../../components/Icons/Location";
import defaultProjectImage from "../../../../assets/images/project-image.svg";
import Cards from "../../../../components/Cards/Cards";
import Vault from "../../../../components/Icons/Vault";
import WalletPlus from "../../../../components/Icons/WalletPlus";
import WalletMinus from "../../../../components/Icons/WalletMinus";
import Input from "../../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import EmptyState from "../../../../components/EmptyState";
import BaseTable from "../../../../components/Table";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import ProjectBidModal from "./ProjectInvitationBidModal";
// import MaterialSchedule from "./MaterialSchedule";
import Tabs from "../../../../components/Tabs/Tabs";
import RequestForQuote from "./RequestForQuote";
import Documents from "../../../fundManager/projects/components/documents";
import MaterialSchedule from "../../../fundManager/projects/components/materialSchedule";
import instance from "../../../../utility/webservices";
import { Link as ReactRouterLink } from "react-router-dom";

export default function FundManagerProjectDetails({ pageTitle }) {
  const { projectId } = useParams();
  const [skip, setSkip] = useState(true);
  const [showBidDetail, setShowBidDetail] = useState(false);
  const [bidDetail, setBidDetail] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});
  const [projectBids, setProjectBids] = useState([]);
  const [search, setSearch] = useState("");
  const [devIndex, setDevIndex] = useState(0);
  const [tabList, setTabList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getProjectDetails = async () => {
    setIsLoading(true);
    const endpoint =
      pageTitle === "Builder"
        ? `/superAdmin/builders/projects/${projectId}`
        : `/superAdmin/fundManagers/projects/${projectId}`;
    try {
      const { data: project } = await instance.get(endpoint);
      setProjectDetails(project?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: bids, isLoading: bidIsLoading } = useGetFundManagerBidsQuery(
    projectId,
    { skip }
  );

  const { data: tabItems, isLoading: tabItemsIsLoading } =
    useGetFundManagerProjectDetailsQuery(projectId, { skip });

  const projectTabs = [
    {
      name: "Project Wallet",
      quantity: Number(projectDetails?.ProjectWallet?.balance ?? 0),
      icon: <Vault opacity="1" fill="#12355A" />,
      isCurrency: true,
    },
    {
      name: "Budget",
      quantity: projectDetails?.budgetAmount ?? 0,
      color: "#074794",
      icon: <WalletPlus fill="#074794" />,
      isCurrency: true,
    },
    {
      name: "Spend",
      quantity: projectDetails?.amountSpent ?? 0,
      bg: "#EE4124",
      icon: <WalletMinus fill="#12355A" />,
      isCurrency: true,
    },
    {
      name: "Balance",
      quantity: projectDetails?.amountLeft ?? 0,
      bg: "#1C903D",
      icon: <Vault opacity="1" fill="#12355A" />,
      isCurrency: true,
    },
  ];

  const tableColumn = [
    "S/N",
    "BUILDER NAME",
    "LOCATION",
    "COMPLETED PROJECTS",
    "QUOTE (₦)",
    "Estimated Delivery",
    "ACTION",
  ];

  useEffect(() => {
    if (projectId) {
      setSkip(false);
      getProjectDetails();
    }
  }, [projectId]);

  const reviewBid = (bid) => {
    setBidDetail(bid);
    setShowBidDetail(true);
  };

  useEffect(() => {
    if (bids) {
      const projectBidList = bids?.data?.map((bid, index) => {
        return {
          SN: `${(index + 1).toString().length < 2 ? 0 : ""}${index + 1}`,
          builderName: bid.builderName,
          location: bid.location,
          completedProjects: bid.completedProjects,
          quote: Intl.NumberFormat().format(bid.quote ?? 0),
          estimatedDeliver: bid.estimatedDelivery.weeksDuration + " Weeks",
          action: (
            <Box
              bg="rgba(28, 144, 61, 0.16)"
              color="#1C903D"
              px="22px"
              py="6px"
              borderRadius="4px"
              fontWeight="600"
              cursor="pointer"
              as="button"
              onClick={() => reviewBid(bid)}
            >
              Review
            </Box>
          ),
        };
      });
      setProjectBids(projectBidList);
    }

    if (tabItems) {
      setTabList(tabItems.data?.projects);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidIsLoading]);

  function searchTable() {
    const searchResult = projectBids.filter((el) => {
      return el?.builderName?.toLowerCase().match(search.toLowerCase());
    });

    return searchResult;
  }

  const tabsArray = {
    headers: [
      {
        title: "Material Schedule",
        info: "Material Schedule details",
      },
      { title: "Request for Quote (RFQ)", info: "Request for quote details" },
      { title: "Other Documents", info: "Other Documents details" },
    ],
    body: [
      <MaterialSchedule
        data={tabList?.materialSchedules || []}
        userType="admin"
      />,
      <RequestForQuote rfqs={tabList?.Rfqs} />,
      <Documents data={tabList?.documents} userType="admin" />,
    ],
  };

  return (
    <DashboardWrapper pageTitle={pageTitle}>
      <Flex alignItems="center" fontSize="12px" mb="20px" color="#999999">
        <Link
          as={ReactRouterLink}
          to={
            pageTitle === "Builder"
              ? "/super-admin/builders"
              : "/super-admin/fund-managers"
          }
        >
          {pageTitle === "Builder" ? "Builder" : "Fund Managers"}
        </Link>
        <HiChevronRight /> {projectDetails?.title}
      </Flex>

      <SimpleGrid mb="30px" columns={[1, 1, 1, 2]} gap={4} h="100%">
        <Flex
          p="20px"
          direction={["column", "column", "row", "row"]}
          rounded="8px"
          gap={4}
          bg="primary"
        >
          <Box
            width={["100%", "100%", "400px", "40%"]}
            backgroundImage={projectDetails?.image || defaultProjectImage}
            bgRepeat="no-repeat"
            bgColor="rgba(255,255,255,1)"
            height={["150px", "150px", "150px", "100%"]}
            rounded="8px"
            bgSize="cover"
          ></Box>
          <Box width={["100%", "100%", "100%", "60%"]} color="#fff">
            <Text fontSize="24px" fontWeight="500" textTransform="capitalize">
              {projectDetails?.title}
            </Text>
            <Box
              fontSize="12px"
              fontWeight="600"
              p="7px 8px"
              borderRadius="40px"
              bgColor="rgba(255, 255, 255, 1)"
              w="fit-content"
              color="primary"
              mb="16px"
            >
              Group name
            </Box>
            <Text my="10px" fontSize="12px" fontWeight="600">
              DESCRIPTION
            </Text>
            <Box fontSize="14px">
              <TruncateWordCount count={400}>
                {projectDetails?.description}
              </TruncateWordCount>
            </Box>
          </Box>
        </Flex>
        <Box h="100%">
          <Grid
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={4}
          >
            <GridItem colSpan={[3, 3, 3, 2]}>
              <ProjectCards>
                <Flex justify="space-between" align="center">
                  <Text fontSize="12px" fontWeight="600" color="secondary">
                    Developer
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
                    {projectDetails?.developers?.length}
                  </Center>
                </Flex>
                <Box mt="20px">
                  {projectDetails?.developers?.map((developer, index) => {
                    return (
                      <>
                        {devIndex === index && (
                          <Flex
                            alignItems="flex-end"
                            justify="space-between"
                            key={index}
                            wrap="wrap"
                          >
                            <Flex fontSize="12px">
                              <Avatar
                                name={developer?.businessName}
                                src={developer?.logo}
                              />
                              <VStack
                                ml="10px"
                                justify="center"
                                alignItems="flex-start"
                              >
                                <Text fontSize="20px">
                                  {developer?.businessName || "Developer Femi"}
                                </Text>

                                {developer.email && (
                                  <Flex alignItems="center">
                                    <Message
                                      fill="#12355A"
                                      width="12"
                                      height="12"
                                    />
                                    <Text color="#999" as="span" ml={2}>
                                      {developer?.email}
                                    </Text>
                                  </Flex>
                                )}
                                {developer?.phone && (
                                  <Flex alignItems="center">
                                    <FaPhone />
                                    <Text color="#999" as="span" ml={2}>
                                      {developer.phone}
                                    </Text>
                                  </Flex>
                                )}
                              </VStack>
                            </Flex>
                            <Flex fontSize={"20px"} gap={2}>
                              <GoArrowLeft
                                color={index === 0 && "#999"}
                                onClick={() => setDevIndex(index - 1)}
                              />
                              <GoArrowRight
                                color={
                                  index + 1 ===
                                    projectDetails?.developers.length && "#999"
                                }
                                onClick={() => setDevIndex(index + 1)}
                              />
                            </Flex>
                          </Flex>
                        )}
                      </>
                    );
                  })}
                </Box>
              </ProjectCards>
            </GridItem>
            <GridItem colSpan={[3, 3, 1, 1]}></GridItem>
            <GridItem colSpan={[3, 3, 1, 1]}>
              <ProjectCards padding="20px 10px">
                <Flex h="100%" justify="space-between" direction="column">
                  <Text fontSize="12px" fontWeight="600" color="secondary">
                    PROJECT DURATION
                  </Text>
                  <Flex mb="10px" alignItems="center">
                    <IconContainer color="#12355A" rounded="100%">
                      <ClockIcon fill="#12355A" />
                    </IconContainer>
                    <Text
                      lineHeight="18px"
                      fontSize={["14px", "15px", "16px", "17px"]}
                    >
                      {weeksDiff(
                        projectDetails?.startDate,
                        projectDetails?.endDate
                      )}{" "}
                      Weeks
                    </Text>
                  </Flex>
                </Flex>
              </ProjectCards>
            </GridItem>
            <GridItem colSpan={[3, 3, 1, 1]}>
              <ProjectCards padding="20px 10px">
                <Flex h="100%" justify="space-between" direction="column">
                  <Text fontSize="12px" fontWeight="600" color="secondary">
                    PROJECT LOCATION
                  </Text>
                  <Flex mb="10px" alignItems="center">
                    <IconContainer color="#12355A" rounded="100%">
                      <LocationIcon fill="#12355A" />
                    </IconContainer>

                    <Text
                      lineHeight="18px"
                      fontSize={["14px", "15px", "16px", "17px"]}
                    >
                      {projectDetails?.location}
                    </Text>
                  </Flex>
                </Flex>
              </ProjectCards>
            </GridItem>
            {/* <GridItem colSpan={[3, 3, 1, 1]}>
              <Flex h="100%" direction="column" justify="space-between">
                <ProjectCards height="200px" padding="20px 10px">
                  <Flex h="100%" justify="space-between" direction="column">
                    <Text
                      fontSize="12px"
                      fontWeight="600"
                      color="secondary"
                      textTransform="uppercase"
                    >
                      Quick Actions
                    </Text>

                    <Flex alignItems="center">
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
                    </Flex>
                  </Flex>
                </ProjectCards>
              </Flex>
            </GridItem> */}
          </Grid>
        </Box>
      </SimpleGrid>

      <SimpleGrid mb="30px" columns={[1, 2, 2, 4]} gap={4} h="100%">
        {projectTabs.map((el, i) => {
          return <Cards cardDetail={el} key={i} />;
        })}
      </SimpleGrid>

      {projectDetails?.awardedBid || pageTitle === "Builder" ? (
        <Box>
          <Tabs tabsData={tabsArray} />
        </Box>
      ) : (
        <Box bgColor="rgba(245, 133, 44, 0.04)" py="16px" px="24px">
          <Flex justifyContent="space-between" align="center" mb="24px">
            <Box>
              <Box as="h3" color="secondary" fontSize="20px" fontWeight="600">
                Bids
              </Box>
              <Text color="primary" fontSize="14px">
                Content for Bids goes here
              </Text>
            </Box>
            <Box w={{ base: "100%", md: "462px" }} ml="auto">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<RiSearch2Line />}
              />
            </Box>
          </Flex>
          {projectBids.length === 0 ? (
            <Box
              boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
              borderRadius="8px"
              bg="#fff"
              h="470px"
            >
              <EmptyState>
                <Text>
                  There are no{" "}
                  <Text as="span" color="#F5852C">
                    Bids
                  </Text>{" "}
                  on this project.
                </Text>
              </EmptyState>
            </Box>
          ) : (
            <Box bg="#fff" borderRadius="8px" my="30px">
              <BaseTable
                tableColumn={tableColumn}
                tableBody={projectBids}
                isLoading={isLoading}
              />
            </Box>
          )}
        </Box>
      )}

      {showBidDetail && bidDetail && (
        <ProjectBidModal
          closeModal={() => setShowBidDetail(false)}
          bidDetail={bidDetail}
          isOpen={showBidDetail}
          project={projectDetails}
          refetch={getProjectDetails}
          // projectTenderId={currentInvite.ProjectTenderId}
          key={showBidDetail}
        />
      )}
    </DashboardWrapper>
  );
}
