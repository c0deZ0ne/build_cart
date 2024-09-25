import React, { useEffect } from "react";
import { Box, Text, Flex, useToast, Heading, Link } from "@chakra-ui/react";
import Button from "../../components/Button";
import { FaLock } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../../redux/api/user/userPasswordSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthLayout from "./AuthLayout";
// import { Link } from "react-router-dom";
import PasswordChecker from "../../components/PasswordChecker/PasswordChecker";
import Input from "../../components/Input";
import { handleError } from "../../utility/helpers";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../../redux/store/store";
import { logout } from "../../redux/features/user/userSlice";
import { useHistory } from "react-router-dom";

export default function ChangeAdminPassword() {
  const toast = useToast();

  const passwordSchema = yup.object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .matches(
        /^(?=.*\d)(?=.*[~!@£#$%^&*()_\-+=,.<>?/|':;{}])[A-Za-z\d~!@£#$%^&*()_\-+=,.<>?/|':;{}]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });
  const history = useHistory();
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
      history.push("/super-admin/dashboard");
    }
    if (isSavingHasError) {
      handleError(savingError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  const dispatch = useDispatch();
  const userInfo = useSelector(userData);

  const logoutHandle = () => {
    localStorage.clear();
    if (userInfo?.data?.token) {
      dispatch(logout());
      history.push("/admin/login");
    }
  };
  return (
    <AuthLayout>
      <Flex direction="column" h="90vh" justify="space-around">
        <form
          style={{ padding: "70px 0 10px" }}
          onSubmit={handleSubmit(submitForm)}
        >
          <Heading color="#F5862E" fontSize={["24px", "34px"]}>
            Create Password
          </Heading>
          <Text color="#999999" my="10px">
            In order to proceed create your password, ensure your password has:
          </Text>

          <PasswordChecker control={control} />

          <Box fontSize="14px" my="30px">
            <Box my="20px">
              <Text>
                Old Password <span style={{ color: "red" }}>*</span>
              </Text>
              <Controller
                name="oldPassword"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <Input
                      type={"password"}
                      value={value}
                      onChange={onChange}
                      placeholder="Enter old password"
                      leftIcon={<FaLock />}
                    />
                    <div style={{ color: "red" }}>
                      {errors["oldPassword"]
                        ? errors["oldPassword"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box my="20px">
              <Text>
                New Password <span style={{ color: "red" }}>*</span>
              </Text>
              <Controller
                name="newPassword"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box>
                    <Input
                      type={"password"}
                      value={value}
                      onChange={onChange}
                      placeholder="Enter new Password"
                      leftIcon={<FaLock />}
                    />
                    <div style={{ color: "red" }}>
                      {errors["newPassword"]
                        ? errors["newPassword"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>
          </Box>
          <Button full isSubmit isLoading={isSaving}>
            Create Password
          </Button>
        </form>
        <Box my="50px">
          <Box textAlign="center" mt="20px">
            Back to
            <Link onClick={logoutHandle}>
              <span
                style={{
                  color: "#F5862E",
                  marginLeft: "5px",
                  fontWeight: 600,
                }}
              >
                Login
              </span>
            </Link>
          </Box>
        </Box>
      </Flex>
    </AuthLayout>
  );
}
