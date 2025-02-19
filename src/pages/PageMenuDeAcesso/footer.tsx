import React from "react";
import { Box, Typography } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton, Tooltip } from "@mui/material";

const Footer: React.FC = () => {
  const handleMapClick = () => {
    window.open(
      "https://www.google.com.br/maps/d/edit?mid=1eyliVZGdAupULChAry8ZDpS_UCDNAKU&ll=-9.824164549175668%2C-49.41394982406761&z=4",
      "_blank"
    );
  };
  const handleHomeClick = () => {
    window.open(
      "https://www.notion.so/H-O-M-E-Equipamentos-9608fdc443a64c0790e6a3945d02a930",
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#F2F2F2",
        borderTop: "1px solid #e0e0e0",
        padding: "10px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px", // Espaço entre o ícone e o texto
      }}
    >
      {/* Ícone de Mapa */}
      <Tooltip title="Acessar Mapa de parceiros">
        <IconButton
          onClick={handleMapClick}
          sx={{
            position: "absolute",
            left: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            boxShadow: 3,
            width: "32px", // Tamanho reduzido do botão
            height: "32px", // Tamanho reduzido do botão
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <MapIcon sx={{ color: "#1976d2" }} />
        </IconButton>
      </Tooltip>

      {/* Ícone de Casa ao lado do ícone de Mapa */}
      <Tooltip title="Acessar Home dos equipamentos">
        <IconButton
          onClick={handleHomeClick}
          sx={{
            position: "absolute",
            left: "64px", // Ajuste a distância para ficar ao lado do ícone de mapa
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            boxShadow: 3,
            width: "32px", // Tamanho reduzido do botão
            height: "32px", // Tamanho reduzido do botão
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <HomeIcon sx={{ color: "#1976d2", fontSize: "24px" }} />{" "}
          {/* Ícone menor */}
        </IconButton>
      </Tooltip>

      {/* Texto do rodapé */}
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Next Fit. Time de equipamentos.
      </Typography>
    </Box>
  );
};

export default Footer;
