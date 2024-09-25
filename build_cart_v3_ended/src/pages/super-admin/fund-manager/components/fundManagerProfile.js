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
import instance from "../../../../utility/webservices";
import { handleError } from "../../../../utility/helpers";

export default function FundManagerProfile({ fundManager, setProfileOpen }) {
  const [fundManagerDetails, setFundManagerDetails] = useState({});
  const [projectData, setProjectData] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [kycPercentage, setKycPercentage] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const getFundManager = async () => {
    setIsLoading(true);
    try {
      const { data } = await instance(
        `/superAdmin/fundManagers/${fundManager?.id}`
      );

      if (data) {
        setFundManagerDetails(data?.data?.fundManager);
        setActiveProjects(data?.data?.activeProjects);
        setPendingProjects(data?.data?.pendingProjects);
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

        const businessAddress = data?.data?.fundManager?.businessAddress;
        const businessRegNo = data?.data?.fundManager?.businessRegNo;
        const businessSize = data?.data?.fundManager?.businessSize;
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

  useEffect(() => {
    if (fundManager) {
      getFundManager();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundManager]);

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
                backgroundImage={
                  fundManagerDetails?.logo || defaultProjectImage
                }
                bgRepeat="no-repeat"
                bgColor="#fff"
                height={["150px", "150px", "150px", "100%"]}
                rounded="8px"
                bgSize="cover"
              ></Box>
              <Box width={["100%", "100%", "100%", "60%"]} color="#fff">
                <Text fontSize="32px">{fundManagerDetails?.businessName}</Text>
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
                  Fund Manager
                </Box>
                <Text mb="10px" fontSize="12px" fontWeight="600">
                  Info
                </Text>
                <Box fontSize="14px">
                  <TruncateWordCount count={400}>
                    {fundManagerDetails?.about}
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
                        {fundManagerDetails?.email && (
                          <Flex alignItems="center">
                            <Message fill="#12355A" width="16" height="16" />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {fundManagerDetails?.email}
                            </Text>
                          </Flex>
                        )}

                        {fundManagerDetails?.phone && (
                          <Flex alignItems="center">
                            <FaPhone fontSize="16px" />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {fundManagerDetails?.phone}
                            </Text>
                          </Flex>
                        )}

                        {fundManagerDetails?.contactPhone && (
                          <Flex alignItems="center">
                            <FaPhone />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {fundManagerDetails?.contactPhone}
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
                        {moment(fundManagerDetails?.lastLogin).format(
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
                        {fundManagerDetails?.businessAddress}
                      </Text>
                      <Flex mb="10px" alignItems="center">
                        <IconContainer color="#12355A" rounded="100%">
                          <Location fill="#12355A" />
                        </IconContainer>

                        <Text
                          lineHeight="18px"
                          fontSize={["14px", "15px", "16px", "17px"]}
                        >
                          {fundManagerDetails?.businessAddress}
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
              return <Cards cardDetail={item} width="300px" key={item.name} />;
            })}
          </Flex>

          <Box
            bgColor="rgba(245, 133, 44, 0.04)"
            borderRadius="8px"
            mt="5px"
            p="20px 40px"
          >
            <Text as="h3" color="#666666" fontWeight="600" mb="24px">
              PENDING PROJECT
            </Text>

            {pendingProjects.length > 0 ? (
              <HStack spacing="24px" mb="24px" wrap="wrap">
                {pendingProjects.map((pendingProject) => {
                  return (
                    <Box key={pendingProject.id} width="346px">
                      <Box
                        width="346px"
                        backgroundImage={
                          pendingProject?.image || defaultProjectImage
                        }
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
                        to={`/super-admin/fund-managers/project/${pendingProject.id}`}
                        color="secondary"
                        fontSize="12px"
                        fontWeight="600"
                        mb="4px"
                        textTransform="uppercase"
                      >
                        {pendingProject?.title}
                      </Link>
                      <Box fontSize="12px" color="#666666">
                        <TruncateWordCount count={400}>
                          {pendingProject?.description}
                        </TruncateWordCount>
                      </Box>
                    </Box>
                  );
                })}
              </HStack>
            ) : (
              <EmptyState>
                <Text fontWeight={"500"} fontSize={"24px"} lineHeight={"36px"}>
                  No pending projects
                </Text>
              </EmptyState>
            )}

            <Text as="h3" color="#666666" fontWeight="600" mb="24px">
              ACTIVE PROJECT
            </Text>

            {activeProjects.length > 0 ? (
              <HStack spacing="24px" mb="24px" wrap="wrap">
                {activeProjects.map((activeProject) => {
                  return (
                    <Box key={activeProject.id}>
                      <Box
                        width="346px"
                        backgroundImage={
                          activeProject?.image || defaultProjectImage
                        }
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
                        to={`/super-admin/fund-managers/project/${activeProject.id}`}
                        color="secondary"
                        fontSize="12px"
                        fontWeight="600"
                        mb="4px"
                        textTransform="uppercase"
                      >
                        {activeProject?.title}
                      </Link>
                      <Box fontSize="12px" color="#666666">
                        <TruncateWordCount count={400}>
                          {activeProject?.description}
                        </TruncateWordCount>
                      </Box>
                    </Box>
                  );
                })}
              </HStack>
            ) : (
              <EmptyState>
                <Text fontWeight={"500"} fontSize={"24px"} lineHeight={"36px"}>
                  No active projects
                </Text>
              </EmptyState>
            )}
            <Text as="h3" color="#666666" fontWeight="600" mb="24px">
              COMPLETED PROJECT
            </Text>

            {completedProjects.length > 0 ? (
              <HStack spacing="24px" mb="24px" wrap="wrap">
                {completedProjects.map((completedProject) => {
                  return (
                    <Box key={completedProject.id}>
                      <Box
                        width="346px"
                        backgroundImage={
                          completedProject?.image || defaultProjectImage
                        }
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
                        to={`/super-admin/fund-managers/project/${completedProject.id}`}
                        color="secondary"
                        fontSize="12px"
                        fontWeight="600"
                        mb="4px"
                        textTransform="uppercase"
                      >
                        {completedProject?.title}
                      </Link>
                      <Box fontSize="12px" color="#666666">
                        <TruncateWordCount count={400}>
                          {completedProject?.description}
                        </TruncateWordCount>
                      </Box>
                    </Box>
                  );
                })}
              </HStack>
            ) : (
              <EmptyState>
                <Text fontWeight={"500"} fontSize={"24px"} lineHeight={"36px"}>
                  No completed projects
                </Text>
              </EmptyState>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
