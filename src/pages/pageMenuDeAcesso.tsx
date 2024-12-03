import React, { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PhoneIcon from "@mui/icons-material/Phone";
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
  IconButton,
} from "@mui/material";
import { enqueueSnackbar, useSnackbar } from "notistack";

interface Usuario {
  nome: string;
  email: string;
  dddFone: string;
  fone: string;
}

interface Base {
  Id: number;
  CodigoUnidade: number;
  Nome: string;
  AlunosAtivos: number;
}

const PageMenuDeAcesso: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [baseSelecionada, setBaseSelecionada] = useState<Base | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);

  const buscarBases = async () => {
    // debugger;
    setIsSearching(true);
    const emailClienteSemEspaco = email.trim();
    const urlBuscaCliente = `https://apiadm.nextfit.com.br/api/Cadastro/ListarView?Ativacao=null&DataCancelamentoFinal=null&DataCancelamentoInicial=null&DataInicioFinal=null&DataInicioInicial=null&DataUltimoAcessoFinal=null&DataUltimoAcessoInicial=null&EmAtencao=null&PesquisaGeral=${emailClienteSemEspaco}&RealizouTreinamento=null&Status=%5B1,3,2,5,6%5D&Trial=null&Vip=null&page=1&sort=%5B%7B%22property%22:%22DataCriacao%22,%22direction%22:%22desc%22%7D,%7B%22property%22:%22Id%22,%22direction%22:%22desc%22%7D%5D`;

    const refresh_tokenInterno = localStorage.getItem("refresh_tokenInterno");

    if (!refresh_tokenInterno) {
      console.error("Token não encontrado no localStorage");
      setIsSearching(false);
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
      const basesEncontradas: Base[] = data.Content.map((base: any) => ({
        Id: base.Id,
        CodigoUnidade: base.CodigoUnidade,
        Nome: base.Nome,
        AlunosAtivos: base.AlunosAtivos,
      }));

      if (basesEncontradas.length === 0) {
        enqueueSnackbar("Nenhuma base encontrada.", {
          variant: "info",
        });
        setIsSearching(false); // Finaliza a busca
        return;
      }

      setBases(basesEncontradas);
      setSearchCompleted(true); // Marca como concluído
      setModalOpen(basesEncontradas.length > 1);

      if (basesEncontradas.length === 1) {
        selecionarBase(basesEncontradas[0]);
        setIsSearching(false);
        localStorage.setItem("unidadeId", basesEncontradas[0].Id.toString());
        localStorage.setItem(
          "codigoUnidade",
          basesEncontradas[0].CodigoUnidade.toString()
        );
      } else if (basesEncontradas.length > 0) {
        setBases(basesEncontradas);
        setModalOpen(true);
      } else {
        console.log("Nenhuma base encontrada.");
      }
      setIsSearching(false);
    } catch (error) {
      console.error("Erro ao buscar bases:", error);
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    buscarBases();
  };

  const selecionarBase = (base: Base) => {
    setBaseSelecionada(base);
    setModalOpen(false);
    localStorage.setItem("unidadeId", base.Id.toString());
    localStorage.setItem("codigoUnidade", base.CodigoUnidade.toString());
    buscarUsuarios(base.Id);
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

      // Filtrar usuários do TipoPerfil 1
      const usuariosTipoPerfil1 = data.Content.filter(
        (usuario: any) => usuario.TipoPerfil === 1
      );

      if (usuariosTipoPerfil1.length > 0) {
        // Armazena o primeiro usuário do TipoPerfil 1 no localStorage
        const usuarioMaster = usuariosTipoPerfil1[0];
        localStorage.setItem("IdUsuarioMaster", usuarioMaster.Id.toString());
        console.log("Usuário master salvo:", usuarioMaster);
      } else {
        console.warn("Nenhum usuário com TipoPerfil 1 encontrado.");
      }

      // Atualizar o estado com todos os usuários
      setUsuarios(
        data.Content.map((usuario: any) => ({
          nome: usuario.Nome,
          email: usuario.Email,
          dddFone: usuario.DddFone,
          fone: usuario.Fone,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const copiarEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    enqueueSnackbar("E-mail copiado!", { variant: "info" });
  };

  const copiarTelefone = (dddFone: string, fone: string) => {
    const telefoneFormatado = `(${dddFone}) ${fone}`;
    navigator.clipboard.writeText(telefoneFormatado);
    enqueueSnackbar("Telefone copiado!", { variant: "info" });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          position: "absolute",
          top: searchCompleted ? "2rem" : "50%",
          left: "50%",
          transform: searchCompleted
            ? "translate(-50%, 0)"
            : "translate(-50%, -50%)",
          transition: "top 0.5s, transform 0.5s",
          display: "flex",
          alignItems: "center",
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
          sx={{ width: "60vh" }}
        />
        <Button type="submit" variant="contained" disabled={isSearching}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: "divider",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            maxHeight: "80vh",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              position: "sticky",
              top: 0,
              bgcolor: "background.paper",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            Selecione uma Base
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
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
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
              bgcolor: "background.paper",
            }}
          >
            <Button variant="contained" onClick={() => setModalOpen(false)}>
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>

      {usuarios.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            mt: 4,
            mx: "auto",
            maxWidth: "50%", // Ajuste para deixar a tabela responsiva
            marginTop: "220px",
            maxHeight: "50vh", // Limita a altura da tabela para 60% da altura da tela
            overflowY: "auto", // Permite rolagem se necessário
            boxShadow: 1, // Sombra mais discreta para a tabela
            borderRadius: 2, // Bordas arredondadas para suavizar o visual
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    borderRight: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "#f5f5f5", // Cor de fundo suave no cabeçalho
                    fontWeight: "bold",
                    padding: "12px", // Aumenta o padding para mais espaço interno
                    textAlign: "left", // Alinha o texto à esquerda
                    fontSize: "16px", // Ajusta o tamanho da fonte
                  }}
                >
                  Usuário
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#f5f5f5", // Cor de fundo suave no cabeçalho
                    fontWeight: "bold",
                    padding: "12px",
                    fontSize: "16px",
                    textAlign: "left", // Alinha o texto à esquerda
                  }}
                >
                  E-mail
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover", // Efeito hover para as linhas
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      borderRight: "1px solid",
                      borderColor: "divider",
                      padding: "12px", // Aumenta o padding para mais espaço
                      fontSize: "14px", // Ajusta o tamanho da fonte para um visual mais limpo
                    }}
                  >
                    {usuario.nome}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "space-between", // Divide a célula em duas partes
                      alignItems: "center",
                      padding: "12px", // Aumenta o padding
                      fontSize: "14px", // Ajusta o tamanho da fonte
                      borderColor: "divider",
                    }}
                  >
                    <span>{usuario.email}</span> {/* E-mail fica à esquerda */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1, // Espaço entre os ícones
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => copiarEmail(usuario.email)}
                        sx={{
                          color: "#8323A0", // Cor do ícone de copiar
                          "&:hover": {
                            color: "#6C1E9B", // Cor do ícone quando o mouse passa sobre ele
                          },
                        }}
                      >
                        <FileCopyIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          copiarTelefone(usuario.dddFone, usuario.fone)
                        }
                        sx={{
                          color: "#8323A0", // Cor do ícone de telefone
                          "&:hover": {
                            color: "#6C1E9B", // Cor do ícone quando o mouse passa sobre ele
                          },
                        }}
                      >
                        <PhoneIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PageMenuDeAcesso;
