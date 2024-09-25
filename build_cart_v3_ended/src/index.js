import { ColorModeScript } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./assets/fonts/fonts.css";
import { persistor, store } from "./redux/store/store";
import reportWebVitals from "./reportWebVitals";
import { PaymentProvider } from "./context/paymentContext/paymentContext";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ColorModeScript />
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="713184327504-adm3rdqholjcee34ec1mtmk7c3adgtke.apps.googleusercontent.com">
          <DndProvider backend={HTML5Backend}>
            <PaymentProvider>
              <App />
            </PaymentProvider>
          </DndProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
