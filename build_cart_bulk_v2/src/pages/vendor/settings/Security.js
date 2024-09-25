import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Link,
  useToast,
  Switch,
  Spacer,
} from "@chakra-ui/react";
import Button from "../../../components/Button";
import { Controller, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useChangePasswordMutation } from "../../../redux/api/user/userPasswordSlice";
import Input from "../../../components/Input";
import PasswordChecker from "../../../components/PasswordChecker/PasswordChecker";
import { handleError } from "../../../utility/helpers";
import CutUploadFileButton from "../../../components/UploadButtons/CutUploadFileButton";

export default function VendorSecurity({ profileDetails, isLoading, refetch }) {
  const [signatureFile, setSignatureFile] = useState(null);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const toast = useToast();

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

  const onSignatureSelected = (file) => {
    setSignatureFile(file);
  };

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
                <Text>Old Password</Text>
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
                <Text>New Password</Text>
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
          <Text fontWeight="600" color="secondary">
            Two Factor Authentication
          </Text>

          <Box mt="20px">
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
            <Text fontSize="14px" color="neutral3">
              This adds a layer of security to your account
            </Text>
          </Box>

          <Box mt="20px">
            {profileDetails?.vendorProfile?.BusinessContactSignature && (
              <Link
                isExternal
                color="secondary"
                mb="8px"
                fontSize="14px"
                fontWeight="600"
              >
                Signature File:{" "}
                {profileDetails?.vendorProfile?.BusinessContactSignature.split(
                  "/",
                ).pop()}
              </Link>
            )}
            <CutUploadFileButton
              text="Click to uplaod file"
              title="Upload Signature (business contact person)"
              caption="Upload type: JPEG / PNG / PDF"
              accept="image/*,.pdf"
              onFileSelected={onSignatureSelected}
            />
          </Box>
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
