import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { RiSearch2Line } from "react-icons/ri";
import FundManagersList from "../../../components/Builder/FundManagers/FundManagersList";
import InviteFundManagerFormModal from "../../../components/Builder/FundManagers/InviteFundManagerFormModal";
import Button from "../../../components/Button";
import Cards from "../../../components/Cards/Cards";
import Input from "../../../components/Input";
import DashboardWrapper from "../../../layouts/dashboard";
import { useGetProjectsQuery } from "../../../redux/api/builder/projectSlice";
import { addTransparency } from "../../../utility/helpers";

export default function BuilderFundManager() {
  const [openInviteFundManager, setOpenInviteFundManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fundManagerCount, setFundManagerCount] = useState(0);

  const { data: projects } = useGetProjectsQuery();

  const projectsData = useMemo(() => {
    if (!projects) return [];

    return projects.data.map((p) => {
      return {
        name: p.Project.title,
        id: p.ProjectId,
      };
    });
  }, [projects]);

  const [renderKey, setRenderKey] = useState(true);

  return (
    <DashboardWrapper pageTitle="Fund Manager">
      <Flex justifyContent={"space-between"} wrap={"wrap"} gap={"1rem"}>
        <Cards
          cardDetail={{
            name: "Fund Managers",
            quantity: fundManagerCount,
            isCurrency: false,
            bg: "#12355A",
            icon: <HiUsers />,
            info: true,
            description: "Total number of fund managers working with you.",
          }}
        />

        <Button onClick={() => setOpenInviteFundManager(true)}>
          Invite Fund Manager
        </Button>
      </Flex>

      <Box
        bg={addTransparency("#F5852C", 0.04)}
        mt={"40px"}
        px="24px"
        py="40px"
      >
        <Flex alignItems={"center"} gap={"1rem"} wrap={"wrap"}>
          <Box lineHeight={"1"}>
            <Text fontSize={"24px"} fontWeight={600} color={"secondary"}>
              Fund Managers
            </Text>
            <Text fontSize={"14px"} color={"primary"} mt="4px">
              The table below contains the list of fund managers whose projects
              you manage.
            </Text>
          </Box>
          <Spacer />
          <Box width="max-content" position={"relative"}>
            <Flex gap={"1rem"}>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<RiSearch2Line />}
              />
            </Flex>
          </Box>
        </Flex>
        <Box
          mt={"24px"}
          backgroundColor={"white"}
          borderRadius={"8px"}
          border="1px solid #F0F1F1"
        >
          <FundManagersList
            searchTerm={searchTerm}
            setTotal={setFundManagerCount}
          />
        </Box>

        <InviteFundManagerFormModal
          key={renderKey}
          projects={projectsData}
          isOpen={openInviteFundManager}
          closeModal={() => {
            setOpenInviteFundManager(false);
            setRenderKey(!renderKey);
          }}
        />
      </Box>
    </DashboardWrapper>
  );
}
