import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import EmptyState from "../../../components/EmptyState";
import UserOctagon from "../../../components/Icons/UserOctagon";
import Input from "../../../components/Input";
import BaseTable from "../../../components/Table";
import DashboardWrapper from "../../../layouts/dashboard";
import { useGetLogsQuery } from "../../../redux/api/super-admin/superAdminSlice";

export default function SuperAdminLogs() {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);

  const tableColumn = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
    "TEAM MEMBER NAME",
    "ROLE",
    "RECENT ACTIVITY",
    "LOG TIME",
    "LOG DATE",
    "ACTION",
  ];

  const { data, isLoading } = useGetLogsQuery();

  const tableData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((d) => {
      const { teamMember, activityTitle, createdAt } = d;

      const { name, userType } = teamMember;

      const [date, time] = new Intl.DateTimeFormat("en-ng", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "GMT",
      })
        .format(new Date(createdAt))
        .split(", ");

      return {
        "": "",
        "TEAM MEMBER NAME": name,
        ROLE: userType.split("_").join(" "),
        "RECENT ACTIVITY": activityTitle,
        "LOG TIME": time,
        "LOG DATE": date,
        ACTION: (
          <Link to={`/super-admin/logs/user/${teamMember.id}`}>
            <Flex align="center" cursor="pointer" color="#12355A">
              Activity Logs <IoIosArrowForward />
            </Flex>
          </Link>
        ),
      };
    });
  }, [data]);

  return (
    <DashboardWrapper pageTitle="Logs">
      <Box bgColor="rgba(245, 133, 44, 0.04)" py="16px" px="12px">
        <Flex
          align="center"
          justify="space-between"
          columnGap={"4rem"}
          rowGap={"32px"}
        >
          <Box mb={{ base: "10px", md: "0px" }}>
            <Box
              as="h3"
              fontSize={{ base: "18px", md: "24px" }}
              fontWeight="600"
              mb="3px"
              color="#F5852C"
            >
              User Logs
            </Box>
            <Text fontSize="14px">
              All activities recorded by team members on the platform is
              displayed here.
            </Text>
          </Box>
          <Box w={{ base: "100%" }} maxWidth={"320px"}>
            <Input
              placeholder="Search team"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Box>
        </Flex>
        <Box bg="#fff" borderRadius="8px" my="30px">
          <BaseTable
            tableColumn={tableColumn}
            tableBody={tableData}
            empty={
              <EmptyState>
                <Text>
                  There are no{" "}
                  <Text as="span" color="#F5852C">
                    logs
                  </Text>{" "}
                  on the platform.
                </Text>
              </EmptyState>
            }
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </DashboardWrapper>
  );
}
