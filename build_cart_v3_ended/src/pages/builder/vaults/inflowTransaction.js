import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/Table";
import moment from "moment/moment";
import Badge from "../../../components/Badge/Badge";
import EmptyState from "../../../components/EmptyState";
import instance from "../../../utility/webservices";

const InflowTransaction = ({
  search = "",
  startDate = "",
  endDate = "",
  isFiltered,
  refreshVault,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [tableBody, setTableBody] = useState([]);
  const pageSize = 10;

  const tableColumn = [
    "S/N",
    "DESCRIPTION",
    "TRANSACTION ID",
    "AMOUNT (₦)",
    "DATE",
    "TIME",
    "STATUS",
  ];

  const getTransactions = async ({ query, pageSize }) => {
    setLoading(true);
    try {
      const { data } = (
        await instance.get(
          `/builder/transaction/history?transaction_type=inflow&page_size=${pageSize}&${query}`
        )
      ).data;

      const arr = [];
      let counter = 1;
      data.forEach((item, index) => {
        arr.push({
          SN: `0${counter}`,
          description: item?.description,
          transactionId: item?.reference,
          amount: new Intl.NumberFormat().format(item?.amount),
          date: moment(item?.createdAt).format("DD-MM-YYYY"),
          time: moment(item?.createdAt).format("hh:mm A"),
          status: item?.status ? <Badge status={item?.status} /> : null,
          id: item?.id,
        });
        counter++;
      });

      setTableBody(arr);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    let query = "";
    if (search !== "" || startDate !== "" || endDate !== "") {
      query = `search_param=${search}&start_date=${startDate}&end_date=${endDate}`;
    }

    if (isFiltered) {
      getTransactions({
        query,
        pageSize,
      });
    }
    if (refreshVault !== null) {
      getTransactions({
        query,
        pageSize,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltered, refreshVault]);

  return (
    <Box my="20px">
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableBody}
        isLoading={isLoading}
        empty={
          <EmptyState>
            You've not done any{" "}
            <Text as="span" color="primary">
              {" "}
              cash transactions
            </Text>{" "}
            with suppliers yet.
            <Text as="span" color="secondary">
              {" "}
              When you do cash transactions
            </Text>{" "}
            with suppliers, they will appear here.
          </EmptyState>
        }
      />
    </Box>
  );
};

export default InflowTransaction;
