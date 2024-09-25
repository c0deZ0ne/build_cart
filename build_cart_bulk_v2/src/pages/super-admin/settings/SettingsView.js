import DashboardWrapper from "../../../layouts/dashboard";
import ProfileDetailsView from "./ProfileDetailsView";
import Tabs from "../../../components/Tabs/Tabs";
import { Box } from "@chakra-ui/react";
import SuperAdminSecurity from "./Security";

export default function SuperAdminSettingsView() {
  const tabsData = {
    headers: [
      {
        title: "Profile Details",
      },
      {
        title: "Security",
      },
    ],
    body: [<ProfileDetailsView />, <SuperAdminSecurity />],
  };
  return (
    <DashboardWrapper pageTitle="Profile Settings">
      <Box>
        <Tabs tabsData={tabsData} />
      </Box>
    </DashboardWrapper>
  );
}
