import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import EmptyState from "../../../../components/EmptyState";
import BaseTable from "../../../../components/Table";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import Input from "../../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import instance from "../../../../utility/webservices";
import { Button2 } from "../../../../components/Button";
import ProjectInvitationBidModal from "../modals/ProjectInvitationBidModal";

const Bids = ({ setDefaultIndex, refreshRfq, getProjectDetails }) => {
  const [tableBody, setTableBody] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { projectId } = useParams();
  const [currentBidId, setCurrentBidId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTableData = async () => {
    try {
      const arr = [];
      let counter = 1;

      const { data } = (
        await instance.get(
          `/fundManager/project/${projectId}/bids?page_size=10000`
        )
      ).data;

      data.forEach((item, index) => {
        arr.push({
          SN: `0${counter}`,
          businessName: item?.Owner?.businessName,
          businessAddress: item?.Owner?.businessAddress,
          quantity: item?.Owner?.CompanyProjects?.completedProjects,
          businessSize: item?.Owner?.businessSize,
          action: (
            <Button2
              color="#1C903D"
              onClick={() => {
                setCurrentBidId(item.id);
                onOpen();
              }}
            >
              Review Bids
            </Button2>
          ),
          id: item?.id,
        });
        counter++;
      });

      setTableBody(arr);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTableData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRfq]);

  const tableColumn = [
    "S/N",
    "BUILDER NAME",
    "LOCATION",
    "COMPLETED PROJECTS",
    "BUSINESS SIZE",
    "ACTION",
  ];
  return (
    <Box mt="20px">
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "center"]}
        gap={2}
      >
        <Box>
          <Flex fontWeight="600" fontSize="24px">
            <Text color="secondary"> Bids</Text>
          </Flex>
          <Text mb="10px" fontSize="14px">
            View list of all builders bidding for this project.
          </Text>
        </Box>
        <Box width={["100%", "100%", "300px"]}>
          <Input leftIcon={<RiSearch2Line />} placeholder="Search" />
        </Box>
      </Flex>

      <Box mt="20px" bg="#fff">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={tableBody}
          isLoading={isLoading}
          empty={
            <EmptyState>
              No
              <Text as="span" color="secondary">
                {" "}
                Bids
              </Text>{" "}
              has been made yet. <br />
              We will notify you as soon as builder starts to make tender.
            </EmptyState>
          }
        />
      </Box>

      <ProjectInvitationBidModal
        isOpen={isOpen}
        closeModal={onClose}
        bidId={currentBidId}
        getProjectDetails={getProjectDetails}
      />
    </Box>
  );
};

export default Bids;
