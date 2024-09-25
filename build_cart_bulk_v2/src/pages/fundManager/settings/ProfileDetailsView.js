import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  HStack,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEnvelope } from "react-icons/fa";
import * as yup from "yup";
import Button from "../../../components/Button";
import Input, { InputPhone } from "../../../components/Input";
import CutUploadFileButton from "../../../components/UploadButtons/CutUploadFileButton";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/api/super-admin/superAdminSlice";
import { handleError } from "../../../utility/helpers";

export default function ProfileDetailsView() {
  const toast = useToast();
  const { data: profileData, isLoading, refetch } = useGetProfileQuery();

  const [
    updateFn,
    {
      isLoading: isSaving,
      isSuccess: savedSuccessfully,
      isError: isSavingHasError,
      error: savingError,
    },
  ] = useUpdateProfileMutation();

  const [profileImage, setProfileImage] = useState(null);

  const profileInfoSchema = yup.object({
    name: yup.string().required("Name is required"),
    phone: yup.string().required("Phone number is required"),
    email: yup.string().required("Email is required"),
  });

  const useFormData = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
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
    updateFn({
      data: {
        name: data.name,
        phone: data.phone,
        image: "https://placehold.it/80x80/ff00aa",
      },
    });
  };

  useEffect(() => {
    if (!profileData || !profileData.data) return;
    const { name, email, phoneNumber } = profileData.data;

    setValue("name", name);
    setValue("phone", phoneNumber);
    setValue("email", email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

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
    setProfileImage(file);
  };

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
          You can update and edit your profile detailsx
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
            name={profileData.data.name}
            size="lg"
            // src={profileDetails?.vendorProfile?.logo ?? ""}
            color={"#fff"}
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
                  placeholder="Name"
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
                  // onChange={onChange}
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

        <Box mt="44px">
          <Button
            full
            isSubmit
            isLoading={isSaving || isLoading}
            onClick={handleSubmit(submitForm)}
          >
            Save
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
