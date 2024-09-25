import {
  Box,
  Text,
  Heading,
  ModalBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Flex,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import CutStructLogo from "../../assets/images/cutstructlogo.png";
import { HiArrowRight } from "react-icons/hi2";
import PaymentSubscriptionModal from "../../components/Modals/PaymentSubscriptionModal";
import { handleError, handleSuccess } from "../../utility/helpers";
import instance from "../../utility/webservices";
import { lowerCase } from "lodash";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const SubscriptionModal = ({ onOpen, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(-1);
  const [persist, setPersist] = useState({ state: false, index: -1 });
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userType = lowerCase(user.userType).replaceAll(" ", "-");
  const history = useHistory();
  const {
    isOpen: isOpenSubscription,
    onOpen: onOpenSubscription,
    onClose: onCloseSubscription,
  } = useDisclosure();
  const subscriptionPlans = [
    {
      name: "Trial Plan",
      label: "Free",
      description: "Get unlimited access for 14 days",
      color: "#12355a",
      duration: "14 days",
    },
    {
      name: "Enterprise Plan",
      label: "₦ 2,000,000",
      description: "A full suite of features for construction",
      color: "#f5862e",
      duration: "per annum",
    },
  ];

  const handleFreeSubscription = async () => {
    setLoading(true);
    user.isSubscribe = true;

    try {
      const { data } = await instance.post("/subscriptions/subscribe-free", {
        userId: user?.id,
      });
      user.subscription = data.data;
      localStorage.setItem("userInfo", JSON.stringify(user));
      handleSuccess("Subscription successful.");
      history.replace(`/${userType}/dashboard`);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  useEffect(() => {
    onOpen();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        isOpen={isOpen}
        size={"3xl"}
        onClose={() => {
          handleFreeSubscription();
          onClose();
        }}
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="20%"
          backdropBlur="3px"
        />
        <ModalContent p={["20px 0", "40px"]} border="1px solid #f5862e">
          <ModalCloseButton
            fontSize="10px"
            w="25px"
            h="25px"
            bg="#999999"
            color="#ffffff"
            borderRadius="50%"
          />
          <ModalBody>
            <Box
              bg="#ffffff"
              bgImage={CutStructLogo}
              bgRepeat="no-repeat"
              bgSize="cover"
              bgBlendMode="lighten"
              bgColor="rgba(255,255,255,.97)"
            >
              <Box textAlign="center" mb={10}>
                <Heading color="#F5862E" mb="20px" fontSize={"28px"}>
                  Get Started Now
                </Heading>
                <Text color="#999999" my="20px">
                  Try out our platform with unlimited access for {"14days"}
                </Text>
              </Box>

              <HStack gap={[2, 2, 10]} h="400px" justify="space-evenly">
                {subscriptionPlans.map((e, i) => (
                  <Box
                    key={i}
                    rounded={8}
                    border="1px solid #66666629"
                    boxShadow="0px 0px 8px 3px rgba(18, 53, 90, 0.07)"
                    borderTop={`8px solid ${e?.color}`}
                    p="20px"
                    scrollBehavior="smooth"
                    textAlign="center"
                    fontSize={
                      subscription === i ||
                      (persist.index === i && persist.state)
                        ? ["1.2em", "1.3em"]
                        : "1rem"
                    }
                    onMouseEnter={() => {
                      setSubscription(i);
                      setPersist({ index: i, state: false });
                    }}
                    onMouseLeave={() => {
                      setSubscription(-1);
                    }}
                    onClick={() => setPersist({ index: i, state: true })}
                    transition="0.3s ease-in, 0.4s ease-out"
                  >
                    <Text fontWeight={500} mb={"1.2em"}>
                      {e?.name}
                    </Text>

                    <Text
                      fontSize={["1.2em", "1.2em", "2.2em"]}
                      color={e?.color}
                      fontWeight={600}
                      mt={"1.2em"}
                    >
                      {e?.label}
                    </Text>

                    <Text fontSize=".9em" color="#999">
                      {e?.duration}
                    </Text>

                    <Text fontSize=".9em" my={"2.5em"} color="#999">
                      {e?.description}
                    </Text>

                    <Flex justify="center">
                      <Button
                        isLoading={loading}
                        variant={subscription === i ? false : true}
                        rightIcon={<HiArrowRight />}
                        rounded="50"
                        background={e?.color}
                        onClick={
                          subscription === 0
                            ? handleFreeSubscription
                            : onOpenSubscription
                        }
                      >
                        Get Started
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {isOpenSubscription && (
        <PaymentSubscriptionModal
          isOpen={isOpenSubscription}
          onCloseSubscription={onCloseSubscription}
          onClose={onClose}
          onOpen={onOpenSubscription}
          reOpen={onOpen}
        />
      )}
    </div>
  );
};

export default SubscriptionModal;
