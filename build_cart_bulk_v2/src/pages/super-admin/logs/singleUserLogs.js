import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import EmptyState from "../../../components/EmptyState";
import Input from "../../../components/Input";
import BaseTable from "../../../components/Table";
import DashboardWrapper from "../../../layouts/dashboard";
import { useGetLogsForASpecificUserQuery } from "../../../redux/api/super-admin/superAdminSlice";
import { addTransparency } from "../../../utility/helpers";

const tableColumns = ["S/N", "LOG DATE", "ACTIVITY"];

const SuperAdminSingleUserLogs = () => {
  const { userId } = useParams();
  const { data, isLoading } = useGetLogsForASpecificUserQuery({ userId });

  const [userLogs, setUserLogs] = useState([]);
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    if (!data || !data.data) return;

    if (data.data.length < 1) return;
    const member = data.data[0].teamMember;

    const mapped = data.data.map((d, index) => {
      const { activityTitle, createdAt } = d;
      const [date, time] = new Intl.DateTimeFormat("en-ng", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "GMT",
      })
        .format(new Date(createdAt))
        .split(", ");

      return {
        "S/N": index < 9 ? `0${index + 1}` : `${index + 1}`,
        "LOG DATE": time,
        ACTIVITY: <Text ml={"-24px"}>{activityTitle}</Text>,
      };
    });

    setUserLogs(mapped);

    setMemberData(member);
  }, [data]);

  return (
    <DashboardWrapper pageTitle="Activity Logs">
      <Box>
        <Flex
          justify={"space-between"}
          align={"center"}
          gap={"24px"}
          wrap={"wrap"}
        >
          <Flex gap={"16px"} alignItems={"center"} flexShrink={0}>
            <Avatar
              height={"80px"}
              width={"80px"}
              name={memberData?.name}
              color={"#fff"}
              backgroundColor={"secondary"}
            />
            <Flex direction={"column"} alignContent={"space-between"}>
              <Text
                color={"secondary"}
                fontSize={"24px"}
                fontWeight={600}
                lineHeight={1.5}
              >
                {memberData?.name}
              </Text>

              <Text color={"#333333"}>
                {memberData?.userType.split("_").join(" ")}
              </Text>
            </Flex>
          </Flex>

          <Box width={"100%"} maxWidth={"360px"}>
            <Input leftIcon={<FaSearch />} />
          </Box>
        </Flex>

        <Box
          mt={"16px"}
          backgroundColor={addTransparency("#F5852C", 0.08)}
          p={"12px"}
          borderRadius={"8px"}
        >
          <Box backgroundColor={"white"} borderRadius={"8px"}>
            <BaseTable
              tableColumn={tableColumns}
              tableBody={userLogs}
              isLoading={isLoading}
              empty={
                <EmptyState>
                  <Box my={"5rem"}>
                    <Text>User has no logs</Text>
                  </Box>
                </EmptyState>
              }
            />
          </Box>
        </Box>
      </Box>
    </DashboardWrapper>
  );
};
export default SuperAdminSingleUserLogs;
