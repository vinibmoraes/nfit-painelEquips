import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, SnackbarContent, styled } from "@mui/material";
import App from "./App";
import { DarkTheme, LightTheme } from "./shared/themes";
import NotificacaoPonto from "../src/services/notificacaoPonto";

// Escolha o tema (pode alternar dinamicamente depois)
const theme = DarkTheme;

// Customizando o SnackbarContent usando styled
const CustomSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.6)", // Fundo preto semi-transparente
  color: "#fff",
  backdropFilter: "blur(6px)", // Efeito de vidro fosco
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Sombra suave
  padding: "8px 16px", // Ajustando o padding
  width: "100%", // Garantir que ocupe toda a largura disponível
}));

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={2000}
      Components={{
        default: (props) => (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {/* Customizando o SnackbarContent diretamente com o estilo */}
            <CustomSnackbarContent
              message={props.message}
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.6)", // Garantir a transparência
                color: "#fff",
                backdropFilter: "blur(6px)", // Efeito de vidro fosco
                borderRadius: "8px", // Cantos arredondados
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Sombra suave
                padding: "8px 16px", // Ajustando o padding para uma aparência melhor
                width: "100%", // Garantir que ocupe toda a largura disponível
              }}
            />
          </div>
        ),
      }}
    >
      <NotificacaoPonto />
      <App />
    </SnackbarProvider>
  </ThemeProvider>
);
