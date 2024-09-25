import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useConfirmDeliveryMutation,
  useGetCompletedOrdersQuery,
} from "../../redux/api/vendor/vendor";
import { userData } from "../../redux/store/store";
import {
  addTransparency,
  handleSuccess,
  weeksDiff,
} from "../../utility/helpers";
import StatusPill from "../Builder/ProjectInvitations/StatusPill";
import Button from "../Button";
import EmptyState from "../EmptyState";
import BaseModal from "../Modals/Modal";
import BaseTable from "../Table";

const tableColumns = [
  "S/N",
  "ITEM NAME",
  "QUANTITY",
  "AMOUNT (₦)",
  "DELIVERY ADDRESS",
  "ESTIMATED DELIVERY",
  "STATUS",
  "ACTION",
];

function statusColor(status) {
  const sta = status.toLowerCase();
  if (sta === "pending") return "#FFBD00";
  if (sta === "completed") return "#1C903D";
  if (sta === "ongoing") return "#FFBD00";
  return "#000000";
}

function createStatus(statuses) {
  const isMultiple = statuses.length > 1;
  if (isMultiple) {
    return (
      <Flex>
        {statuses.map((status, jdx) => {
          const color = statusColor(status);
          return (
            <StatusPill
              key={jdx}
              color={color}
              status={capitalize(status)[0]}
            />
          );
        })}
      </Flex>
    );
  } else {
    const status = statuses[0];
    const color = statusColor(status);
    return <StatusPill color={color} status={capitalize(status)} />;
  }
}

/**
 * @param {{
 * SN: string,
 *  name: string,
 *  quantity: number | string,
 *  amount: number | string,
 *  address: string,
 *  deliveryDate: string,
 *  status: string[],
 *  hasAction: boolean,
 *   showDropdown: boolean,
 *   numOfChildren: number,
 *  isChild: boolean,
 *  customClass: string,
 * buyerName: string,
 * buyerEmail: string,
 * deliveryScheduleId: string
 * contractId: string
 * refetch: () => void
 * }}
 */
function processObject({
  SN,
  name,
  quantity,
  amount,
  address,
  deliveryDate,
  status,
  hasAction,
  showDropdown,
  numOfChildren,
  isChild,
  customClass,
  buyerName,
  buyerEmail,
  deliveryScheduleId,
  contractId,
  refetch,
}) {
  return {
    "S/N": (
      <Box>
        {SN}
        {showDropdown && (
          <Button size="sm" background="transparent" color="#12355a">
            <FaAngleDown />
          </Button>
        )}
      </Box>
    ),
    "ITEM NAME": name,
    QUANTITY: (
      <Flex align={"center"} gap={"8px"}>
        {Intl.NumberFormat().format(quantity)}
        {numOfChildren > 0 && (
          <Flex
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
            {numOfChildren}
          </Flex>
        )}
      </Flex>
    ),
    "AMOUNT (₦)": isChild ? "-" : Intl.NumberFormat().format(+amount),
    "DELIVERY ADDRESS": address,
    "ESTIMATED DELIVERY": deliveryDate
      ? weeksDiff(Date.now(), deliveryDate) + " weeks"
      : "",
    STATUS: createStatus(status),
    ACTION: hasAction ? (
      <ActionButton
        buyerEmail={buyerEmail}
        buyerName={buyerName}
        deliveryDate={deliveryDate}
        constructionMaterial={name}
        deliveryScheduleId={deliveryScheduleId}
        orderNumber={0} // TODO: will revisit
        contractId={contractId}
        onSuccess={refetch}
      />
    ) : null,
    isExpandable: !isChild && numOfChildren > 0,
    customClass: `${customClass} ${isChild ? "is-sub" : ""}`,
  };
}

function processArray({ SN, contractId, schedules, RfqRequest, refetch }) {
  const result = [];

  if (schedules.length < 1) return [];

  const {
    CreatedBy: { email: buyerEmail, name: buyerName },
    deliveryAddress,
  } = RfqRequest;
  if (schedules.length === 1) {
    const {
      RfqRequestMaterial: { name, budget, quantity: totalQuantity },
      id: deliveryScheduleId,
      status,
      dueDate,
      quantity,
    } = schedules[0];

    const obj = processObject({
      SN,
      name,
      quantity: totalQuantity,
      amount: budget,
      address: deliveryAddress,
      dueDate: new Date(),
      customClass: contractId,
      isChild: false,
      hasAction: true,
      showDropdown: false,
      status: [status],
      numOfChildren: 0,
      deliveryScheduleId,
      buyerEmail,
      buyerName,
      deliveryDate: dueDate,
      contractId,
      refetch,
    });

    result.push(obj);
    return result;
  }

  schedules.forEach((schedule) => {
    const {
      RfqRequestMaterial: { name, budget },
      id: deliveryScheduleId,
      status,
      dueDate,
      quantity,
    } = schedule;

    const obj = processObject({
      SN: "",
      name,
      quantity,
      amount: budget,
      address: deliveryAddress,
      dueDate: new Date(),
      customClass: contractId,
      isChild: true,
      hasAction: true,
      showDropdown: false,
      status: [status],
      numOfChildren: 0,
      deliveryScheduleId,
      buyerEmail,
      buyerName,
      deliveryDate: dueDate,
      contractId,
      refetch,
    });
    result.push(obj);
  });

  // FOR THE PARENT
  const {
    RfqRequestMaterial: { name, quantity, budget },
    id: deliveryScheduleId,
  } = schedules[0];

  const parent = processObject({
    SN,
    name,
    quantity: quantity,
    amount: budget,
    address: deliveryAddress,
    customClass: contractId,
    buyerEmail: buyerEmail,
    buyerName: buyerName,
    deliveryScheduleId: deliveryScheduleId,
    deliveryDate: "",
    isChild: false,
    showDropdown: true,
    hasAction: !true,
    numOfChildren: schedules.length,
    status: schedules.reduce((acc, curr) => {
      return acc.concat(curr.status);
    }, []),
    contractId,
    refetch,
  });

  result.unshift(parent);
  return result;
}

/**
 *
 * @param {{
 * buyerEmail:string,
 * buyerName:string,
 * constructionMaterial:string,
 * orderNumber:number,
 * deliveryScheduleId:string,
 * deliveryDate:string
 * contractId: string
 * onSuccess: () => void
 *  }} props
 * @returns
 */
const ActionButton = ({
  buyerEmail,
  buyerName,
  constructionMaterial,
  orderNumber,
  deliveryDate,
  deliveryScheduleId,
  contractId,
  onSuccess,
}) => {
  const toast = useToast();
  const userInfo = useSelector(userData);
  // const { refetch: refetchActiveOrders } = useGetActiveOrdersQuery();

  const [deliveryFn, { isLoading, isSuccess, isError, error }] =
    useConfirmDeliveryMutation();

  const [showSuccessModal, setShowSuccessModal] = useState(!true);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
      handleSuccess("The Builder has been notified about the order.");
      setShowSuccessModal(true);
    }

    if (isError && error) {
      // handleError(error);

      toast({
        status: "error",
        position: "top-right",
        variant: "left-accent",
        description: error.data.message,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error]);

  function deliver() {
    deliveryFn({
      contractId,
      deliveryScheduleId,
      data: {
        vendorName: userInfo.data.userName,
        buyerName,
        buyerEmail,
        constructionMaterial,
        orderNumber,
        deliveryScheduleId,
        deliveryDate,
      },
    });
  }

  return (
    <Box>
      <Button
        onClick={deliver}
        isLoading={isLoading}
        size="sm"
        fontSize="14px"
        background={addTransparency("#074794", 0.16)}
        color="#074794"
      >
        Delivered
      </Button>

      <BaseModal
        showHeader={false}
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <Text align={"center"} fontSize={"24px"} fontWeight={600} my={"8rem"}>
          The Builder has been notified about the order.
        </Text>

        <Button
          onClick={() => {
            onSuccess();
            setShowSuccessModal(false);
          }}
          full
        >
          Continue
        </Button>
      </BaseModal>
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
const ActiveOrdersList = ({ searchTerm, setCount }) => {
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, refetch } = useGetCompletedOrdersQuery(search, {
    refetchOnMountOrArgChange: true,
  });

  const newTable = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    const orders = data.data.orders;
    const ordersWithOngoingSchedules = orders.filter((order) =>
      order.deliverySchedules.some((sch) => sch.status === "ONGOING")
    );
    const mapped = ordersWithOngoingSchedules.map((order, index) => {
      const SN = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

      const { ContractId, RfqRequest, deliverySchedules: schedules } = order;

      const onGoingSchedules = schedules.filter(
        (schedule) => schedule.status === "ONGOING"
      );

      return processArray({
        SN,
        RfqRequest,
        contractId: ContractId,
        schedules: onGoingSchedules,
        refetch: refetch,
      });
    });

    return mapped.flat();
  }, [data, refetch]);

  useEffect(() => {
    if (!data) return;
    if (!data.data) return;
    setCount(newTable.length);
  }, [setCount, data, newTable.length]);

  function handleRowClick(data) {
    if (data.isExpandable) {
      const items = document.getElementsByClassName(data.customClass);

      const subs = Array.from(items).filter((item) =>
        item.classList.contains("is-sub")
      );
      // const [parent, ...rest] = items;

      subs.forEach((sub) => {
        sub.classList.toggle("show");
      });
    }
  }

  return (
    <div>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={newTable}
        onClick={(d) => handleRowClick(d)}
        skipRender={["customClass", "isExpandable"]}
        isLoading={isLoading}
        pointerCursor
        empty={
          <EmptyState>
            <Text>Nothing to show</Text>
          </EmptyState>
        }
      />
    </div>
  );
};

export default ActiveOrdersList;
