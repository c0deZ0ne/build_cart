import { Box } from "@chakra-ui/react";
import Tabs from "../../../components/Tabs/Tabs";
import DashboardWrapper from "../../../layouts/dashboard";
import BusinessDetailsView from "./BusinessDetailsView";
import ProfileDetailsView from "./ProfileDetailsView";
import BuilderSecurity from "./Security";
import BusinessPortfolioView from "./BusinessPortfolioView";
import { useGetProfileDetailsQuery } from "../../../redux/api/builder/settingsApiService";

export default function SettingsView() {
  const {
    data: profileDetails,
    isLoading,
    refetch,
  } = useGetProfileDetailsQuery();

  const tabsData = {
    headers: [
      {
        title: "Profile Details",
      },
      {
        title: "Business Details",
      },
      {
        title: "Business Portfolio",
      },
      { title: "Security" },
    ],
    body: [
      <ProfileDetailsView
        profileDetails={profileDetails}
        isLoading={isLoading}
        refetch={refetch}
      />,
      <BusinessDetailsView
        profileDetails={profileDetails}
        isLoading={isLoading}
        refetch={refetch}
      />,
      <BusinessPortfolioView />,
      <BuilderSecurity />,
    ],
  };
  return (
    <DashboardWrapper pageTitle="Settings">
      <Box>
        <Tabs tabsData={tabsData} />
      </Box>
    </DashboardWrapper>
  );
}
