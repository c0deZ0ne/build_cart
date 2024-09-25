import React, { useState } from "react";
import BaseModal from "./Modal";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import Button from "../Button";
import PaymentSubscriptionModal from "./PaymentSubscriptionModal";
import { useDispatch } from "react-redux";
import { closeCountDownTimer } from "../../redux/features/subscription/subscriptionSlice";
import { daysDiff } from "../../utility/helpers";

const CountDownModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  const {
    isOpen: isOpenSubscriptionModal,
    onOpen: onOpenSubscriptionModal,
    onClose: onCloseSubscriptionModal,
  } = useDisclosure();
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { subscription } = userInfo;

  useEffect(() => {
    onOpen();
    let days = daysDiff(new Date(), subscription?.expirationDate);
    setDayCount(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubcription = () => {
    onOpenSubscriptionModal();
    onClose();
    setOpen(true);
  };

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        showHeader={false}
        onClose={() => {
          onClose();
          dispatch(closeCountDownTimer());
        }}
        size="md"
        closeBtnSize="5px"
        bg="#12355A"
      >
        <Box mt={8} textAlign="center" color="#fff">
          <Text color="#fff" fontWeight={500}>
            Your free trial has begun and will expire in
          </Text>

          <Flex justify="center" alignItems="center" my={10}>
            <Flex
              justify="center"
              alignItems="center"
              minW="105px"
              aspectRatio={1}
              margin="auto"
              rounded={"50%"}
              direction="column"
              border="2px solid #999"
            >
              <Box p={5}>
                <Text fontSize="52px" lineHeight="40px" fontWeight="600">
                  {dayCount >= 0 ? dayCount : 0}
                </Text>
                <Text fontSize="14px">Days</Text>
              </Box>
            </Flex>
          </Flex>

          <Button
            background="#f5852c29"
            color="secondary"
            full
            onClick={handleSubcription}
          >
            Subscribe
          </Button>

          <Text my={3}>to stay connected</Text>
        </Box>
      </BaseModal>

      {open && (
        <PaymentSubscriptionModal
          isOpen={isOpenSubscriptionModal}
          onOpen={onOpenSubscriptionModal}
          onClose={onCloseSubscriptionModal}
          onCloseSubscription={onCloseSubscriptionModal}
        />
      )}
    </div>
  );
};

export default CountDownModal;
