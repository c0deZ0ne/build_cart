import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import AcceptedBidsTable from "../../../components/Builder/ProjectInvitations/Tables/AcceptedBidsTable";
import ProjectInvitationsTable from "../../../components/Builder/ProjectInvitations/Tables/ProjectInvitationsTable";
import SubmittedBidsTable from "../../../components/Builder/ProjectInvitations/Tables/SubmittedBidsTable";
import CustomTabs from "../../../components/Tabs/CustomTabs";
import DashboardWrapper from "../../../layouts/dashboard";
import TopCards from "./components/TopCards";
import Cards from "../../../components/Cards/Cards";
import {IoCheckmarkCircle} from "react-icons/io5";

const ProjectInvitations = () => {
  const tabs = [
    { title: "Project Invitation" },
    { title: "Submitted Tender" },
    { title: "Accepted Tender" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].title);

  const [numOfInvites, setNumofInvite] = useState(0);

  return (
    <DashboardWrapper
      pageTitle="Project Invitation"
      handleProjectData=""
      projectOptions=""
    >
      <Box>
        <Cards
          cardDetail={{
            name: "Project Invites",
            icon: <IoCheckmarkCircle fontSize="24px" />,
            type: "all",
            status: "all",
            quantity: numOfInvites,
            description:
              "Your company has received project management requests from institutions and project financiers. This is the total number.",
            info: "info",
            color: "#074794",
          }}
          width="320px"
        />
      </Box>

      <Box mt="40px" p={"40px 24px"} background={"#FCF7F6"} borderRadius="8px">
        <Box>
          <Text fontSize={"20px"} fontWeight={"600"} color={"secondary"}>
            Project Invitation
          </Text>

          <Text fontSize={"12px"} mt={"4px"}>
            Submit project tenders in response to the requests received from
            fund manager.
          </Text>
        </Box>
        <Box mt={"40px"}>
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Box>

        <Box
          mt="28px"
          borderRadius="8px"
          border="1px solid #F0F1F1"
          backgroundColor={"white"}
        >
          {activeTab === "Project Invitation" ? (
            <ProjectInvitationsTable setInviteNum={setNumofInvite} />
          ) : activeTab === "Submitted Tender" ? (
            <SubmittedBidsTable />
          ) : activeTab === "Accepted Tender" ? (
            <AcceptedBidsTable />
          ) : null}
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default ProjectInvitations;
