import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "../../components/Button";
import Input, { TextArea } from "../../components/Input";
import { handleError } from "../../utility/helpers";
import instance from "../../utility/webservices";
import useModalHandler from "../Modals/SuccessModal";

function Support() {
  const [isLoading, setLoading] = useState(false);
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const schema = yup.object({
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Descriptive message is required"),
  });

  const methods = useForm({
    defaultValues: {
      message: "",
      subject: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await instance.post("/ticket", { ...data });
      reset();
      handleSuccessModal(
        "Your ticket has been subimtted, our customer success unit would respond to you shortly"
      );
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  return (
    <Box minH="75vh" py={5}>
      <SimpleGrid columns={[1, 1, 2, 2]} gap={[10, 10, 0, 0]}>
        <Box>
          <Card borderRadius={"8px"} pt="20px" pb="40px" flexFlow={"1"}>
            <CardHeader color="#666">
              <VStack align={"stretch"}>
                <Text fontSize={"20px"} color="secondary" fontWeight="600">
                  Submit Support Ticket
                </Text>
                <Text fontSize={"14px"}>
                  Need help? we’re ready to answer your question 24/7
                </Text>
              </VStack>
            </CardHeader>
            <CardBody py={0} fontSize="14px">
              <form>
                <VStack gap={"24px"} align={"stretch"} color={"#999"}>
                  <Controller
                    control={control}
                    name="subject"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"} mt="10px">
                        <Input
                          value={value}
                          onChange={onChange}
                          label="Subject"
                          placeholder="Add issue subject"
                          isRequired
                        />
                        <div style={{ color: "red" }}>
                          {errors["subject"] ? errors["subject"]?.message : ""}
                        </div>
                      </Box>
                    )}
                  />
                  <Controller
                    control={control}
                    name="message"
                    render={({ field: { onChange, value } }) => (
                      <Box w={"100%"} mt={"10px"}>
                        <TextArea
                          value={value}
                          onChange={onChange}
                          label="Message"
                          placeholder="Add issue description..."
                          isRequired
                        />
                        <div style={{ color: "red" }}>
                          {errors["message"] ? errors["message"]?.message : ""}
                        </div>
                      </Box>
                    )}
                  />

                  <Box mt={"18px"} ml={"0"}>
                    <Button
                      width={"100%"}
                      isLoading={isLoading}
                      onClick={handleSubmit(onSubmit)}
                      fontWeight="700"
                    >
                      Submit ticket
                    </Button>
                  </Box>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </Box>

        <Flex height="100%" alignItems="center" w="80%" m="auto">
          <Box>
            <Text fontSize={"20px"} color="secondary" fontWeight="600">
              Got questions, comments or feedback? We are here to help you with
              any questions or issues you may have. Drop a message and we will
              get back to you as soon as possible...
            </Text>
          </Box>
        </Flex>
      </SimpleGrid>
      {ModalComponent}
    </Box>
  );
}

export default Support;
