import {
  Box,
  Flex,
  Link,
  Text,
  VStack,
  Switch,
  Spacer,
  HStack,
  Avatar,
  Spinner,
  useToast,
  FormLabel,
} from "@chakra-ui/react";
import Input, { InputPhone, TextArea } from "../../../components/Input";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEnvelope } from "react-icons/fa";
import CutUploadFileButton from "../../../components/UploadButtons/CutUploadFileButton";
import Button from "../../../components/Button";
import { useUpdateProfileDetailsMutation } from "../../../redux/api/vendor/settingsApiService";
import { handleError } from "../../../utility/helpers";
import axios from "axios";
import config from "../../../utility/config";

export default function ProfileDetailsView({
  profileDetails,
  isLoading,
  refetch,
}) {
  const toast = useToast();
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
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);

  const profileInfoSchema = yup.object({
    name: yup.string().required("Business name is required"),
    phone: yup.string().required("Phone number is required"),
    about: yup.string().required("About us description is required"),
  });

  const onSignatureSelected = (file) => {
    setSignatureFile(file);
  };

  const useFormData = useForm({
    defaultValues: {
      name: "",
      phone: "",
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
    let uploadedUrl = profileDetails?.vendorProfile?.logo ?? "";
    let signatureUrl =
      profileDetails.vendorProfile?.BusinessContactSignature ?? "";
    if (logoFile) {
      uploadedUrl = await uploadFileFetch(logoFile);
    }
    if (signatureFile) {
      signatureUrl = await uploadFileFetch(signatureFile);
    }
    updateProfileDetails({
      name: data.businessName,
      about: data.about,
      phone: data.phone,
      logo: uploadedUrl,
      signatures: [signatureUrl],
      twoFactorAuthEnabled: enableTwoFactor,
    });
  };

  useEffect(() => {
    // setBuilderProfile(profileDetails.vendorProfile)
    if (profileDetails) {
      setValue("name", profileDetails?.vendorProfile?.businessName);
      setValue("email", profileDetails?.vendorProfile?.email);
      setValue("about", profileDetails?.vendorProfile?.about);
      setValue("phone", profileDetails?.vendorProfile?.phone);
    }
  }, [profileDetails, isLoading, setValue]);

  useEffect(() => {
    if (savedSuccessfully) {
      toast({
        status: "success",
        position: "top",
        description: "Information Saved...",
      });
      refetch();
    }
    if (isSavingHasError) {
      handleError(savingError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  const onProfilePictureSelected = (file) => {
    setLogoFile(file);
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
      formData
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
            name="Company Name"
            size="lg"
            src={profileDetails?.vendorProfile?.logo ?? ""}
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
            name="name"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  label="Name"
                  isRequired={true}
                  placeholder="Business Name"
                  value={value}
                  onChange={onChange}
                  p="22px 10px"
                  name="name"
                />
                <div style={{ color: "red" }}>
                  {errors["name"] ? errors["name"]?.message : ""}
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
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Flex direction="column">
                <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                  Phone Number <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <InputPhone name="phone" value={value} onChange={onChange} />
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

        <Box mt="24px">
          <Flex align="center">
            <Text fontWeight={"400"} color="neutral1">
              Add a Two-factor authentication
            </Text>
            <Spacer />
            <Switch
              colorScheme="orange"
              onChange={(e) => setEnableTwoFactor(e.target.checked)}
              value={enableTwoFactor}
            />
          </Flex>
          <Text color="neutral3">
            This adds a layer of security to your account
          </Text>
        </Box>

        <Box mt="57px">
          {profileDetails?.vendorProfile?.BusinessContactSignature && (
            <Link
              href={profileDetails?.vendorProfile?.BusinessContactSignature}
              isExternal
              color="secondary"
              mb="8px"
              fontSize="14px"
              fontWeight="600"
            >
              Signature File:{" "}
              {profileDetails?.vendorProfile?.BusinessContactSignature.split(
                "/"
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
      </VStack>
    </Box>
  );
}
