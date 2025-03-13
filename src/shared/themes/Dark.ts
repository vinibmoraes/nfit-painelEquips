import { createTheme } from "@mui/material/styles";
import { grey, purple } from "@mui/material/colors";

export const DarkTheme = createTheme({
  palette: {
    primary: {
      main: purple[600],
      dark: purple[800],
      light: purple[400],
      contrastText: "#ffffff",
    },
    secondary: {
      main: grey[700],
      dark: grey[900],
      light: grey[500],
      contrastText: "#ffffff",
    },
    background: {
      default: "#202124",
      paper: "#303134",
    },
  },
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(50, 50, 50, 0.6) !important", // Opacidade ajustada
          backdropFilter: "blur(6px)", // Suaviza o fundo
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "none", // Remove sombra forte
        },
      },
    },
  },
});
