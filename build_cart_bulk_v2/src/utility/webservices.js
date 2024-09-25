import axios from "axios";
import config from "./config";
import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

const instance = axios.create({
  baseURL: `${config.API_BASE_URL}`,
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    config.headers = { Authorization: `Bearer ${token}` };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 ||
      error.response.data.statusCode === 401
    ) {
      toast({
        description: "Error! session has expired, redirecting to login...",
        status: "error",
        position: "bottom-right",
        variant: "left-accent",
      });
      localStorage.clear();
      return (window.location.href = "/");
    }
    return Promise.reject(error);
  },
);

export default instance;
