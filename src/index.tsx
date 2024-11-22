import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <SnackbarProvider
    maxSnack={1}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    autoHideDuration={2000}
  >
    <App />
  </SnackbarProvider>
);
