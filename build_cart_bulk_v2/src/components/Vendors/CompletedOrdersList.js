import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import StarRatings from "../../components/StarRatings";
import {
  useGetCompletedOrdersQuery,
  useOpenDisputeOnOrderMutation,
} from "../../redux/api/vendor/vendor";
import { addTransparency } from "../../utility/helpers";
import { uploadImage } from "../../utility/queries";
import StatusPill from "../Builder/ProjectInvitations/StatusPill";
import Button from "../Button";
import EmptyState from "../EmptyState";
import BaseTable from "../Table";
import DisputeModal from "./DisputeModal";
import RateOrderModal from "./RateOrderModal";

const tableColumns = [
  "S/N",
  "ITEM NAME",
  "QUANTITY",
  "AMOUNT (₦)",
  "DELIVERY DATE",
  "ORDER STATUS",
  "PAYMENT STATUS",
  "CUSTOMER RATING",
  "ACTION",
];

/**
 *
 * @param {object} props
 * @param {string} props.contractId
 * @param {Function} props.refetch
 * @param {number} props.pendingDeliveryCount
 * @param {'COMPLETED' | 'PENDING' | 'CANCELLED' | 'ACCEPTED'} props.status
 * @returns
 */
const ActionButtons = ({
  contractId,
  refetch,
  pendingDeliveryCount,
  status,
}) => {
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openDisputeModal, setOpenDisputeModal] = useState(false);
  const [openDisputeFn, { isLoading, isSuccess, isError, error }] =
    useOpenDisputeOnOrderMutation();
  const [isUploading, setIsUploading] = useState(!true);

  const toast = useToast();

  useEffect(() => {
    if (isSuccess) {
      // refetchTableData();
      toast({
        position: "top-right",
        status: "success",
        description: `Dispute Open!`,
      });
    }

    if (isError && error) {
      toast({
        status: "error",
        position: "top-right",
        variant: "left-accent",
        description: error.data.message,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess]);

  /**
   *
   * @param  {{reason: string, message: string, file?: File}} data
   */
  async function onSubmit(data) {
    const dataToSubmit = {
      reason: data.reason,
      message: data.message,
    };

    try {
      if (data.file) {
        setIsUploading(true);
        const { url } = await uploadImage(data.file, "", () => {});
        if (url) {
          dataToSubmit.proofs = [url];
        }
      }
      openDisputeFn({ contractId, data: dataToSubmit });
    } catch (error) {
      toast({
        status: "error",
        description: "ERROR!",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function attemptToRate(e) {
    e.stopPropagation();
    if (pendingDeliveryCount > 0) {
      toast({
        status: "info",
        description: `You can't rate an uncompleted order, ${pendingDeliveryCount} deliver${
          pendingDeliveryCount > 1 ? "ies" : "y"
        } still pending`,
      });

      return;
    }
    setOpenRatingModal(true);
  }

  function attemptToOpenDispute(e) {
    e.stopPropagation();
    if (pendingDeliveryCount > 0) {
      toast({
        status: "info",
        description: `You can't open a dispute on an uncompleted order, ${pendingDeliveryCount} deliver${
          pendingDeliveryCount > 1 ? "ies" : "y"
        } still pending`,
      });
      return;
    }

    if (status === "COMPLETED") {
      toast({
        status: "info",
        description:
          "Builder is already satisfied with order, and contract has been accepted, No need for a dispute.",
      });

      return;
    }

    setOpenDisputeModal(true);
  }

  return (
    <Box>
      <Flex ml={"-24px"}>
        <Button
          _hover={{ background: "#33333" }}
          size="sm"
          fontSize="14px"
          background={"transparent"}
          color="#333333"
          fontWeight="400"
          rightIcon={<FaAngleRight />}
          onClick={(e) => attemptToRate(e)}
        >
          Rate Order
        </Button>
        <Button
          _hover={{ background: "#33333" }}
          size="sm"
          fontSize="14px"
          background={"transparent"}
          color="#333333"
          fontWeight="400"
          rightIcon={<FaAngleRight />}
          onClick={(e) => attemptToOpenDispute(e)}
        >
          Open Dispute
        </Button>
      </Flex>

      {openDisputeModal && (
        <DisputeModal
          isOpen={openDisputeModal}
          onClose={() => {
            setOpenDisputeModal(false);
          }}
          onSubmit={onSubmit}
          isLoading={isLoading || isUploading}
          isSuccess={isSuccess}
          key={isSuccess}
        />
      )}

      {openRatingModal && (
        <RateOrderModal
          refetchOrders={refetch}
          contractId={contractId}
          isOpen={openRatingModal}
          onClose={() => {
            setOpenRatingModal(false);
          }}
        />
      )}
    </Box>
  );
};

/**
 *
 * @param {object} props
 * @param {string} props.searchTerm
 * @param {(num: number) => void} props.setCount
 * @returns
 */
const CompletedOrdersList = ({ searchTerm, setCount }) => {
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const { data, refetch } = useGetCompletedOrdersQuery(search);

  const newTable = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    const orders = data.data.orders;

    const ordersWithCompletedSchedules = orders.filter((order) =>
      order.deliverySchedules.some((sch) => sch.status !== "ONGOING"),
    );

    const mapped = ordersWithCompletedSchedules.map((order, index) => {
      const SN = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
      return processOrder(SN, order, refetch);
    });

    return mapped.flat();
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (!data.data) return;

    const orders = data.data.orders;

    const ordersWithCompletedSchedules = orders.filter((order) =>
      order.deliverySchedules.some((sch) => sch.status !== "ONGOING"),
    );
    setCount(ordersWithCompletedSchedules.length);
  }, [setCount, data]);

  function handleRowClick(data) {
    if (data.isExpandable) {
      const items = document.getElementsByClassName(data.customClass);

      const subs = Array.from(items).filter((item) =>
        item.classList.contains("is-sub"),
      );
      // const [parent, ...rest] = items;

      subs.forEach((sub) => {
        sub.classList.toggle("show");
      });
    }
  }

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={newTable}
        onClick={handleRowClick}
        pointerCursor
        skipRender={["id", "customClass", "isExpandable"]}
        empty={
          <EmptyState>
            <Text>Nothing to show</Text>
          </EmptyState>
        }
      />
    </Box>
  );
};

const processObject = ({
  SN,
  name,
  quantity,
  amount,
  dueDate,
  rating,
  status,
  paymentStatus,
  isChild,
  numberOfChildren,
  contractId,
  refetch,
  pendingCount,
}) => {
  const statusColors = (() => {
    const result = { orderColor: "#000000", paymentColor: "#000000" };

    // if (isChild) {
    if (status === "PENDING") result.orderColor = "#FFBD00";
    if (status === "COMPLETED") result.orderColor = "#1C903D";
    // } else {
    if (status === "INREVIEW") result.orderColor = "#FFBD00";
    if (status === "ACCEPTED") result.orderColor = "#1C903D";
    // }

    if (paymentStatus === "PROCESSING") result.paymentColor = "#FFBD00";
    if (paymentStatus === "PENDING") result.paymentColor = "#333333";
    if (paymentStatus === "CONFIRMED") result.paymentColor = "#1C903D";

    return result;
  })();

  const statusName = isChild
    ? capitalize(status)
    : `Order ${capitalize(status)}`;

  const hasSubs = !isChild && numberOfChildren > 0;

  return {
    "S/N": isChild ? (
      "-"
    ) : (
      <Box>
        {SN}
        {hasSubs && (
          <Button size="sm" background="transparent" color="#12355a">
            <FaAngleDown />
          </Button>
        )}
      </Box>
    ),
    "ITEM NAME": isChild ? (
      "-"
    ) : (
      <Flex gap={"8px"} alignItems={"center"}>
        {" "}
        {name}
        {numberOfChildren > 0 && (
          <Flex
            flexShrink={"0"}
            align={"center"}
            justify={"center"}
            height={"24px"}
            width={"24px"}
            borderRadius={"50%"}
            color={"secondary"}
            fontSize={"12px"}
            fontWeight={600}
            backgroundColor={addTransparency("#F5852C", 0.16)}
          >
            {numberOfChildren}
          </Flex>
        )}
      </Flex>
    ),
    QUANTITY: Intl.NumberFormat("en-ng").format(quantity),
    "AMOUNT (₦)": isChild
      ? "-"
      : Intl.NumberFormat("en-ng", { currency: "NGN" }).format(amount),
    "DELIVERY DATE": dueDate.split("T")[0],
    "ORDER STATUS": (
      <StatusPill color={statusColors.orderColor} status={statusName} />
    ),
    "PAYMENT STATUS": isChild ? (
      "-"
    ) : (
      <StatusPill
        color={statusColors.paymentColor}
        status={"Funds " + capitalize(paymentStatus)}
      />
    ),
    "CUSTOMER RATING": isChild ? "-" : <StarRatings rating={rating} />,
    ACTION: isChild ? (
      ""
    ) : (
      <ActionButtons
        contractId={contractId}
        refetch={refetch}
        pendingDeliveryCount={pendingCount}
        status={status}
      />
    ),
    customClass: `${contractId} ${isChild ? "is-sub" : ""}`,
    isExpandable: hasSubs,
  };
};

const processOrder = (SN, order, refetch) => {
  const result = [];

  const {
    Contract,
    ContractId,
    deliverySchedules: schedules,
    RfqRequest,
    pendingCount,
  } = order;

  const { paymentStatus, status } = Contract;

  const { deliveryDate } = RfqRequest;

  const rating = Contract.RateReviewVendor
    ? Contract.RateReviewVendor.vendorRateScore
    : 0;

  const {
    RfqRequestMaterial: { name, quantity, budget },
    id: deliveryScheduleId,
  } = schedules[0];

  if (schedules.length === 1) {
    const obj = processObject({
      SN,
      amount: budget,
      quantity: quantity,
      contractId: ContractId,
      dueDate: deliveryDate,
      isChild: false,
      numberOfChildren: 0,
      name: name,
      paymentStatus: paymentStatus,
      rating,
      refetch,
      status,
      pendingCount,
    });

    result.push(obj);

    return [obj];
  }

  schedules
    .filter((schedule) => schedule.status === "COMPLETED")
    .forEach((schedule) => {
      const {
        RfqRequestMaterial: { name, budget },
        id: deliveryScheduleId,
        dueDate,
        status,
        quantity,
      } = schedule;

      const obj = processObject({
        amount: budget,
        contractId: ContractId,
        dueDate,
        isChild: true,
        name,
        numberOfChildren: 0,
        paymentStatus,
        quantity,
        rating,
        refetch,
        SN,
        status,
        pendingCount,
      });

      result.push(obj);
    });

  // =======

  const parent = processObject({
    amount: budget,
    contractId: ContractId,
    dueDate: deliveryDate,
    isChild: false,
    name,
    numberOfChildren: result.length,
    paymentStatus,
    quantity,
    rating,
    refetch,
    SN,
    status,
    pendingCount,
  });

  result.unshift(parent);

  return result;
};

export default CompletedOrdersList;
