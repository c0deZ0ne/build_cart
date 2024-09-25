import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { HelmetProvider } from "react-helmet-async";
import "react-phone-input-2/lib/style.css";
import { TawkMessengerProvider } from "./context/TawkMessengerContext";
import "./head.css";
import Routes from "./routes/Index";
import theme from "./utility/theme";

const defaultOptions = {
  position: "top-right",
  variant: "left-accent",
  isClosable: true,
};

function App() {
  return (
    <div className="App">
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions,
        }}
      >
        <HelmetProvider>
          <TawkMessengerProvider>
            <Routes />
          </TawkMessengerProvider>
        </HelmetProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
