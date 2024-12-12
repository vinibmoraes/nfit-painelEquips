import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import logo from "../../assets/logo-roxa-nextfit.webp";

const PageLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const navlogintomenu = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const validateLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validateLoginURL = (process.env.REACT_APP_API_LOGIN_URL =
      "https://apiadm.nextfit.com.br/api/token");
    const grant_type = "password";
    const payload = `username=${email}&password=${password}&grant_type=${grant_type}&code=${code}`;

    try {
      const responseLogin = await fetch(validateLoginURL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
      });

      const responseData = await responseLogin.json();
      if (!email || !password || !code) {
        enqueueSnackbar("Preencha todos os campos!", { variant: "warning" });
        return;
      }

      if (responseLogin.ok && responseData.refresh_token) {
        const refresh_tokenInterno = responseData.refresh_token;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 5);
        localStorage.setItem("refresh_tokenInterno", refresh_tokenInterno);
        localStorage.setItem("expires_at", expiresAt.toISOString());
        enqueueSnackbar("Login bem-sucedido!", { variant: "success" });
        setTimeout(() => navlogintomenu("/pageMenuDeAcesso"), 1000);
      } else {
        enqueueSnackbar("Erro: verifique suas informações.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Erro na requisição.", { variant: "error" });
      console.error(error);
    }
  };

  //html-CSS em MUI

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #e6d5f6 0%, #dacae9 25%, #c88ce1 50%, #a064c8 75%, #783cb4 100%)",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 250,
              height: "auto",
              marginBottom: "50px",
              marginTop: "20px",
            }}
          />
        </Box>
        <Box component="form" onSubmit={validateLogin} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Código de Acesso"
                type="text"
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#8323A0" }}
          >
            Entrar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PageLogin;
