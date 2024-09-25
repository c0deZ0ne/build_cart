import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../layouts/dashboard";
import { Box, Flex, HStack, useDisclosure, Text } from "@chakra-ui/react";
import Button from "../../../components/Button";
import cardPattern from "../../../assets/images/card-pattern.svg";
import TopCards from "./components/TopCards";
import Input from "../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import BaseTable from "../../../components/Table";
import Badge from "../../../components/Badge/Badge";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom/cjs/react-router-dom";
import {
  useGetProjectsQuery,
  useGetProjectsStatQuery,
} from "../../../redux/api/builder/projectSlice";
import EmptyState from "../../../components/EmptyState";
import { weeksDiff } from "../../../utility/helpers";
import moment from "moment";
import CreateProject from "./modals/createProject";

export default function BuilderCompanyProject() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tableColumn = [
    "S/N",
    "PROJECT NAME",
    "LOCATION",
    "DURATION",
    "BIDS",
    "STATUS",
    "DATE CREATED",
    "ACTION",
  ];

  const [search, setSearch] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [allProjects, setAllProjects] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [pendingProjects, setPendingProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [transactions, setTransactions] = useState(0);

  const projectTabs = [
    {
      name: "All Projects",
      type: "all",
      status: "all",
      quantity: allProjects,
      description:
        "This includes all the projects your company is funding, whether they are ongoing, pending, or completed.",
      color: "#F5852C",
    },
    {
      name: "Active Projects",
      type: "active",
      status: "active",
      quantity: activeProjects,
      description:
        "Active Projects are the projects your company is currently executing.",
      color: "#12355A",
    },
    {
      name: "Pending Projects",
      type: "pending",
      status: "pending",
      quantity: pendingProjects,
      description:
        "These are all the projects that are yet to be executed by your company.",
      color: "#E8B113",
    },
    {
      name: "Completed Projects",
      type: "completed",
      status: "completed",
      quantity: completedProjects,
      description:
        "This is the total number of projects that have been completed by your company.",
      color: "#1C903D",
    },
    {
      name: "Transaction Resolution",
      type: "transaction",
      status: "transaction",
      quantity: transactions,
      description:
        "These are all the projects experiencing problems or disputes.",
      color: "#5937A0",
    },
  ];

  const { data: projects = null, isLoading, refetch } = useGetProjectsQuery();
  const { data: projectStat = null, refetch: reloadStat } =
    useGetProjectsStatQuery();

  const reloadData = () => {
    refetch();
    reloadStat();
  };

  const [refinedProjects, setRefinedProject] = useState([]);

  useEffect(() => {
    if (projects && projectStat) {
      const adjustedProjects = projects.data.map((project, index) => {
        return {
          SN: `${(index + 1).toString().length < 2 ? 0 : ""}${index + 1}`,
          title: project?.Project?.title,
          location: project?.Project?.location,
          duration:
            weeksDiff(project?.Project?.startDate, project?.Project?.endDate) +
            " weeks",
          bids: "No data",
          status: <Badge status={project?.Project?.status} />,
          dateCreated: moment(project?.Project?.createdAt).format("DD-MM-YYYY"),
          action: (
            <Link
              to={`/builder/company-project/details/${project?.Project?.id}`}
            >
              <Flex align="center" cursor="pointer" color="#12355A">
                View <IoIosArrowForward />
              </Flex>
            </Link>
          ),
          id: project?.Project?.id,
        };
      });
      setRefinedProject(adjustedProjects);
      setAllProjects(projectStat.data.allProjects);
      setActiveProjects(projectStat.data.activeProjects);
      setPendingProjects(projectStat.data.pendingProjects);
      setCompletedProjects(projectStat.data.completedProjects);
      setTransactions(projectStat.data.transactionResolutionProjects);
    }
  }, [projects, projectStat]);

  function searchTable() {
    const searchResult = refinedProjects.filter((el) => {
      return (
        el?.title?.toLowerCase().match(search.toLowerCase()) ||
        el?.location?.toLowerCase().match(search.toLowerCase())
      );
    });

    return searchResult;
  }

  return (
    <DashboardWrapper pageTitle="Project">
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
            <Box as="span" color="#F5852C" fontWeight="600">
              Company
            </Box>{" "}
            Projects
          </Box>
          <Text fontSize="14px">
            Your company or organization finances and carries out these
            projects.
          </Text>
        </Box>
        <Box>
          <Button
            type="button"
            fontWeight="600"
            width={{ base: "180px", md: "242px" }}
            onClick={onOpen}
          >
            Create a Project!
          </Button>
        </Box>
      </Flex>
      <HStack spacing="24px" w="100%" direction="column" flexWrap="wrap">
        {projectTabs.map((el) => {
          return (
            <TopCards
              cardDetail={el}
              cardPattern={cardPattern}
              key={el.status}
              setActiveCard={setActiveCard}
              activeCard={activeCard}
            />
          );
        })}
      </HStack>

      {searchTable().length === 0 && !isLoading ? (
        <Box
          boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
          borderRadius="8px"
          mt="40px"
          bg="#fff"
        >
          <EmptyState>
            <Text>
              Your company has no{" "}
              <Text as="span" color="#12355A">
                current projects
              </Text>
              . All projects created and funded by your company will be shown
              here. To create your first project, click the "
              <Text as="span" color="#F5852C">
                Create a Project
              </Text>
              " button in the upper right corner of your screen.
            </Text>
          </EmptyState>
        </Box>
      ) : (
        <Box
          bg="rgba(245, 133, 44, 0.04)"
          p="40px 24px"
          borderRadius="8px"
          my="30px"
        >
          <Flex
            justifyContent="space-between"
            direction={["column", "column", "row"]}
            align={["flex-start", "flex-start", "center"]}
            mb="24px"
          >
            <Box>
              <Box as="h3" color="secondary" fontSize="24px" fontWeight="600">
                Company Projects
              </Box>
              <Text color="primary" fontSize="14px">
                This table shows the list of all your{" "}
                {activeCard === "All Projects" ? "Projects." : activeCard}.
              </Text>
            </Box>
            <Box w={{ base: "100%", md: "462px" }}>
              <Input
                placeholder="Search for Project name, location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<RiSearch2Line />}
              />
            </Box>
          </Flex>
          <BaseTable
            tableColumn={tableColumn}
            tableBody={searchTable()}
            isLoading={isLoading}
          />
        </Box>
      )}

      <CreateProject isOpen={isOpen} onClose={onClose} refetch={reloadData} />
    </DashboardWrapper>
  );
}
