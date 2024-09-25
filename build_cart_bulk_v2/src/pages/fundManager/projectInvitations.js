import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { HiClipboardList } from "react-icons/hi";
import { RiSearch2Line } from "react-icons/ri";
import Cards from "../../components/Cards/Cards";
import FundManagerProjectInvitationsList from "../../components/FundManager/FundManagerProjectInvitationsList";
import Input from "../../components/Input";
import DashboardWrapper from "../../layouts/dashboard";
import { addTransparency } from "../../utility/helpers";

/**
 *
 * @param {{count: number}} props
 * @returns
 */
const TopPart = ({ count }) => {
  return (
    <Cards
      cardDetail={{
        name: "All Invites",
        quantity: count,
        isCurrency: false,
        bg: "#12355A",
        icon: <HiClipboardList />,
      }}
    />
  );
};

const ProjectInvitations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [inviteCount, setInviteCount] = useState(0);

  return (
    <DashboardWrapper pageTitle="Project Invitation">
      <Box maxW={"360px"}>
        <TopPart count={inviteCount} />
      </Box>

      <Box
        mt={"40px"}
        p={"40px 24px"}
        borderRadius="8px"
        backgroundColor={addTransparency("#f5852c", 0.04)}
      >
        <Flex gap={"24px"} wrap={"wrap"}>
          <Box>
            <Text color={"primary"} fontWeight={600} fontSize={"20px"}>
              Project{" "}
              <Text as="span" color="secondary">
                Invitations
              </Text>
            </Text>
            <Text fontSize={"14px"} color={"primary"}>
              All invites from builders are displayed in the table below.
            </Text>
          </Box>

          <Spacer />

          <Flex align={"center"} gap={"24px"}>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Flex>
        </Flex>

        <Box mt={"32px"}>
          <FundManagerProjectInvitationsList setInviteCount={setInviteCount} />
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default ProjectInvitations;
