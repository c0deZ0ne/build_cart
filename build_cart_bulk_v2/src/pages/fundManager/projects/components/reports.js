import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Button from "../../../../components/Button";
import { AiOutlineDownload } from "react-icons/ai";
import BaseTable from "../../../../components/Table";
// import moment from "moment/moment";
// import Badge from "../../../../components/Badge/Badge";
// import NoItem from "../../../../components/NoItem/NoItem";
import Input from "../../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import EmptyState from "../../../../components/EmptyState";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const tableColumn = [
    "S/N",
    "ITEM NAME",
    "DESCRIPTION",
    "SPEND ₦",
    "STATUS",
    "DATE",
  ];
  const tableBody = [
    // {
    //   SN: "01",
    //   itemName: "Project first name",
    //   description: "5, Lekki-Epe Expressway, Lagos",
    //   spend: "1,000,000,000",
    //   status: <Badge status="Inflow" />,
    //   date: moment().format("DD-MM-YYYY hh:mm A"),
    //   id: "1234",
    // },
    // {
    //   SN: "01",
    //   itemName: "Project first name",
    //   description: "5, Lekki-Epe Expressway, Lagos",
    //   spend: "1,000,000,000",
    //   status: <Badge status="Outflow" />,
    //   date: moment().format("DD-MM-YYYY hh:mm A"),
    //   id: "123",
    // },
  ];
  return (
    <Box mt="20px">
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "flex-end"]}
        gap={2}
      >
        <Box>
          <Flex fontWeight="600" fontSize="24px">
            <Text color="primary" mr="5px">
              Reports
            </Text>
          </Flex>
          <Text fontSize="14px">Review project transactions reports here.</Text>

          {tableBody.length > 0 && (
            <Flex gap={"1rem"} mt={3} maxW="350px">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<RiSearch2Line />}
              />
            </Flex>
          )}
        </Box>
        <Button leftIcon={<AiOutlineDownload />}>Download Report</Button>
      </Flex>

      <Box mt="20px">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={tableBody}
          empty={
            <EmptyState>
              No
              <Text as="span" color="secondary">
                {" "}
                Report
              </Text>{" "}
              to show yet.
            </EmptyState>
          }
        />
      </Box>
    </Box>
  );
};

export default Reports;
