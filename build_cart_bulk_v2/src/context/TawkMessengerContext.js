import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { createContext, useContext, useRef } from "react";

const TawkMessengerContext = createContext(null);

export const useTawkMessenger = () => {
  return useContext(TawkMessengerContext);
};

export const TawkMessengerProvider = ({ children }) => {
  const tawkMessengerRef = useRef();

  const handleMaximize = () => {
    if (tawkMessengerRef.current) {
      tawkMessengerRef.current.maximize();
    }
  };

  const value = { handleMaximize };

  return (
    <TawkMessengerContext.Provider value={value}>
      {children}
      <TawkMessengerReact
        propertyId="651d48e810c0b257248872ed"
        widgetId="1hbt69je2"
        ref={tawkMessengerRef}
      />
    </TawkMessengerContext.Provider>
  );
};
