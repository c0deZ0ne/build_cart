import {
  Box,
  Flex,
  Grid,
  GridItem,
  ListItem,
  SimpleGrid,
  Spinner,
  Text,
  UnorderedList,
  VStack,
  Progress,
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
import BaseTable from "../../../../components/Table";
import Badge from "../../../../components/Badge/Badge";
import instance from "../../../../utility/webservices";
import { handleError } from "../../../../utility/helpers";

export default function VendorProfile({ vendor, setProfileOpen }) {
  const [vendorDetails, setVendorDetails] = useState({});
  const [projectData, setProjectData] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [kycPercentage, setKycPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVendor = async () => {
    setIsLoading(true);
    try {
      const { data } = await instance(`/superAdmin/vendors/${vendor?.id}`);
      console.log(data);
      if (data) {
        setVendorDetails(data?.data?.vendor);

        const orderList = data?.data?.vendor?.orders.map((order, index) => {
          return {
            SN: `${(index + 1).toString().length < 2 ? 0 : ""}${index + 1}`,
            vendorName: data?.data?.owner?.name,
            builderName: order?.Builder?.businessName,
            itemName: order?.RfqRequestMaterial?.name,
            quantity: order?.RfqRequestMaterial?.quantity,
            amount: Intl.NumberFormat().format(order?.Contract?.totalCost ?? 0),
            deliveryDate: moment(order?.deliveryDate || "").format(
              "DD-MM-YYYY"
            ),
            status: <Badge status={order?.status} />,
          };
        });

        setOrders(orderList);

        const proData = [
          {
            name: "Lifetime Expenditure",
            quantity: data?.data?.lifetimeEarnings || 0,
            icon: <WalletPlus fill="#12355A" />,
            isCurrency: true,
          },
          {
            name: "Ongoing Expenditure",
            quantity: data?.data?.ongoingDelivery || 0,
            icon: <WalletPlus fill="#12355A" />,
            isCurrency: true,
          },
          {
            name: "Vault Balance",
            quantity: data?.data?.vaultBalance || 0,
            icon: <WalletPlus fill="#12355A" />,
            isCurrency: true,
            bg: "#1C903D",
          },
        ];
        setProjectData(proData);

        const businessAddress = data?.data?.vendor?.businessAddress;
        const businessRegNo = data?.data?.vendor?.businessRegNo;
        const businessSize = data?.data?.vendor?.businessSize;
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
    if (vendor) {
      fetchVendor(false);
    }
  }, [vendor]);

  const orderColumn = [
    "S/N",
    "VENDOR NAME",
    "BUILDER NAME",
    "ITEM NAME",
    "QUANTITY",
    "AMOUNT (₦)",
    "DELIVERY DATE",
    "STATUS",
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
                backgroundImage={vendorDetails?.logo || defaultProjectImage}
                bgRepeat="no-repeat"
                bgColor="#fff"
                height={["150px", "150px", "150px", "100%"]}
                rounded="8px"
                bgSize="cover"
              ></Box>
              <Box width={["100%", "100%", "100%", "60%"]} color="#fff">
                <Text fontSize="32px">{vendorDetails?.businessName}</Text>
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
                  Vendor
                </Box>
                <Text mb="10px" fontSize="12px" fontWeight="600">
                  Info
                </Text>
                <Box fontSize="14px">
                  <TruncateWordCount count={400}>
                    {vendorDetails?.about}
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
                        {vendorDetails?.email && (
                          <Flex alignItems="center">
                            <Message fill="#12355A" width="16" height="16" />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {vendorDetails?.email}
                            </Text>
                          </Flex>
                        )}

                        {vendorDetails?.phone && (
                          <Flex alignItems="center">
                            <FaPhone fontSize="16px" />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {vendorDetails?.phone}
                            </Text>
                          </Flex>
                        )}

                        {vendorDetails?.contactPhone && (
                          <Flex alignItems="center">
                            <FaPhone />
                            <Text color="#999" as="span" ml={2} fontSize="12px">
                              {vendorDetails?.contactPhone}
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
                        {moment(vendorDetails?.lastLogin).format(
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
                        {vendorDetails?.businessAddress}
                      </Text>
                      <Flex mb="10px" alignItems="center">
                        <IconContainer color="#12355A" rounded="100%">
                          <Location fill="#12355A" />
                        </IconContainer>

                        <Text
                          lineHeight="18px"
                          fontSize={["14px", "15px", "16px", "17px"]}
                        >
                          {vendorDetails?.businessAddress}
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
              return (
                <Cards
                  cardDetail={item}
                  key={JSON.stringify(item)}
                  width="300px"
                />
              );
            })}
          </Flex>
          <Box mt="40px">
            <Text color="secondary" fontSize="20px" fontWeight="600" mb="20px">
              Order Delivery History
            </Text>
            <BaseTable tableColumn={orderColumn} tableBody={orders} />
          </Box>
        </>
      )}
    </Box>
  );
}
