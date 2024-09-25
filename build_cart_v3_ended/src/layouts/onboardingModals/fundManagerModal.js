import React, { useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  ModalBody,
  useToast,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRegisterFundManagerMutation } from "../../redux/api/fundManager/fundManagerRegisterSlice";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import CutStructLogo from "../../assets/images/cutstructlogo.png";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useLocation } from "react-router-dom";

const FundManagerModal = () => {
  const [loading, setLoading] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const toast = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invitationId = queryParams.get("invId");
  const projectId = queryParams.get("prId");
  const sizeOptions = [
    { value: "MICRO", label: "Micro enterprises: 1 to 9 employees." },
    { value: "SMALL", label: "Small enterprises: 10 to 49 employees." },
    {
      value: "MEDIUM",
      label: "Medium-sized enterprises: 50 to 249 employees.",
    },
    { value: "LARGE", label: "Large enterprises: 250 employees or more" },
  ];

  const registerFundManagerSchema = yup.object({
    businessAddress: yup.string().required("Business name is required"),
    businessRegNo: yup.string().required("Registration Number is required"),
    size: yup.object().required("Business size is required"),
  });

  const methods = useForm({
    defaultValues: {
      businessAddress: "",
      businessRegNo: "",
    },
    resolver: yupResolver(registerFundManagerSchema),
  });

  const [registerFundManagerApi, { isLoading, isSuccess, error, isError }] =
    useRegisterFundManagerMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      toast({
        description: "You have successfully updated your account.",
        status: "success",
      });
      setLoading(false);
      onClose();

      window.location.replace("/fund-manager/dashboard?welcome=subscription");
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

  const onSubmit = (data) => {
    setLoading(true);
    registerFundManagerApi({
      UserId: user?.id,
      businessAddress: data.businessAddress,
      businessSize: data.size.value,
      businessRegNo: data.businessRegNo,
      invitationId,
      projectId,
      about:
        "Welcome to our company, we specialize in financing construction projects, offering tailored financial solutions that empower developers to bring their visions to life, ensuring successful and timely project completion.",
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
        size={"2xl"}
        onClose={() => {
          onClose();
          registerFundManagerApi({
            UserId: user?.id,
            invitationId,
            projectId,
            about: "Welcome to our company, We build dreams!",
          });
        }}
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="20%"
          backdropBlur="3px"
        />
        <ModalContent p="30px">
          <ModalCloseButton
            fontSize="10px"
            w="25px"
            h="25px"
            bg="#12355A"
            color="#ffffff"
            borderRadius="50%"
            mt={5}
          />
          <ModalBody>
            <Box
              bg="#ffffff"
              bgImage={CutStructLogo}
              bgRepeat="no-repeat"
              bgSize="cover"
              bgBlendMode="lighten"
              bgColor="rgba(255,255,255,.97)"
              padding="10px 30px"
            >
              <Box textAlign="center">
                <Heading color="#F5862E" mb="20px" fontSize={"28px"}>
                  Business Information
                </Heading>
                <Text color="#999999" my="20px">
                  To get the best out of cutstruct, add your business
                  information.
                </Text>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box fontSize="14px" mt="30px" mb="30px">
                  <Box my={"20px"}>
                    <Controller
                      control={control}
                      name="businessAddress"
                      render={({ field: { onChange, value } }) => (
                        <Box w={"100%"}>
                          <Input
                            placeholder="Business Address"
                            label="Business Address"
                            value={value}
                            onChange={onChange}
                            isRequired
                          />
                          <div style={{ color: "red" }}>
                            {errors["businessAddress"]
                              ? errors["businessAddress"]?.message
                              : ""}
                          </div>
                        </Box>
                      )}
                    />
                  </Box>
                  <Box my={"20px"}>
                    <Controller
                      control={control}
                      name="businessRegNo"
                      render={({ field: { onChange, value } }) => (
                        <Box w={"100%"}>
                          <Input
                            placeholder="RN-6547382910"
                            value={value}
                            label="Business Registration Number"
                            onChange={onChange}
                            isRequired
                          />
                          <div style={{ color: "red" }}>
                            {errors["businessRegNo"]
                              ? errors["businessRegNo"]?.message
                              : ""}
                          </div>
                        </Box>
                      )}
                    />
                  </Box>
                  <Box my={"20px"}>
                    <Controller
                      control={control}
                      name="size"
                      render={({ field: { onChange, value } }) => (
                        <Box w={"100%"}>
                          <CustomSelect
                            label="Business size"
                            placeholder="Business size"
                            isRequired
                            options={sizeOptions}
                            value={value}
                            onChange={onChange}
                          />
                          <div style={{ color: "red", fontSize: "14px" }}>
                            {errors["size"] ? errors["size"]?.message : ""}
                          </div>
                        </Box>
                      )}
                    />
                  </Box>
                </Box>

                <Center>
                  <Button isSubmit width="200px" isLoading={loading}>
                    Save
                  </Button>
                </Center>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FundManagerModal;
