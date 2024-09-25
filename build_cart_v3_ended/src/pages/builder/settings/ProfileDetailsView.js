import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  HStack,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import * as yup from "yup";
import Button from "../../../components/Button";
import Input, { InputPhone, TextArea } from "../../../components/Input";
import CutUploadFileButton from "../../../components/UploadButtons/CutUploadFileButton";
import { useUpdateProfileDetailsMutation } from "../../../redux/api/builder/settingsApiService";
import config from "../../../utility/config";
import { handleError, handleSuccess } from "../../../utility/helpers";

export default function ProfileDetailsView({
  profileDetails,
  isLoading,
  refetch,
}) {
  const [
    updateProfileDetails,
    {
      isLoading: isSaving,
      isSuccess: savedSuccessfully,
      isError: isSavingHasError,
      error: savingError,
    },
  ] = useUpdateProfileDetailsMutation();

  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const profileInfoSchema = yup.object({
    businessName: yup.string().required("Business name is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    about: yup.string().required("About us description is required"),
  });

  const useFormData = useForm({
    defaultValues: {
      businessName: "",
      phoneNumber: "",
      about: "",
    },
    resolver: yupResolver(profileInfoSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useFormData;

  const submitForm = async (data) => {
    // Upload the logo if available
    let uploadedUrl = profileDetails?.builderProfile?.Builder?.logo ?? "";
    let signatureUrl =
      profileDetails?.builderProfile?.Builder?.BusinessContactSignature ?? "";
    if (logoFile) {
      uploadedUrl = await uploadFileFetch(logoFile);
    }
    if (signatureFile) {
      signatureUrl = await uploadFileFetch(signatureFile);
    }
    updateProfileDetails({
      businessName: data?.businessName,
      about: data?.about,
      logo: uploadedUrl,
      BusinessContactSignature: signatureUrl,
    });
  };

  useEffect(() => {
    // setBuilderProfile(profileDetails.builderProfile)
    if (profileDetails) {
      setValue(
        "businessName",
        profileDetails?.builderProfile?.Builder?.businessName,
      );
      setValue("email", profileDetails?.builderProfile?.Builder?.email);
      setValue("about", profileDetails?.builderProfile?.Builder?.about);
      setValue("phoneNumber", profileDetails?.builderProfile?.phoneNumber);
    }
  }, [profileDetails, isLoading, setValue]);

  useEffect(() => {
    if (savedSuccessfully) {
      handleSuccess("Information Saved...");
      refetch();
    }
    if (isSavingHasError) {
      handleError(savingError);
    }
  }, [isSaving]);

  const onProfilePictureSelected = (file) => {
    setLogoFile(file);
  };
  const onSignatureSelected = (file) => {
    setSignatureFile(file);
  };

  async function uploadFileFetch(file) {
    let formData = new FormData();
    formData.append(`file`, file);
    formData.append("timestamp", (Date.now() / 1000) | 0);
    formData.append("api_key", `${config.CLOUD_KEY}`);
    formData.append("upload_preset", "cutstruct");
    formData.append("folder", "builder");
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/cutstruct-technology-limited/image/upload`,
      formData,
    );
    return response.data.url;
  }

  if (isLoading)
    return (
      <Box w="full" mx="auto" p="40px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#12355A"
          size="xl"
        />
      </Box>
    );

  return (
    <Box bg="white" p="24px" borderRadius="8px">
      <VStack align="start">
        <Text fontWeight="600" color="secondary">
          Profile Details
        </Text>
        <Text fontSize="12px" color="primary">
          You can update and edit your profile details
        </Text>
      </VStack>

      {/*<form onSubmit={handleSubmit(submitForm)}>*/}
      <VStack
        spacing="24px"
        align="stretch"
        mt="24px"
        w={{ lg: "66.8%", sm: "100%" }}
      >
        <Text fontSize="14px" color="neutral3">
          Logo <span style={{ color: "red" }}>*</span>
        </Text>
        <HStack spacing="40px">
          <Avatar
            name={profileDetails?.builderProfile?.Builder?.businessName}
            size="lg"
            src={profileDetails?.builderProfile?.Builder?.logo ?? ""}
            bg="neutral3"
          />
          <CutUploadFileButton
            text="Click to change profile picture"
            onFileSelected={onProfilePictureSelected}
          />
        </HStack>

        <Flex direction="column">
          <Controller
            control={control}
            name="businessName"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  label="Name"
                  isRequired={true}
                  placeholder="Business Name"
                  value={value}
                  onChange={onChange}
                  p="22px 10px"
                  name="businessName"
                />
                <div style={{ color: "red" }}>
                  {errors["businessName"]
                    ? errors["businessName"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
        </Flex>

        <Box align="start">
          <Controller
            control={control}
            defaultValue=""
            name="email"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  name="email"
                  placeholder="yourname@example.com"
                  value={value}
                  onChange={onChange}
                  leftIcon={<FaEnvelope />}
                  label="Email Address"
                  isRequired
                  isDisabled
                />
                <div style={{ color: "red" }}>
                  {errors["email"] ? errors["email"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>

        <Box>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <Flex direction="column">
                <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                  Phone Number <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <InputPhone
                  name="phoneNumber"
                  value={value}
                  onChange={onChange}
                />
              </Flex>
            )}
          />
        </Box>
        <Box>
          <Controller
            control={control}
            name="about"
            render={({ field: { onChange, value } }) => (
              <Flex direction="column">
                <TextArea
                  name="about"
                  value={value}
                  onChange={onChange}
                  label="About Us"
                  isRequired
                  placeholder="Add a description about your business"
                />
              </Flex>
            )}
          />
        </Box>
      </VStack>

      <Box w={{ sm: "100%", lg: "41%" }} mt={"62px"}>
        <Box mt="57px">
          {profileDetails?.builderProfile?.Builder
            ?.BusinessContactSignature && (
            <Link
              href={
                profileDetails?.builderProfile?.Builder
                  ?.BusinessContactSignature
              }
              isExternal
              color="secondary"
              mb="8px"
              fontSize="14px"
              fontWeight="600"
            >
              Signature File:{" "}
              {profileDetails?.builderProfile?.Builder?.BusinessContactSignature.split(
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

        <Box mt="44px">
          <Button
            full
            isSubmit
            isLoading={isSaving}
            onClick={handleSubmit(submitForm)}
          >
            Save
          </Button>
        </Box>
      </Box>
      {/*</form>*/}
    </Box>
  );
}
