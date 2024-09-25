import {
  Box,
  ModalBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Flex,
  useToast,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import Logo2 from "../../components/Logo2";
import CutStructLogo from "../../assets/images/cutstructlogo.png";
import VendorCategory from "./vendorCategory";
import VendorBusinessInfo from "./vendorBusinessInfo";
import VendorBusinessDocs from "./vendorBusinessDocs";
import VendorTermsConditions from "./vendorTermsCondition";
import { useRegisterVendorMutation } from "../../redux/api/vendor/vendorRegisterSlice";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import Button from "../../components/Button";
import { MdChevronLeft } from "react-icons/md";

const VendorModal = () => {
  const steps = [
    { title: "Supplier Category" },
    { title: "Business Information" },
    { title: "Business Document " },
    { title: "Terms and Condition" },
  ];
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps?.length,
  });

  const [checkedItems, setCheckedItems] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invitationId = queryParams.get("invId");
  const projectId = queryParams.get("prId");
  const storedData = JSON.parse(localStorage.getItem("vendorData"));
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const cats = storedData?.categories?.map((e, i) => e.value);
  const documentObj = storedData?.documents?.reduce((accumulator, el) => {
    accumulator[el.documentFilename] = el.url;
    return accumulator;
  }, {});

  // 👇 Calling the Register Mutation
  const [registerVendorApi, { isLoading, isSuccess, error, isError }] =
    useRegisterVendorMutation();

  useEffect(() => {
    if (isSuccess) {
      toast({
        description: "You have successfully updated your account.",
        status: "success",
      });
      setLoading(false);
      onClose();
      history.push("/vendor/dashboard");
    }
    if (isError) {
      toast({
        description: Array.isArray(error?.data?.message)
          ? error?.data?.message[0]
          : error?.data?.message
          ? error?.data?.message
          : "Error... unable to update account.",
        status: "error",
      });
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    setLoading(true);
    registerVendorApi({
      UserId: user?.id,
      invitationId,
      projectId,
      businessAddress: storedData?.businessAddress,
      businessSize: storedData?.size?.value,
      businessRegNo: storedData?.businessRegNo,
      businessName: user?.userName,
      VendorType: storedData?.vendorType?.value || "MANUFACTURER",
      categories: cats,
      ...documentObj,
      about:
        "As a dedicated construction materials vendor, we are your reliable partner for procuring top-tier supplies. We provide a diverse and high-quality inventory tailored to meet the unique demands of construction projects.",
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
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
          onClose();
          registerVendorApi({
            UserId: user?.id,
            invitationId,
            projectId,
            VendorType: storedData?.vendorType?.value || "DISTRIBUTOR",
            about:
              "As a dedicated construction materials vendor, we are your reliable partner for procuring top-tier supplies. We provide a diverse and high-quality inventory tailored to meet the unique demands of construction projects.",
          });
        }}
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="20%"
          backdropBlur="3px"
        />
        <ModalContent p="30px" border="1px solid #f5862e">
          <ModalCloseButton
            fontSize="10px"
            w="25px"
            h="25px"
            bg="#999999"
            color="#ffffff"
            borderRadius="50%"
          />
          <ModalBody>
            <Flex
              bg="#ffffff"
              bgImage={CutStructLogo}
              bgRepeat="no-repeat"
              bgSize="cover"
              bgBlendMode="lighten"
              bgColor="rgba(255,255,255,.97)"
              justify="space-between"
            >
              <Flex direction="column" justifyContent="space-between" w="40%">
                <Box>
                  <Box mb="40px">
                    <Logo2 w="120px" />
                  </Box>
                  <Stepper
                    index={activeStep}
                    orientation="vertical"
                    height="200px"
                    gap="0"
                    size="sm"
                  >
                    {steps.map((step, index) => (
                      <Step size="sm" key={index}>
                        <StepIndicator
                          style={{
                            border: "2px solid #12355A",
                            background: "#fff",
                          }}
                        >
                          <StepStatus
                            complete={<FaCircle color="#12355A" />}
                            active={<FaCircle color="#12355A" />}
                          />
                        </StepIndicator>

                        <Box flexShrink="0">
                          <StepTitle>{step.title}</StepTitle>
                        </Box>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                {activeStep > 0 && (
                  <Flex
                    alignItems={"center"}
                    cursor="pointer"
                    onClick={() => setActiveStep(activeStep - 1)}
                    color="black"
                    mt={10}
                  >
                    <MdChevronLeft fontSize={"22px"} />{" "}
                    <Text> {"Go Back"}</Text>
                  </Flex>
                )}
              </Flex>
              <Box w="60%">
                {activeStep === 0 && (
                  <VendorCategory
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                  />
                )}
                {activeStep === 1 && (
                  <VendorBusinessInfo
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                  />
                )}
                {activeStep === 2 && (
                  <VendorBusinessDocs
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                  />
                )}
                {activeStep === 3 && (
                  <>
                    <VendorTermsConditions
                      setActiveStep={setActiveStep}
                      activeStep={activeStep}
                      setCheckedItems={setCheckedItems}
                    />
                    <Flex justify="center" alignItems="center">
                      <Button
                        disabled={!checkedItems}
                        isLoading={loading}
                        onClick={handleSubmit}
                        width="200px"
                      >
                        Continue to Homepage
                      </Button>
                    </Flex>
                  </>
                )}
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VendorModal;
