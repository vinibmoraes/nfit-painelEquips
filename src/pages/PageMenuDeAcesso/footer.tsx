import React from "react";
import { Box, Typography } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton, Tooltip } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

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

  const handleScheduleClick = () => {
    window.open("https://calendar.google.com/calendar/u/0/r?pli=1", "_blank");
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
        justifyContent: "space-between", // Distribute items with space between
        alignItems: "center",
      }}
    >
      {/* Ícones à esquerda */}
      <Box sx={{ display: "flex", gap: "10px" }}>
        {/* Ícone de Mapa */}
        <Tooltip title="Acessar Mapa de parceiros">
          <IconButton
            onClick={handleMapClick}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "50%",
              boxShadow: 3,
              width: "32px",
              height: "32px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <MapIcon sx={{ color: "#1976d2" }} />
          </IconButton>
        </Tooltip>

        {/* Ícone de Casa */}
        <Tooltip title="Acessar Home dos equipamentos">
          <IconButton
            onClick={handleHomeClick}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "50%",
              boxShadow: 3,
              width: "32px",
              height: "32px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <HomeIcon sx={{ color: "#1976d2", fontSize: "24px" }} />
          </IconButton>
        </Tooltip>

        {/* Ícone de Agenda */}
        <Tooltip title="Acessar Agenda">
          <IconButton
            onClick={handleScheduleClick}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "50%",
              boxShadow: 3,
              width: "32px",
              height: "32px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <EventIcon sx={{ color: "#1976d2", fontSize: "24px" }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Texto centralizado */}
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: "center", flexGrow: 1 }} // Centraliza o texto
      >
        © {new Date().getFullYear()} Next Fit. Time de equipamentos.
      </Typography>

      {/* Versão beta alinhada à direita */}
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: "right" }}
      >
        versão beta 1.0
      </Typography>
    </Box>
  );
};

export default Footer;
