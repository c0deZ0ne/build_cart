import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  ListItem,
  SimpleGrid,
  Spinner,
  Text,
  UnorderedList,
  VStack,
  Progress,
  Link,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import defaultProjectImage from "../../../../assets/images/project-image.svg";
import { TruncateWordCount } from "../../../../components/Truncate";
import ProjectCards from "../../../../components/Cards/ProjectCards";
import Message from "../../../../components/Icons/Message";
import { FaPhone } from "react-icons/fa";
import IconContainer from "../../../../components/Icons/IconContainer";
import Clock from "../../../../components/Icons/Clock";
import Location from "../../../../components/Icons/Location";
import moment from "moment";
import Cards from "../../../../components/Cards/Cards";
import WalletPlus from "../../../../components/Icons/WalletPlus";
import EmptyState from "../../../../components/EmptyState";
import { Link as ReactRouterLink } from "react-router-dom";
import Tabs from "../../../../components/Tabs/Tabs";
import BaseTable from "../../../../components/Table";
import { IoIosArrowForward } from "react-icons/io";
import instance from "../../../../utility/webservices";
import { handleError } from "../../../../utility/helpers";

function CompanyProjects({ projects }) {
  return (
    <>
      {projects.length > 0 ? (
        <HStack spacing="24px" mb="24px" wrap="wrap">
          {projects.map((companyProj) => {
            return (
              <Box key={companyProj.id} width="346px">
                <Box
                  width="346px"
                  backgroundImage={companyProj?.image || defaultProjectImage}
                  bgRepeat="no-repeat"
                  bgColor="rgba(255,255,255,1)"
                  height="158px"
                  borderTopLeftRadius="8px"
                  borderTopRightRadius="8px"
                  bgSize="cover"
                  mb="12px"
                ></Box>
                <Link
                  as={ReactRouterLink}
                  to={`/super-admin/builder/project/${companyProj.id}`}
                  color="secondary"
                  fontSize="12px"
                  fontWeight="600"
                  mb="4px"
                  textTransform="uppercase"
                >
                  {companyProj?.title}
                </Link>
                <Box fontSize="12px" color="#666666">
                  <TruncateWordCount count={400}>
                    {companyProj?.description}
                  </TruncateWordCount>
                </Box>
              </Box>
            );
          })}
        </HStack>
      ) : (
        <EmptyState>
          <Text fontWeight={"500"} fontSize={"24px"} lineHeight={"36px"}>
            No business projects
          </Text>
        </EmptyState>
      )}
    </>
  );
}

function FundManagerProjects({ projects }) {
  return (
    <>
      {projects.length > 0 ? (
        <HStack spacing="24px" mb="24px" wrap="wrap">
          {projects.map((companyProj) => {
            return (
              <Box key={companyProj.id} width="346px">
                <Box
                  width="346px"
                  backgroundImage={companyProj?.image || defaultProjectImage}
                  bgRepeat="no-repeat"
                  bgColor="rgba(255,255,255,1)"
                  height="158px"
                  borderTopLeftRadius="8px"
                  borderTopRightRadius="8px"
                  bgSize="cover"
                  mb="12px"
                ></Box>
                <Link
                  as={ReactRouterLink}
                  to={`/super-admin/builder/project/${companyProj.id}`}
                  color="secondary"
                  fontSize="12px"
                  fontWeight="600"
                  mb="4px"
                  textTransform="uppercase"
                >
                  {companyProj?.title}
                </Link>
                <Box fontSize="12px" color="#666666">
                  <TruncateWordCount count={100}>
                    {companyProj?.description}
                  </TruncateWordCount>
                </Box>
              </Box>
            );
          })}
        </HStack>
      ) : (
        <EmptyState>
          <Text fontWeight={"500"} fontSize={"24px"} lineHeight={"36px"}>
            No fund manager's projects
          </Text>
        </EmptyState>
      )}
    </>
  );
}

export default function BuilderProfile({ builder, setProfileOpen }) {
  const [builderDetails, setBuilderDetails] = useState({});
  const [builderProjectList, setBuilderProjectList] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeOrder, setActiveOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderIsLoading, setOrderIsLoading] = useState(false);
  const [projectIsLoading, setProjectIsLoading] = useState(false);
  const [kycPercentage, setKycPercentage] = useState(0);

  const fetchBuilder = async () => {
    setIsLoading(true);
    try {
      const { data } = await instance(`/superAdmin/builders/${builder?.id}`);
      if (data) {
        setBuilderDetails(data?.data?.builder);
        setCompletedProjects(data?.data?.completedProjects);
        setTeamMembers(data?.data?.teamMember);

        const proData = [
          {
            name: "Lifetime Expenditure",
            quantity: data?.data?.projectData?.lifetime || 0,
            icon: <WalletPlus fill="#12355A" />,
            isCurrency: true,
          },
          {
            name: "Ongoing Expenditure",
            quantity: data?.data?.projectData?.ongoing || 0,
            icon: <WalletPlus fill="#12355A" />,
            isCurrency: true,
          },
          {
            name: "Vault Balance",
            quantity: data?.data?.projectData?.balance || 0,
            icon: <WalletPlus fill="#12355A" />,
            isCurrency: true,
            bg: "#1C903D",
          },
        ];
        setProjectData(proData);

        const businessAddress = data?.data?.builder?.businessAddress;
        const businessRegNo = data?.data?.builder?.businessRegNo;
        const businessSize = data?.data?.builder?.businessSize;
        const count = [businessAddress, businessRegNo, businessSize].filter(
          (val) => val !== null && val !== ""
        ).length;
        const percentage = (count / 3) * 100;
        setKycPercentage(percentage);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuilderOrder = async () => {
    setOrderIsLoading(true);
    try {
      const { data } = await instance(`/superAdmin/orders/${builder?.id}`);

      if (data) {
        const orders = data?.data.map((order, index) => {
          return {
            SN: `${(index + 1).toString().length < 2 ? 0 : ""}${index + 1}`,
            itemName: order.RfqRequestMaterial?.name,
            category: "-",
            quantity: new Intl.NumberFormat().format(
              order.RfqRequestMaterial?.quantity ?? 0
            ),
            budhet: new Intl.NumberFormat().format(
              order.RfqRequestMaterial?.budget ?? 0
            ),
            action: (
              <Link
                as={ReactRouterLink}
                to={`/super-admin/rfq-details/${order?.RfqRequestId}`}
              >
                <Flex align="center" cursor="pointer" color="#12355A">
                  View
                  <IoIosArrowForward />
                </Flex>
              </Link>
            ),
          };
        });
        setActiveOrder(orders);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setOrderIsLoading(true);
    }
  };

  const fetchBuilderProjects = async () => {
    setProjectIsLoading(true);
    try {
      const { data } = await instance(
        `/superAdmin/projects/builders/${builder?.id}`
      );
      if (data) {
        setBuilderProjectList(data?.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setProjectIsLoading(true);
    }
  };

  useEffect(() => {
    if (builder) {
      Promise.all([
        fetchBuilder(),
        fetchBuilderOrder(),
        fetchBuilderProjects(),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builder]);

  const tabsArray = {
    headers: [
      {
        title: "Business Project",
      },
      { title: "Fund manager Project" },
    ],
    body: [
      <CompanyProjects projects={builderProjectList?.businessProjects || []} />,
      <FundManagerProjects
        projects={builderProjectList?.fundManagerProject || []}
      />,
      // <Documents data={tabList?.documents} />,
    ],
  };

  const tableColumn = [
    "S/N",
    "ITEM NAME",
    "CATEGORY",
    "QUANTITY",
    "UNIT BUDGET (₦)",
    "ACTION",
  ];

  return (
    <Box
      pos="absolute"
      top="-120px"
      left="0"
      bgColor="#fff"
      w="100%"
      minH="100vh"
      p="40px 25px"
    >
      {isLoading ? (
        <Flex align="center" justify="center" h="100%">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="secondary"
            size="xl"
          />
        </Flex>
      ) : (
        <>
          <Flex
            as="button"
            alignItems="center"
            fontSize="16px"
            mb="32px"
            fontWeight="600"
            color="#666"
            onClick={() => setProfileOpen(false)}
          >
            <HiChevronLeft /> Back
          </Flex>
          <SimpleGrid mb="30px" columns={[1, 1, 1, 2]} gap="24px" h="100%">
            <Flex
              p="20px"
              direction={["column", "column", "row", "row"]}
              rounded="8px"
              gap={4}
              bg="primary"
            >
              <Box
                width={["100%", "100%", "400px", "40%"]}
                backgroundImage={builderDetails?.logo || defaultProjectImage}
                bgRepeat="no-repeat"
                bgColor="#fff"
                height={["150px", "150px", "150px", "100%"]}
                rounded="8px"
                bgSize="cover"
              ></Box>
              <Box width={["100%", "100%", "100%", "60%"]} color="#fff">
                <Text fontSize="32px">{builderDetails?.businessName}</Text>
                <Box
                  fontSize="12px"
                  fontWeight="600"
                  color="white"
                  p="7px 8px"
                  borderRadius="40px"
                  bgColor="rgba(255, 255, 255, 0.16)"
                  w="fit-content"
                  mb="16px"
                >
                  Builder
                </Box>
                <Text mb="10px" fontSize="12px" fontWeight="600">
                  Info
                </Text>
                <Box fontSize="14px">
                  <TruncateWordCount count={400}>
                    {builderDetails?.about}
                  </TruncateWordCount>
                </Box>
              </Box>
            </Flex>
            <Box h="100%">
              <Grid
                templateRows="repeat(2, 1fr)"
                templateColumns="repeat(3, 1fr)"
                gap="24px"
              >
                <GridItem colSpan={[3, 1, 1, 1]}>
                  <ProjectCards>
                    <Text fontSize="12px" fontWeight="600" color="secondary">
                      CONTACT INFORMATION
                    </Text>
                    <Box mt="20px">
                      <VStack justify="center" alignItems="flex-start">
                        {builderDetails?.email && (
                          <Flex alignItems="center">
                            <Message fill="#12355A" width="16" height="16" />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {builderDetails?.email}
                            </Text>
                          </Flex>
                        )}

                        {builderDetails?.phone && (
                          <Flex alignItems="center">
                            <FaPhone fontSize="16px" />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {builderDetails?.phone}
                            </Text>
                          </Flex>
                        )}

                        {builderDetails?.contactPhone && (
                          <Flex alignItems="center">
                            <FaPhone />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {builderDetails?.contactPhone}
                            </Text>
                          </Flex>
                        )}
                      </VStack>
                    </Box>
                  </ProjectCards>
                </GridItem>
                <GridItem colSpan={[3, 1, 1, 1]}>
                  <ProjectCards padding="20px 10px">
                    <Flex h="100%" direction="column">
                      <Text
                        fontSize="12px"
                        fontWeight="600"
                        color="secondary"
                        mb="8px"
                      >
                        LAST LOGIN
                      </Text>
                      <Text color="#999" as="span" fontSize="12px">
                        {moment(builderDetails?.lastLogin).format(
                          "DD-MM-YYYY HH:mm a"
                        )}
                      </Text>
                    </Flex>
                  </ProjectCards>
                </GridItem>
                <GridItem colSpan={[3, 1, 1, 1]}>
                  <ProjectCards padding="20px 10px">
                    <Flex h="100%" justify="space-between" direction="column">
                      <Text fontSize="12px" fontWeight="600" color="secondary">
                        USER KYC
                      </Text>
                      <Flex mb="10px" alignItems="center">
                        <Progress
                          value={kycPercentage}
                          w="100%"
                          bgColor="#12355A"
                        />
                        <Text
                          color="#12355A"
                          fontSize="12px"
                          ml="8px"
                          fontWeight="600"
                        >
                          {kycPercentage}%
                        </Text>
                        <Text
                          lineHeight="18px"
                          fontSize={["14px", "15px", "16px", "17px"]}
                        >
                          {/* {details?.location} */}
                        </Text>
                      </Flex>
                    </Flex>
                  </ProjectCards>
                </GridItem>
                <GridItem colSpan={[3, 1, 1, 1]}>
                  <ProjectCards padding="20px 10px">
                    <Flex h="100%" justify="space-between" direction="column">
                      <Text
                        fontSize="12px"
                        fontWeight="600"
                        color="secondary"
                        mb="8px"
                      >
                        COMPANY ADDRESS
                      </Text>
                      <Text fontSize="12px" mb="10px">
                        {builderDetails?.businessAddress}
                      </Text>
                      <Flex mb="10px" alignItems="center">
                        <IconContainer color="#12355A" rounded="100%">
                          <Location fill="#12355A" />
                        </IconContainer>

                        <Text
                          lineHeight="18px"
                          fontSize={["14px", "15px", "16px", "17px"]}
                        >
                          {builderDetails?.businessAddress}
                        </Text>
                      </Flex>
                    </Flex>
                  </ProjectCards>
                </GridItem>
                <GridItem colSpan={[3, 1, 1, 1]}>
                  <ProjectCards padding="20px 10px">
                    <Flex h="100%" justify="space-between" direction="column">
                      <Text fontSize="12px" fontWeight="600" color="secondary">
                        COMPLETED PROJECTS
                      </Text>
                      <Flex mb="10px" alignItems="center">
                        <IconContainer color="#12355A" rounded="100%">
                          <Clock fill="#12355A" />
                        </IconContainer>
                        <Text
                          lineHeight="18px"
                          fontSize={["14px", "15px", "16px", "17px"]}
                        >
                          {completedProjects.length}
                        </Text>
                      </Flex>
                    </Flex>
                  </ProjectCards>
                </GridItem>
                <GridItem colSpan={[3, 1, 1, 1]}>
                  <ProjectCards padding="20px 10px">
                    <Flex h="100%" direction="column">
                      <Text
                        fontSize="12px"
                        fontWeight="600"
                        color="secondary"
                        mb="13px"
                      >
                        TEAM
                      </Text>
                      <UnorderedList>
                        {teamMembers.map((member, index) => {
                          return (
                            <ListItem fontSize="12px" key={index}>
                              {member?.name}
                            </ListItem>
                          );
                        })}
                      </UnorderedList>
                    </Flex>
                  </ProjectCards>
                </GridItem>
              </Grid>
            </Box>
          </SimpleGrid>

          <Flex wrap="wrap" gap="16px">
            {projectData.map((item) => {
              return <Cards cardDetail={item} width="300px" />;
            })}
          </Flex>
          <Box borderRadius="8px" mt="5px" p="20px 5px">
            <Tabs tabsData={tabsArray} />
          </Box>

          <Box mt="56px">
            <Text color="#666666" mb="32px" fontWeight="600">
              ACTIVE ORDERS
            </Text>
            {activeOrder.length === 0 ? (
              <Box
                boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
                borderRadius="8px"
                bg="#fff"
                h="470px"
              >
                <EmptyState>
                  <Text>Builder have no order</Text>
                </EmptyState>
              </Box>
            ) : (
              <Box bg="#fff" borderRadius="8px" my="30px">
                <BaseTable
                  tableColumn={tableColumn}
                  tableBody={activeOrder}
                  isLoading={orderIsLoading}
                />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
