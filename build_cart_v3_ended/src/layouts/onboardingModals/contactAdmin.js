import {
  Box,
  Text,
  Heading,
  ModalBody,
  Center,
  useDisclosure,
  ModalContent,
  ModalOverlay,
  Modal,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import Input, { TextArea } from "../../components/Input";
import Button from "../../components/Button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { handleError, handleSuccess } from "../../utility/helpers";

const ContactAdmin = () => {
  const [loading, setLoading] = React.useState(false);

  const supportSchema = yup.object({
    email: yup.string().required("Email is required").email(),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Message is required"),
  });

  const methods = useForm({
    defaultValues: {
      message: "",
      subject: "",
      email: "",
    },
    resolver: yupResolver(supportSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    try {
      setLoading(false);
      onCloseModal();
      // handleSuccess("successful");
    } catch (error) {
      handleError(error);
    }
  };

  const onCloseModal = () => {
    reset();
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        isOpen={isOpen}
        size={"2xl"}
        onClose={onCloseModal}
      >
        <ModalOverlay />
        <ModalContent p="30px">
          <Flex pl="20px" position="relative">
            <Heading color="#F5862E" pt="3" fontSize={"24px"}>
              Contact Admin
            </Heading>
            <ModalCloseButton
              fontSize="10px"
              w="25px"
              h="25px"
              bg="#999999"
              color="#ffffff"
              borderRadius="50%"
            />
          </Flex>
          <ModalBody>
            <Box>
              <Text color="#999999">
                Send a message and we would get back to you
              </Text>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box fontSize="14px" mt="30px" mb="30px">
                <Box my={"20px"}>
                  <Text>
                    Email<span style={{ color: "red" }}>*</span>
                  </Text>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="email"
                    render={({ field: { value, onChange } }) => (
                      <Box w={"100%"}>
                        <Input
                          placeholder="example@cutstruct.com"
                          value={value}
                          onChange={onChange}
                          p="22px 10px"
                        />
                        <div style={{ color: "red" }}>
                          {errors["email"] ? errors["email"]?.message : ""}
                        </div>
                      </Box>
                    )}
                  />
                </Box>
                <Box my={"20px"}>
                  <Text>
                    Subject<span style={{ color: "red" }}>*</span>
                  </Text>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="subject"
                    render={({ field: { value, onChange } }) => (
                      <Box w={"100%"}>
                        <Input
                          placeholder="Add a subject"
                          value={value}
                          onChange={onChange}
                          p="22px 10px"
                        />
                        <div style={{ color: "red" }}>
                          {errors["subject"] ? errors["subject"]?.message : ""}
                        </div>
                      </Box>
                    )}
                  />
                </Box>
                <Box my={"20px"}>
                  <Text>
                    Message<span style={{ color: "red" }}>*</span>
                  </Text>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="message"
                    render={({ field: { value, onChange } }) => (
                      <Box w={"100%"}>
                        <TextArea
                          placeholder="Add message ..."
                          value={value}
                          onChange={onChange}
                        />
                        <div style={{ color: "red" }}>
                          {errors["message"] ? errors["message"]?.message : ""}
                        </div>
                      </Box>
                    )}
                  />
                </Box>
              </Box>

              <Center>
                <Button isSubmit full isLoading={loading}>
                  Submit
                </Button>
              </Center>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box textAlign="center" mt="20px">
        For any account related issue,{" "}
        <span
          style={{
            color: "#F5862E",
            marginLeft: "5px",
            cursor: "pointer",
          }}
          onClick={onOpen}
        >
          Contact the Admin
        </span>
      </Box>
    </div>
  );
};

export default ContactAdmin;
