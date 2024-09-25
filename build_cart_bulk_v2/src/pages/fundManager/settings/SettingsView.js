import DashboardWrapper from "../../../layouts/dashboard";
import Tabs from "../../../components/Tabs/Tabs";
import { Box } from "@chakra-ui/react";
import ProfileDetailsView from "./ProfileDetailsView";
import Security from "./Security";
import BusinessDetailsView from "./BusinessDetailsView";

export default function SuperAdminSettingsView() {
  const tabsData = {
    headers: [
      {
        title: "Profile Details",
      },
      {
        title: "Business Details",
      },
      {
        title: "Security",
      },
    ],
    body: [<ProfileDetailsView />, <BusinessDetailsView />, <Security />],
  };
  return (
    <DashboardWrapper pageTitle="Profile Settings">
      <Box>
        <Tabs tabsData={tabsData} />
      </Box>
    </DashboardWrapper>
  );
}
