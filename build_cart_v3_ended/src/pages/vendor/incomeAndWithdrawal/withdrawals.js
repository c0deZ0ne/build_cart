import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/Table";
import moment from "moment/moment";
import Badge from "../../../components/Badge/Badge";
import EmptyState from "../../../components/EmptyState";
import instance from "../../../utility/webservices";
import { capitalize } from "lodash";

const Withdrawals = ({
  search = "",
  startDate = "",
  endDate = "",
  isFiltered,
  defaultIndex,
  isSuccess,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [tableBody, setTableBody] = useState([]);
  const pageSize = 10;

  const tableColumn = [
    "S/N",
    "TRANSACTION ID",
    "DESCRIPTION",
    "AMOUNT (₦)",
    "PAYMENT TYPE",
    "STATUS",
    "DATE",
  ];

  const getTransactions = async ({ query, pageSize }) => {
    setLoading(true);
    try {
      const { data } = (
        await instance.get(
          `/vendor/transaction/history?transaction_type=outflow&${query}`
        )
      ).data;

      const arr = [];
      let counter = 1;
      data.forEach((item, index) => {
        arr.push({
          SN: `0${counter}`,
          transactionId: item?.id,
          description: item?.description,
          amount: new Intl.NumberFormat().format(item?.amount),
          paymentType: capitalize(item?.paymentType?.replaceAll("_", " ")),
          status: <Badge status={item?.status} />,
          date: moment(item?.date).format("DD-MM-YYYY"),
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

    if (isFiltered && defaultIndex === 2) {
      getTransactions({
        query,
        pageSize,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltered]);

  useEffect(() => {
    const query = `search_param=${search}&start_date=${startDate}&end_date=${endDate}`;
    getTransactions({
      pageSize,
      query,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  return (
    <Box my="20px">
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableBody}
        isLoading={isLoading}
        empty={
          <EmptyState>
            You haven't made any
            <Text as="span" color="primary">
              {" "}
              withdrawals
            </Text>{" "}
            yet. When you do, they will show up here.
          </EmptyState>
        }
      />
    </Box>
  );
};

export default Withdrawals;
