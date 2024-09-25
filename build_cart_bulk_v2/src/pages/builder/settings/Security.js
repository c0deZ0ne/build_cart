import {
  Box,
  Flex,
  Spacer,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import * as yup from "yup";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import PasswordChecker from "../../../components/PasswordChecker/PasswordChecker";
import { useChangePasswordMutation } from "../../../redux/api/user/userPasswordSlice";
import { handleError } from "../../../utility/helpers";

export default function BuilderSecurity() {
  const toast = useToast();
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const passwordSchema = yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .matches(
        /^(?=.*\d)(?=.*[~!@£#$%^&*()_\-+=,.<>?/|':;{}])[A-Za-z\d~!@£#$%^&*()_\-+=,.<>?/|':;{}]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
      ),
  });

  const useFormData = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    resolver: yupResolver(passwordSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormData;

  const [
    changePassword,
    {
      isLoading: isSaving,
      isSuccess: savedSuccessfully,
      isError: isSavingHasError,
      error: savingError,
    },
  ] = useChangePasswordMutation();

  const submitForm = (data) => {
    changePassword(data);
  };

  useEffect(() => {
    if (savedSuccessfully) {
      toast({
        status: "success",
        position: "top",
        description: "Password changed successfully",
      });
    }
    if (isSavingHasError) {
      handleError(savingError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  return (
    <Box w={{ sm: "100%", lg: "41%" }} p="24px">
      <VStack align="start">
        <Text fontWeight="600" color="secondary">
          Security
        </Text>
        <Text fontSize="12px" color="primary">
          You can update and edit your security details.
        </Text>
      </VStack>
      <form onSubmit={handleSubmit(submitForm)}>
        <Box mt="24px">
          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange, value } }) => (
              <Flex direction="column">
                <Text fontSize={"14px"} color={"#666666"}>
                  New Password
                </Text>
                <Input
                  type="password"
                  value={value}
                  onChange={onChange}
                  placeholder="⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺"
                  leftIcon={<FaLock />}
                />
                <div style={{ color: "red", fontSize: "14px" }}>
                  {errors["oldPassword"] ? errors["oldPassword"]?.message : ""}
                </div>
              </Flex>
            )}
          />
        </Box>

        <Box mt="24px">
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <Flex direction="column">
                <Text fontSize={"14px"} color={"#666666"}>
                  New Password
                </Text>
                <Input
                  type="password"
                  value={value}
                  onChange={onChange}
                  placeholder="⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺"
                  leftIcon={<FaLock />}
                />
                <div style={{ color: "red", fontSize: "14px" }}>
                  {errors["newPassword"] ? errors["newPassword"]?.message : ""}
                </div>
                {errors["newPassword"] && (
                  <div style={{ color: "red", fontSize: "14px" }}>
                    Error! password does not conform with the security measures.
                    <PasswordChecker control={control} />
                  </div>
                )}
              </Flex>
            )}
          />
        </Box>

        <Box mt="40px">
          <Flex align="center">
            <Text fontWeight={"400"} color="neutral1">
              Add a Two-factor authentication
            </Text>
            <Spacer />
            <Switch
              colorScheme="orange"
              onChange={(e) => setEnableTwoFactor(e.target.checked)}
              value={enableTwoFactor}
              isReadOnly
            />
          </Flex>
          <Text color="neutral3">
            This adds a layer of security to your account
          </Text>
        </Box>

        <Box mt="44px">
          <Button full isSubmit isLoading={isSaving}>
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
}
