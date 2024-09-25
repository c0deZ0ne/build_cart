import { createStandaloneToast } from "@chakra-ui/react";
import { isArray, capitalize } from "lodash";
import moment from "moment";
const { toast } = createStandaloneToast();

export const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
export const pawdRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const newPawdRegExp = /^.{8,}$/;
export const regNumRegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

export const generateRandomPassword = () => {
  let length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export const weeksDiff = (date1, date2) => {
  const start = moment(date1);
  const end = moment(date2);

  return end.diff(start, "weeks");
};

export const daysDiff = (date1, date2) => {
  const start = moment(date1);
  const end = moment(date2);

  return end.diff(start, "days");
};

export const handleSuccess = (message) => {
  toast({
    description: message,
    status: "success",
    position: "top-right",
    variant: "left-accent",
  });
  return message;
};

export const handleError = (error) => {
  const errorMessage =
    isArray(error?.response?.data?.message) || isArray(error?.data?.message)
      ? error?.response?.data?.message[0] || error?.data?.message[0]
      : error?.response?.data?.message || error?.data?.message
      ? error?.response?.data?.message || error?.data?.message
      : error.error
      ? error?.error
      : typeof error == "string"
      ? error
      : "Unable to handle request, please try again.";
  toast({
    description: errorMessage,
    status: "error",
    position: "top-right",
    variant: "left-accent",
  });
  return errorMessage;
};

/**
 * Adds transparency to a hex color code.
 *
 * @param {string} hexColor - The hex color code (e.g., "#FF5733").
 * @param {number} transparency - The transparency value between 0 and 1 (e.g, 0.3 or 0.43).
 * @returns {string} - The rgba color code.
 */
export function addTransparency(hexColor, transparency) {
  // Ensure the transparency value is between 0 and 1
  transparency = Math.max(0, Math.min(1, transparency));

  // Convert hex color to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Return the rgba color
  return `rgba(${r}, ${g}, ${b}, ${transparency})`;
}

/**
 *
 * @param {string} fileName
 * @returns {string}
 */
export function getFileExtension(fileName) {
  return fileName && fileName?.split(".").pop();
}

export default function sentenceCase(word) {
  if (!word) return;
  return word
    .split(" ")
    .map((e) => capitalize(e))
    .join(" ");
}
