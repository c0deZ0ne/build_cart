import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  SimpleGrid,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { Link as RouterLink } from "react-router-dom";
import faq from "../../assets/images/faq.svg";
import support from "../../assets/images/support.svg";
import Button from "../../components/Button";
import Cards from "../../components/Cards/Cards";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import EmptyState from "../../components/EmptyState";
import Balance from "../../components/Icons/Balance";
import ListIcon from "../../components/Icons/List";
import Naira from "../../components/Icons/Naira";
import UserOctagon from "../../components/Icons/UserOctagon";
import Vault from "../../components/Icons/Vault";
import WalletMinus from "../../components/Icons/WalletMinus";
import WalletPlus from "../../components/Icons/WalletPlus";
import Popup from "../../components/Popup/Popup";
import BaseTable from "../../components/Table";
import { useTawkMessenger } from "../../context/TawkMessengerContext";
import DashboardWrapper from "../../layouts/dashboard";
import CreateProject from "./projects/modals/createProject";
import { useGetProjectsQuery } from "../../redux/api/fundManager/projectSlice";
import {
  useGetDashboardProjectCostQuery,
  useGetDashboardQuery,
} from "../../redux/api/fundManager/fundManager";
import SubscriptionModal from "../../layouts/onboardingModals/subscriptionModal";
import CountDownModal from "../../components/Modals/CountDownModal";
import { useDispatch, useSelector } from "react-redux";
import { showCountDownTimer } from "../../redux/features/subscription/subscriptionSlice";
import { useQueryParams } from "../../hook/useQueryParams";
import PaymentWalletModal from "../../components/Modals/PaymentWalletModal";

ChartJS.register(ArcElement, Tooltip);

export default function FundManagerDashboard() {
  const { handleMaximize } = useTawkMessenger();
  const [dashboard, setDashboard] = useState(null);
  const [projectCost, setProjectCosts] = useState([]);
  const [projects, setProjectTable] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const query = useQueryParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { isSubscribe, showSubscriptionCounter, userType, firstLogin } =
    userInfo;
  const { showSubscriptionTimer, interval } = useSelector(
    (state) => state.subscription,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: fundIsOpen,
    onOpen: fundOnOpen,
    onClose: fundOnClose,
  } = useDisclosure();
  const {
    isOpen: isOpenSubscription,
    onOpen: onOpenSubscription,
    onClose: onCloseSubscription,
  } = useDisclosure();
  const [projectCostFilter, setProjectCostFilter] = useState({
    value: 7,
    label: "Last 7 days",
  });

  const projectCostOptions = [
    {
      value: 7,
      label: "Last 7 days",
    },
    {
      value: 30,
      label: "Last 30 days",
    },
    {
      value: 60,
      label: "Last 60 days",
    },
    {
      value: 90,
      label: "Last 90 days",
    },
  ];

  const checkProjectCost = projectCost.some((cost) => cost > 0);

  const { data: allProjects } = useGetProjectsQuery();
  const { data: overview = null, isLoading, refetch } = useGetDashboardQuery();
  const { data: projectCosts } = useGetDashboardProjectCostQuery(
    projectCostFilter.value,
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(showCountDownTimer());
    }, interval);

    return () => clearInterval(intervalId);
  }, [showSubscriptionTimer]);

  useEffect(() => {
    if (firstLogin) {
      query.get("welcome") === "subscription" && setOpen(true);
    }
    if (overview) {
      setDashboard(overview.data);
      const projectTable = overview?.data?.activeProjects?.map((proj, i) => {
        return {
          image: (
            <Avatar
              bg="secondary"
              size="sm"
              name={proj?.project?.title}
              src=""
            />
          ),
          projectName: proj?.project?.title,
          location: proj?.project?.location,
          budget: proj?.project?.budgetAmount,
          action: (
            <Link
              as={RouterLink}
              to={`/fund-manager/project/details/${proj?.project?.id}`}
            >
              <Flex align="center" cursor="pointer" color="#12355A">
                View <IoIosArrowForward />
              </Flex>
            </Link>
          ),
        };
      });
      setProjectTable(projectTable);
    }
  }, [overview, allProjects, firstLogin]);

  useEffect(() => {
    if (projectCostFilter && projectCosts) {
      const proCosts = projectCosts?.data.projectCost || {};
      const costs = Object.keys(proCosts)
        .map(function (k) {
          return proCosts[k];
        })
        .map((el) => {
          return el.total;
        });
      setProjectCosts(costs);
    }
  }, [projectCostFilter, projectCosts]);

  const tableColumn = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="20px" /> },
    { name: "PROJECT NAME", icon: <ListIcon color="#fff" fontSize="14px" /> },
    { name: "LOCATION", icon: <FaLocationDot color="#fff" fontSize="14px" /> },
    { name: "BUDGET (₦)" },
    "ACTION",
  ];

  const data = {
    labels: ["Budget", "Spend", "Savings"],
    datasets: [
      {
        data: projectCost,
        backgroundColor: ["#074794", "#EE4124", "#1C903D"],
        borderWidth: 0,
        hoverBorderJoinStyle: "round",
      },
    ],
  };
  const chartOptions = {
    plugins: {
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        bodyColor: "#333",
        titleColor: "#333",
        displayColors: false,
        enabled: true,
        borderWidth: 1,
        borderColor: "#333",
        xAlign: "left",
        callbacks: {
          title: function (context) {
            return "Total " + context[0].label;
          },
          label: function (context) {
            return new Intl.NumberFormat().format(context.raw);
          },
        },
        titleFont: {
          size: "12px",
          weight: "500",
        },
        bodyFont: {
          size: "16px",
          weight: "600",
        },
      },
    },
  };

  const storedUser = localStorage.getItem("userInfo");
  const user = JSON.parse(storedUser);

  const projectTabs = [
    {
      name: "Active Projects",
      quantity: dashboard?.projectData?.activeProjectCount || 0,
      icon: <WalletPlus fill="#12355A" />,
      info: true,
      bg: "#12355A",
      description:
        "This shows the total number of active projects managed by you.",
    },
    {
      name: "Pending Projects",
      quantity: dashboard?.projectData?.pendingProjectCount || 0,
      icon: <WalletMinus fill="#12355A" />,
      info: true,
      bg: "#EE4124",
      description:
        "This shows the total number of unawarded projects created by you.",
    },
    {
      name: "Completed Projects",
      quantity: dashboard?.projectData?.completedProjectCount || 0,
      icon: <Balance opacity="1" fill="#12355A" />,
      info: true,
      bg: "#1C903D",
      description:
        "The shows the total number of projects completed on this platform.",
    },
  ];

  const [isBetween992and1260] = useMediaQuery(
    "(min-width: 992px) and (max-width: 1260px)",
  );

  return (
    <DashboardWrapper pageTitle="Overview">
      <Flex
        justifyContent="space-between"
        align="center"
        mb="20px"
        flexWrap="wrap"
        spacing="10px"
      >
        <Box mb={{ base: "10px", md: "0px" }}>
          <Box
            as="h3"
            fontSize={{ base: "18px", md: "24px" }}
            fontWeight="500"
            mb="3px"
          >
            Welcome,{" "}
            <Box as="span" color="#F5852C" fontWeight="600">
              {user?.userName}!
            </Box>
          </Box>
          <Text fontSize="14px">Monitor your project activities easily.</Text>
        </Box>
        <Box>
          <Button
            type="button"
            fontWeight="600"
            width={{ base: "180px", md: "242px" }}
            onClick={onOpen}
            disabled={!isSubscribe}
          >
            Create a Project!
          </Button>
        </Box>
      </Flex>
      <Box as="h4" color="secondary" fontWeight="600" mb="16px">
        All ongoing project cost
      </Box>
      <Grid
        templateRows={[
          "repeat(2, 1fr)",
          "repeat(2, 1fr)",
          "repeat(2, 1fr)",
          "repeat(2, 2fr)",
        ]}
        templateColumns="repeat(18, 2fr)"
        gap={4}
        mb={5}
      >
        {projectTabs?.map((el, index) => (
          <GridItem
            colSpan={[18, 9, 6, isBetween992and1260 ? 6 : 4]}
            h={["160px", "235px"]}
            rowSpan={3}
            key={index}
          >
            <Cards
              cardDetail={el}
              h="100%"
              absolute={true}
              bottom="38px"
              bottomFontSize="28px"
            />
          </GridItem>
        ))}{" "}
        <GridItem
          rowSpan={2}
          colSpan={[18, 9, 9, isBetween992and1260 ? 18 : 6]}
        >
          <Box
            bg="#fff"
            boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
            border="1px solid #F0F1F1"
            borderLeft="5px solid #12355A"
            borderRadius="4px"
            p="16px 20px"
            minH={["160px", "235px"]}
          >
            <Flex align="center" justify="space-between" w="100%">
              <Flex align="center" mr="8px">
                <Flex
                  justifyContent="center"
                  align="center"
                  w="40px"
                  h="40px"
                  borderRadius="100%"
                  bg="#12355A29"
                  mr="8px"
                >
                  <Vault opacity="1" fill="#12355A" />
                </Flex>
                <Text
                  mr="auto"
                  fontSize="14px"
                  fontWeight="600"
                  color="primary"
                >
                  Account
                </Text>
              </Flex>

              <Popup info="This is the total amount of money available in your Cutstruct account" />
            </Flex>
            {dashboard?.userBalance > 0 ? (
              <Box py={5}>
                <Text
                  fontSize={{ lg: "20px", xl: "16px" }}
                  color="#333"
                  mb="6px"
                  fontWeight="500"
                >
                  Balance
                </Text>
                <Flex
                  align="center"
                  fontSize={{ sm: "24px", lg: "20px", xl: "24px" }}
                  fontWeight="700"
                  color="#333"
                  mb="8px"
                >
                  <Naira />{" "}
                  {new Intl.NumberFormat().format(dashboard?.userBalance || 0)}
                </Flex>
              </Box>
            ) : (
              <EmptyState
                py="5px"
                md="100%"
                icon={
                  <Vault
                    opacity="0.56"
                    fill="#999999"
                    width="40px"
                    height="40px"
                  />
                }
              >
                <Text fontSize="14px" fontWeight="500">
                  You haven't{" "}
                  <Text as="span" color="primary">
                    deposited money
                  </Text>{" "}
                  into your account yet. To add funds, click on the "
                  <Text as="span" color="secondary">
                    Add Funds
                  </Text>
                  " button below.
                </Text>
              </EmptyState>
            )}
            <Box ml="auto" w="fit-content">
              <Button
                background="#F5852C"
                size="md"
                width="166px"
                onClick={fundOnOpen}
                disabled={!isSubscribe}
              >
                Add Funds
              </Button>
            </Box>
          </Box>
        </GridItem>
      </Grid>
      <SimpleGrid
        h="auto"
        templateRows="1fr"
        templateColumns="repeat(7, 1fr)"
        gap={{ base: "24px", md: "24px", lg: "26px" }}
        mb="30px"
      >
        <GridItem colSpan={[7, 7, 4, 4]}>
          <Box
            borderRadius="8px"
            border="1px solid #F0F1F1"
            bgColor="#fff"
            boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
            h="100%"
            p="24px"
          >
            {projects?.length === 0 ? (
              <EmptyState>
                <Text fontWeight="500" fontSize={{ base: "14px", md: "20px" }}>
                  You haven't created any{" "}
                  <Text as="span" color="primary">
                    project
                  </Text>{" "}
                  yet. To create your first project, click the "
                  <Text as="span" color="secondary">
                    Create a Project
                  </Text>
                  " button in the upper right corner of your screen.
                </Text>
              </EmptyState>
            ) : (
              <>
                <Flex
                  align="center"
                  justify="space-between"
                  borderBottom="1px solid #F0F1F1"
                  pb="24px"
                  mb="24px"
                >
                  <Text fontWeight="600" color="secondary">
                    Active Projects
                  </Text>
                  <Link
                    as={RouterLink}
                    to="/builder/company-project"
                    borderRadius="4px"
                    bgColor="rgba(18, 53, 90, 0.08)"
                    p="11px 32px"
                    fontWeight="500"
                    _hover={{
                      textDecoration: "unset",
                    }}
                  >
                    View all
                  </Link>
                </Flex>
                <BaseTable
                  tableColumn={tableColumn}
                  tableBody={projects}
                  isLoading={isLoading}
                />
              </>
            )}
          </Box>
        </GridItem>
        <GridItem colSpan={[7, 7, 3, 3]} h="fit-content">
          <Box
            borderRadius="8px"
            border="1px solid #F0F1F1"
            bgColor="#fff"
            boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
            h={{ base: "", md: "100%" }}
            p="24px"
          >
            <Box>
              <Flex
                align="center"
                justify="space-between"
                borderBottom="1px solid #F0F1F1"
                pb="24px"
                mb="24px"
              >
                <Text fontWeight="600" color="secondary">
                  Project Cost
                </Text>
                <CustomSelect
                  options={projectCostOptions}
                  onChange={setProjectCostFilter}
                  value={projectCostFilter}
                  placeholder="Filter"
                />
              </Flex>
              <Flex
                align="center"
                justify="space-between"
                maxW="296px"
                maxH="296px"
                mx="auto"
              >
                {!checkProjectCost ? (
                  <EmptyState md="100%">
                    <Text
                      fontWeight="500"
                      fontSize={{ base: "14px", md: "20px" }}
                    >
                      <Text as="span" color="primary">
                        No transactions
                      </Text>{" "}
                      have been made yet. Your{" "}
                      <Text as="span" color="secondary">
                        expense report{" "}
                      </Text>
                      will appear here once you've initiated your first
                      transaction.
                    </Text>
                  </EmptyState>
                ) : (
                  <Doughnut data={data} options={chartOptions} />
                )}
              </Flex>
              <Flex
                align="center"
                justify="space-around"
                borderTop="1px solid #F0F1F1"
                pt="33px"
                mt="30px"
              >
                <Flex align="center">
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="100%"
                    bgColor="#074794"
                    mr="8px"
                  ></Box>
                  <Text fontSize="14px">Budget</Text>
                </Flex>
                <Flex align="center">
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="100%"
                    bgColor="#EE4124"
                    mr="8px"
                  ></Box>
                  <Text fontSize="14px">Spend</Text>
                </Flex>
                <Flex align="center">
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="100%"
                    bgColor="#1C903D"
                    mr="8px"
                  ></Box>
                  <Text fontSize="14px">Variance</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </GridItem>
      </SimpleGrid>
      <Flex gap={8} fontSize="15px" wrap="wrap">
        <Flex
          borderRadius="8px"
          bgColor="#fff"
          boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
          p="40px 32px"
          maxW={["100%", "100%", "100%", isBetween992and1260 ? "100%" : "45%"]}
        >
          <Flex
            justifyContent="center"
            align="center"
            minW="56px"
            minH="56px"
            maxH="56px"
            borderRadius="100%"
            bg="rgba(18, 53, 90, 0.08)"
            mr="8px"
          >
            <Image src={support} />
          </Flex>
          <Box>
            <Text
              as="h3"
              mb="8px"
              fontSize={{ base: "18px", md: "24px" }}
              color="primary"
              fontWeight="500"
            >
              Cutstruct{" "}
              <Text as="span" color="secondary">
                Support Centre
              </Text>
            </Text>
            <Text color="#333" fontSize={{ base: "14px", md: "16px" }}>
              Having difficulty on the platform?{" "}
              <Box
                as="button"
                fontWeight="600"
                color="secondary"
                onClick={handleMaximize}
                _hover={{ textDecoration: "underline" }}
              >
                Click here
              </Box>{" "}
              to speak with a Cutstruct Customer Service Representative or Live
              Chat with your Account Assistant!
            </Text>
          </Box>
        </Flex>
        <Flex
          borderRadius="8px"
          bgColor="#fff"
          boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
          p="40px 32px"
          maxW={["100%", "100%", "100%", isBetween992and1260 ? "100%" : "45%"]}
        >
          <Flex
            justifyContent="center"
            align="center"
            minW="56px"
            minH="56px"
            maxH="56px"
            borderRadius="100%"
            bg="rgba(18, 53, 90, 0.08)"
            mr="8px"
          >
            <Image src={faq} />
          </Flex>
          <Box>
            <Text
              as="h3"
              mb="8px"
              fontSize={{ base: "18px", md: "24px" }}
              color="primary"
              fontWeight="500"
            >
              FAQs:{" "}
              <Text as="span" color="secondary">
                Do you have a question?
              </Text>
            </Text>
            <Text color="#333" fontSize={{ base: "14px", md: "16px" }}>
              Our{" "}
              <Link
                href="https://cutstruct.com/"
                isExternal
                target="_blank"
                color={"secondary"}
                textDecoration={"underline"}
              >
                {" "}
                knowledgebase{" "}
              </Link>{" "}
              has curated answers to help you make the best use of your
              Cutstruct Platform.
            </Text>
          </Box>
        </Flex>
      </Flex>
      <CreateProject isOpen={isOpen} onClose={onClose} refetch={refetch} />

      <PaymentWalletModal
        onOpen={fundOnOpen}
        onClose={fundOnClose}
        isOpen={fundIsOpen}
        refresh={refetch}
        title="Fund Account"
        description="Funded vault account"
        paymentPurpose={"FUND_WALLET"} // FUND_PROJECT_WALLET,FUND_WALLET,FUND_ORDER
      />

      {/* {open ? (
        <SubscriptionModal
          isOpen={isOpenSubscription}
          onOpen={onOpenSubscription}
          onClose={onCloseSubscription}
        />
      ) : (
        (userType === "FUND_MANAGER" || userType === "BUILDER") &&
        !isSubscribe && <CountDownModal />
      )} */}

      {open ? (
        <SubscriptionModal
          isOpen={isOpenSubscription}
          onOpen={onOpenSubscription}
          onClose={onCloseSubscription}
        />
      ) : (
        (userType === "FUND_MANAGER" || userType === "BUILDER") &&
        showSubscriptionCounter &&
        showSubscriptionTimer && <CountDownModal />
      )}
    </DashboardWrapper>
  );
}
