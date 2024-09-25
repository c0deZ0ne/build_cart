import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../../../components/Table";
import EmptyState from "../../../../../components/EmptyState";
import { Button2 } from "../../../../../components/Button";
import { capitalize } from "lodash";
import UserOctagon from "../../../../../components/Icons/UserOctagon";
import RequestCheckModal from "./RequestCheckModal";

const OpenRequest = ({ data = [], getAllRequest, isLoading }) => {
  const [request, setRequest] = useState({});
  const [requestType, setRequestType] = useState("");
  const [openResolve, setOpenResolve] = useState(false);
  const [tableBody, setTableBody] = useState([]);
  const tableColumn = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
    "CUSTOMER NAME",
    "PHONE NUMBER",
    "ACCOUNT TYPE",
    "LAST USER ACTIVITY",
    "REQUEST TYPE",
    "ACTION",
  ];

  const openResolveModal = (updateType, request) => {
    setOpenResolve(true);
    setRequestType(updateType);
    setRequest(request);
  };

  useEffect(() => {
    const arr = data.map((item) => {
      return {
        logo: <Avatar src={item.logo} />,
        customerName: capitalize(item?.customerName) ?? "_",
        phone: item?.phoneNumber ?? "_",
        accountType: item?.customerType,
        lastUserActivity: `Api return when use signed up ${item?.signupDate}`,
        requestType: capitalize(item?.recovery_request_type),
        action: (
          <Menu
            id={item.id}
            closeOnSelect={true}
            isLazy
            direction="ltr"
            zIndex="1000"
          >
            <MenuButton style={{ cursor: "pointer" }}>
              <Button2 color="#074794">Review</Button2>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => openResolveModal("email", item)}>
                Email change
              </MenuItem>
              <Box m="0px 10px" fontSize="14px"></Box>
              <MenuItem onClick={() => openResolveModal("phone", item)}>
                Phone number change
              </MenuItem>
            </MenuList>
          </Menu>
        ),
      };
    });
    setTableBody(arr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Box my="20px">
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableBody}
        isLoading={isLoading}
        empty={
          <EmptyState>
            There are no{" "}
            <Text as="span" color="secondary">
              {" "}
              Open Request
            </Text>{" "}
            on the platform.
          </EmptyState>
        }
      />

      <RequestCheckModal
        setOpenResolve={setOpenResolve}
        openResolve={openResolve}
        requestType={requestType}
        request={request}
        getAllRequest={getAllRequest}
      />
    </Box>
  );
};

export default OpenRequest;
