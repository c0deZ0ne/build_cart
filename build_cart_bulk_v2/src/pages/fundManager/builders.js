import { Box, Flex, Spacer } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { RiSearch2Line } from "react-icons/ri";
import Button from "../../components/Button";
import Cards from "../../components/Cards/Cards";
import AllBuildersList from "../../components/FundManager/AllBuildersList";
import InviteBuilderFormModal from "../../components/FundManager/InviteBuilderFormModal";
import MyBuildersList from "../../components/FundManager/MyBuildersList";
import Input from "../../components/Input";
import CustomTabs from "../../components/Tabs/CustomTabs";
import useDebounce from "../../hook/useDebounce";
import DashboardWrapper from "../../layouts/dashboard";
import {
  useGetAllProjectsQuery,
  useRetrieveAllBuildersQuery,
} from "../../redux/api/fundManager/fundManager";
import { addTransparency } from "../../utility/helpers";

const TopPart = ({ searchTerm }) => {
  const [openInviteForm, setOpenInviteForm] = useState(false);

  const { data: builders } = useRetrieveAllBuildersQuery(searchTerm);

  const { data: myProjectsData } = useGetAllProjectsQuery();

  const projects = useMemo(() => {
    if (!myProjectsData) return [];
    if (!myProjectsData.data) return [];

    return myProjectsData.data.map((project) => {
      const { title, id } = project;
      return {
        name: title,
        id,
      };
    });
  }, [myProjectsData]);

  function numOfBuilders() {
    if (!builders) return 0;
    if (!builders.data) return 0;

    return builders.data.builders.length;
  }

  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Box w={"320px"} maxW={"100%"}>
          <Cards
            cardDetail={{
              name: "Builders",
              quantity: numOfBuilders(),
              isCurrency: false,
              bg: "#12355A",
              icon: <FaCheckCircle />,
            }}
          />
        </Box>

        <Button onClick={() => setOpenInviteForm(true)}>Invite Builder</Button>
      </Flex>
      <InviteBuilderFormModal
        isOpen={openInviteForm}
        closeModal={() => setOpenInviteForm(false)}
        projects={projects}
        key={openInviteForm}
      />
    </Box>
  );
};

const Builders = () => {
  const tabs = [
    {
      title: "All Builders",
      info: "The table below contains the list of builders on the Cutstruct platform.",
    },
    { title: "My Builders", info: "Your favourite builders are listed here." },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].title);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  return (
    <DashboardWrapper pageTitle="Builders">
      <Box>
        <TopPart searchTerm={debouncedSearchTerm} />
      </Box>

      <Box
        mt={"40px"}
        p={"40px 24px"}
        borderRadius="8px"
        backgroundColor={addTransparency("#f5852c", 0.04)}
      >
        <Flex gap={"24px"} wrap={"wrap"}>
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

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

        <Box mt={"24px"} background={"white"}>
          {activeTab === "All Builders" && (
            <AllBuildersList searchTerm={debouncedSearchTerm} />
          )}
          {activeTab === "My Builders" && (
            <MyBuildersList searchTerm={debouncedSearchTerm} />
          )}
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default Builders;
