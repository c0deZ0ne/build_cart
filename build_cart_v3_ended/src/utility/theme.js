import { extendTheme } from "@chakra-ui/react";

const zIndices = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

const theme = extendTheme({
  fonts: {
    heading: "'Graphik', sans-serif",
    body: "Graphik, sans-serif",
  },
  zIndices,
  colors: {
    primary: "#12355a",
    secondary: "#f5852c",
    info: "#999999",
    background: "#eef3ff",
    neutral1: "#333333",
    neutral3: "#999999",
    success: "#1C903D",
    danger: "#C43C25",
  },
  breakpoints: {
    base: "0em",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
  },
  // colors: {
  //   red: {
  //     500: "#efefe",
  //     400: "#F05C36",
  //     300: "#F06944",
  //     200: "#F3937A",
  //     100: "#F5BDB7",
  //   },
  //   orange: {
  //     orange500: "#F5862E",
  //     orange400: "#F79749",
  //     orange300: "#FBBA7F",
  //     orange200: "#FCC38D",
  //     orange100: "#FEE8C9",
  //   },
  //   gray: {
  //     gray500: "#524F4E",
  //     gray400: "#606060",
  //     gray300: "#858383",
  //     gray200: "#C0C0C1",
  //     gray100: "#E7E8E9",
  //   },
  //   background: "#EEF3FF",
  //   primary: "#12355A",
  //   white: "#FFFFFF",
  //   black: "#292F33",
  // },
  initialColorMode: "light",
  useSystemColorMode: false,
});

export default theme;
