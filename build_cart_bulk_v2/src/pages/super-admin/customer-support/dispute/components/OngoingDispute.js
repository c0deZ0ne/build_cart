import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../../../components/Table";
import moment from "moment/moment";
import EmptyState from "../../../../../components/EmptyState";
import instance from "../../../../../utility/webservices";
import { Button2 } from "../../../../../components/Button";
import { handleError } from "../../../../../utility/helpers";
import BaseModal from "../../../../../components/Modals/Modal";
import { capitalize } from "lodash";
import useModalHandler from "../../../../../components/Modals/SuccessModal";
import ResolveDispute from "../modal/ResolveDispute";
import DisputeReason from "../modal/DisputeReason";
import DisputeVendor from "../modal/DisputeVendor";
import DisputeBuilder from "../modal/DisputeBuilder";

const OngoingDispute = ({
  data = [],
  setDefaultIndex,
  getAllDispute,
  isLoading,
}) => {
  const [dispute, setDispute] = useState({});
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [openBuilder, setOpenBuilder] = useState(false);
  const [openResolve, setOpenResolve] = useState(false);
  const [tableBody, setTableBody] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const tableColumn = [
    "S/N",
    "VENDORS NAME",
    "BUILDERS NAME",
    "ITEM NAME",
    "QUANTITY",
    "DELIVERY DATE",
    "AMOUNT (₦)",
    "REPORT DATE",
    "ACTION",
  ];

  useEffect(() => {
    const arr = data.map((item, index) => {
      return {
        SN: `${(index + 1).toString().length < 2 ? 0 : ""}${index + 1}`,
        vendorName: capitalize(item?.Vendor?.businessName) ?? "_",
        builderName: capitalize(item?.Builder?.businessName) ?? "_",
        itemname: item?.Contract?.name
          ? capitalize(item.Contract.name)
          : "no api data",
        quantity: item?.Contract?.quantity
          ? capitalize(item.Contract.quantity)
          : "no api data",
        expectedDelivery: item?.Contract?.deliveryDate
          ? moment(item.Contract.deliveryDate).format("DD-MM-YYYY")
          : "no api data",
        amount: new Intl.NumberFormat().format(item?.Contract?.totalCost ?? 0),
        reportDate: moment(item.createdAt).format("DD-MM-YYYY"),
        action: (
          <Flex justify="space-between" gap={5}>
            <Button2
              color="#074794"
              onClick={() => {
                setDispute(item);
                onOpen();
              }}
            >
              Review
            </Button2>
          </Flex>
        ),
        id: item?.id,
      };
    });

    setTableBody(arr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const closeReasonOpenVendor = () => {
    setOpenVendor(true);
    onClose();
  };
  const closeVendorOpenBuilder = () => {
    setOpenBuilder(true);
    setOpenVendor(false);
  };

  const closeBuilderOpenResolve = () => {
    setOpenResolve(true);
    setOpenBuilder(false);
  };

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
              Ongoing Dispute Resolution
            </Text>{" "}
            on the platform.
          </EmptyState>
        }
      />

      <BaseModal
        isOpen={openResolve}
        onClose={() => setOpenResolve(false)}
        size="2xl"
        title={"Resolve Dispute"}
        subtitle={""}
      >
        <ResolveDispute
          data={dispute}
          isOpen={openResolve}
          onClose={() => setOpenResolve(false)}
        />

        {/* <BusinessInfo isOpen={isOpen} onOpen={onOpen} onClose={onClose} /> */}
      </BaseModal>

      <DisputeReason
        data={dispute}
        isOpen={isOpen}
        onClose={onClose}
        setNext={closeReasonOpenVendor}
      />

      <DisputeVendor
        data={dispute?.Vendor}
        isOpen={openVendor}
        onClose={() => setOpenVendor(false)}
        setNext={closeVendorOpenBuilder}
      />

      <DisputeBuilder
        data={dispute?.Builder}
        isOpen={openBuilder}
        onClose={() => setOpenBuilder(false)}
        setNext={closeBuilderOpenResolve}
      />
    </Box>
  );
};

export default OngoingDispute;
