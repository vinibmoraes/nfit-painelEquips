import React, { useState, useEffect } from "react";
import EmailIcon from "@mui/icons-material/Email";
import iconPainel from "../assets/icon-nextfit.webp";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AlignHorizontalCenter } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";

interface Usuario {
  nome: string;
  email: string;
}

interface Base {
  Id: number;
  Nome: string;
  AlunosAtivos: number;
}

const PageMenuDeAcesso: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [baseSelecionada, setBaseSelecionada] = useState<Base | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const buscarBases = async () => {
    const emailClienteSemEspaco = email.trim();
    const urlBuscaCliente = `https://apiadm.nextfit.com.br/api/Cadastro/ListarView?Ativacao=null&DataCancelamentoFinal=null&DataCancelamentoInicial=null&DataInicioFinal=null&DataInicioInicial=null&DataUltimoAcessoFinal=null&DataUltimoAcessoInicial=null&EmAtencao=null&PesquisaGeral=${emailClienteSemEspaco}&RealizouTreinamento=null&Status=%5B1,3,2,5,6%5D&Trial=null&Vip=null&page=1&sort=%5B%7B%22property%22:%22DataCriacao%22,%22direction%22:%22desc%22%7D,%7B%22property%22:%22Id%22,%22direction%22:%22desc%22%7D%5D`;

    const refresh_tokenInterno = localStorage.getItem("refresh_tokenInterno");

    if (!refresh_tokenInterno) {
      console.error("Token não encontrado no localStorage");
      return;
    }

    try {
      const response = await fetch(urlBuscaCliente, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refresh_tokenInterno}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar bases");

      const data = await response.json();
      const basesEncontradas: Base[] = data.Content;

      if (basesEncontradas.length === 1) {
        selecionarBase(basesEncontradas[0]);
      } else if (basesEncontradas.length > 1) {
        setBases(basesEncontradas);
        setModalOpen(true);
      } else {
        console.log("Nenhuma base encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar bases:", error);
    }
  };

  const buscarUsuarios = async (codigoCadastro: number) => {
    const urlUsuarios = `https://apiadm.nextfit.com.br/api/Usuario/RecuperarUsuariosCadastro?AcessoBloqueado=false&CodigoCadastro=${codigoCadastro}&Inativo=false&limit=20&page=1&sort=%5B%7B%22property%22:%22Inativo%22,%22direction%22:%22asc%22%7D,%7B%22property%22:%22TipoPerfil%22,%22direction%22:%22asc%22%7D,%7B%22property%22:%22Nome%22,%22direction%22:%22asc%22%7D%5D`;

    const refresh_tokenInterno = localStorage.getItem("refresh_tokenInterno");

    if (!refresh_tokenInterno) {
      console.error("Token não encontrado no localStorage");
      return;
    }

    try {
      const response = await fetch(urlUsuarios, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refresh_tokenInterno}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar usuários");

      const data = await response.json();
      setUsuarios(
        data.Content.map((usuario: any) => ({
          nome: usuario.Nome,
          email: usuario.Email,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    buscarBases();
  };

  const selecionarBase = (base: Base) => {
    setBaseSelecionada(base);
    setModalOpen(false);
    buscarUsuarios(base.Id);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <EmailIcon />
        <TextField
          placeholder="Digite o e-mail do cliente"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            maxWidth: 400, // Define uma largura máxima
            width: "100%", // Garante que seja responsivo até o limite de maxWidth
          }}
        />
        <Button type="submit" variant="contained">
          Buscar
        </Button>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%", // Ajuste para telas menores
            maxWidth: 500, // Largura máxima
            maxHeight: "80vh", // Altura máxima
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: "divider",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Para garantir que o conteúdo não extrapole
          }}
        >
          {/* Cabeçalho fixo */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              bgcolor: "background.paper",
              zIndex: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              padding: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Selecione uma Base:
              </Typography>
            </Box>
          </Box>

          {/* Área rolável */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto", // Ativa o scroll vertical
              padding: 2,
            }}
          >
            {bases.map((base) => (
              <Box
                key={base.Id}
                sx={{
                  cursor: "pointer",
                  padding: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  mb: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => selecionarBase(base)}
              >
                <Typography>
                  <strong>Unidade:</strong> {base.Nome}
                </Typography>
                <Typography>
                  <strong>Alunos ativos:</strong> {base.AlunosAtivos}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Botão fixo no final */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "background.paper",
              zIndex: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              padding: 2,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setModalOpen(false)}
              sx={{
                backgroundColor: "#8323A0",
                "&:hover": { backgroundColor: "#6f1f8e" },
              }}
            >
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
      {usuarios.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              width: "80%", // Define a largura da tabela (ajuste conforme necessário)
              maxWidth: 600, // Largura máxima da tabela
              boxShadow: 3, // Adiciona sombra
              borderRadius: 2, // Bordas arredondadas
              overflow: "hidden", // Garante que o conteúdo não extrapole
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#8323A0", // Fundo do cabeçalho
                  }}
                >
                  <TableCell
                    sx={{
                      color: "white", // Cor do texto no cabeçalho
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    Usuário
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white", // Cor do texto no cabeçalho
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    E-mail
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem", // Ajuste do tamanho do texto
                        whiteSpace: "nowrap", // Evita quebras de linha
                        overflow: "hidden", // Garante que o texto não extrapole
                        textOverflow: "ellipsis", // Adiciona reticências caso o texto seja muito longo
                      }}
                    >
                      {usuario.nome}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem", // Ajuste do tamanho do texto
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {usuario.email}
                      <Tooltip title="Copiar e-mail">
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(usuario.email);
                          }}
                          sx={{
                            color: "#8323A0", // Cor do ícone
                            "&:hover": { color: "#6f1f8e" }, // Cor ao passar o mouse
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default PageMenuDeAcesso;
