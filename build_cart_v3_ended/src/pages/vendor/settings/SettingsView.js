import DashboardWrapper from "../../../layouts/dashboard";
import ProfileDetailsView from "./ProfileDetailsView";
import Tabs from "../../../components/Tabs/Tabs";
import { Box } from "@chakra-ui/react";
import BusinessDetailsView from "./BusinessDetailsView";
import { useGetProfileDetailsQuery } from "../../../redux/api/vendor/settingsApiService";
import { useEffect } from "react";
import VendorSecurity from "./Security";

export default function VendorSettingsView() {
  const {
    data: profileDetails,
    isLoading,
    refetch,
  } = useGetProfileDetailsQuery();

  useEffect(() => {
    // setBuilderProfile(profileDetails.vendorProfile)
  }, [profileDetails, isLoading]);
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
      <VendorSecurity />,
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
