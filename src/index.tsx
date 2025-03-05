import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import App from "./App";
import { SnackbarContent } from "@mui/material";
import NotificacaoPonto from "../src/services/notificacaoPonto";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <SnackbarProvider
    maxSnack={1}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    autoHideDuration={2000}
    Components={{
      default: (props) => (
        <SnackbarContent
          style={{
            backgroundColor: "rgba(50, 50, 50, 0.7) !important", // Transparência aplicada
            color: "#fff",
            backdropFilter: "blur(4px)", // Desfoque
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)", // Sombra leve
          }}
          message={props.message}
        />
      ),
    }}
  >
    {/* Componente que dispara os lembretes de ponto */}
    <NotificacaoPonto />
    <App />
  </SnackbarProvider>
);
