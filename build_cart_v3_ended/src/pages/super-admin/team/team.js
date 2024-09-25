import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import Button from "../../../components/Button";
import Cards from "../../../components/Cards/Cards";
import TeamIcon from "../../../components/Icons/Team";
import Input from "../../../components/Input";
import DashboardWrapper from "../../../layouts/dashboard";
import { useGetTeamMembersQuery } from "../../../redux/api/super-admin/superAdminSlice";
import { userData } from "../../../redux/store/store";
import TeamMembersListTable from "./components/TeamMembersListTable";
import AddTeamMemberForm from "./components/addTeamMemberForm";

export default function SuperAdminTeam() {
  const userInfo = useSelector(userData);
  const [search, setSearch] = useState("");
  const teamId = userInfo.data.teams[0].id;
  const [membersData, setMembersData] = useState([]);
  const [teamMembersCount, setTeamMembersCount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, refetch } = useGetTeamMembersQuery({
    teamId: teamId,
  });

  useEffect(() => {
    if (!data || !data.data) return;

    const teamMembers = data.data.team.teamMembers.rows;
    const count = data.data.team.teamMembers.count;

    setMembersData(teamMembers);
    setTeamMembersCount(count);
  }, [data]);

  const titleCard = {
    name: "Team Count",
    icon: <TeamIcon fill="#12355A" opacity="1" />,
    quantity: teamMembersCount,
  };

  return (
    <DashboardWrapper pageTitle="Team">
      <Flex justify="space-between" mb="24px">
        <Cards cardDetail={titleCard} width="342px" h="128px" />
        <Box>
          <Button
            type="button"
            fontWeight="600"
            width={{ base: "180px", md: "242px" }}
            background="#F5852C"
            onClick={onOpen}
          >
            Create Team Member
          </Button>
        </Box>
      </Flex>

      <Box bgColor="rgba(245, 133, 44, 0.04)" pt="16px" px="12px">
        <Flex align="center" justify="space-between" gap={"24px"} wrap={"wrap"}>
          <Box mb={{ base: "10px", md: "0px" }}>
            <Box
              as="h3"
              fontSize={{ base: "18px", md: "24px" }}
              fontWeight="600"
              mb="3px"
              color="#F5852C"
            >
              Team
            </Box>
            <Text fontSize="14px">
              This table contains the list of all your Team Members. You can
              edit, pause or delete if you have Super Admin permission
            </Text>
          </Box>
          <Box w={{ base: "100%", md: "462px" }} ml="auto" mb="24px">
            <Input
              placeholder="Search team"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Box>
        </Flex>
        <Box bg="#fff" borderRadius="8px" my="30px">
          <TeamMembersListTable
            setCount={setTeamMembersCount}
            teamMembers={membersData}
            teamId={teamId}
            refetch={refetch}
            isLoading={isLoading}
          />
        </Box>
      </Box>

      {isOpen && (
        <AddTeamMemberForm
          action="add"
          isOpen={isOpen}
          onClose={onClose}
          key={isOpen}
          refetch={refetch}
        />
      )}
    </DashboardWrapper>
  );
}
