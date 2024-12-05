import React, { useState, useEffect } from "react";
import axios from "axios";
import curupaco from "../assets/curupaco.png";
import EmailIcon from "@mui/icons-material/Email";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MapIcon from "@mui/icons-material/Map";
import {
  keyframes,
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
  Tooltip,
} from "@mui/material";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { URLSearchParams } from "url";

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
  Status: number;
  RazaoSocial: string;
}

interface ApiResponse {
  Content: {
    access_token: string;
    refresh_token: string;
  };
  Message: string;
  Success: boolean;
}

const PageMenuDeAcesso: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [baseSelecionada, setBaseSelecionada] = useState<Base | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);
  const [usuarioMaster, setUsuarioMaster] = useState<any>(null);
  const [cadastro, setCadastro] = useState<any>(null);

  const [showBird, setShowBird] = useState(true);

  // Esconde o passarinho após a animação
  useEffect(() => {
    const timer = setTimeout(() => setShowBird(false), 3000); // Remover após 3 segundos
    return () => clearTimeout(timer); // Limpeza
  }, []);

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
      const basesEncontradas: Base[] = data.Content.map((base: Base) => ({
        Id: base.Id,
        CodigoUnidade: base.CodigoUnidade,
        Nome: base.Nome,
        AlunosAtivos: base.AlunosAtivos,
        Status: base.Status,
        RazaoSocial: base.RazaoSocial,
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
    obterAccessTokenMaster();
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

        setUsuarioMaster(usuarioMaster);
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

  const obterAccessTokenMaster = async (): Promise<void> => {
    const refresh_tokenInterno2 = localStorage.getItem("refresh_tokenInterno");

    if (!refresh_tokenInterno2) {
      enqueueSnackbar("Erro: Dados incompletos para obter o token.", {
        variant: "error",
      });
      return;
    }

    if (!baseSelecionada?.Id) {
      enqueueSnackbar("A base não foi encontrada.");
      return;
    }

    const payload = {
      Codigo: baseSelecionada.Id,
      CodigoUsuario: parseInt(usuarioMaster?.Id),
    };

    console.log(payload);

    try {
      const response = await axios.post<ApiResponse>(
        "https://apiadm.nextfit.com.br/api/Cadastro/AcessarPorUsuario",
        payload,
        {
          headers: {
            Authorization: `Bearer ${refresh_tokenInterno2}`,
          },
        }
      );

      if (response.data.Success && response.data.Content?.access_token) {
        const accessToken = response.data.Content.access_token;
        localStorage.setItem("access_token", accessToken); // Salvando o access token

        enqueueSnackbar("Token de acesso obtido e salvo com sucesso!", {
          variant: "success",
        });

        // Agora você pode usar o access token para outras requisições
      } else {
        enqueueSnackbar(
          `Erro ao obter o token: ${
            response.data.Message || "Erro desconhecido."
          }`,
          { variant: "error" }
        );
      }
    } catch (error) {
      console.error("Erro na requisição para obter o token:", error);
      enqueueSnackbar(
        "Erro ao obter o token. Verifique os dados e tente novamente.",
        {
          variant: "error",
        }
      );
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

  const handleMapClick = () => {
    window.open(
      "https://www.google.com.br/maps/d/edit?mid=1eyliVZGdAupULChAry8ZDpS_UCDNAKU&ll=-9.824164549175668%2C-49.41394982406761&z=4",
      "_blank"
    );
  };

  const voar = keyframes`
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(50vw, -20vh) scale(1.2); /* Meio do trajeto */
      opacity: 1;
    }
    100% {
      transform: translate(100vw, -50vh) scale(0.5); /* Fora da tela */
      opacity: 0;
    }
  `;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showBird && (
        <Box
          sx={{
            position: "absolute",
            top: "50%", // Início no centro vertical
            left: "0%", // Início na borda esquerda
            width: "50px",
            height: "50px",
            backgroundImage: `url(${curupaco})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            animation: `${voar} 3s ease-in-out forwards`, // Aplica os keyframes
            zIndex: 10, // Certifica-se que o passarinho está acima de outros elementos
          }}
        ></Box>
      )}

      <Box
        sx={{
          mt: "15vh",
          mx: "auto",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
          color:
            baseSelecionada?.Status === 1
              ? "rgb(76,175,80)" // - ATIVO
              : baseSelecionada?.Status === 2
              ? "rgb(225,171,64)" // - SOMENTE LEITURA
              : baseSelecionada?.Status === 3
              ? "rgb(244,67,54)" // - BLOQUEADO
              : "inherit", // Cor padrão
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {baseSelecionada?.RazaoSocial}{" "}
          {baseSelecionada?.Status === 1
            ? "- ATIVO"
            : baseSelecionada?.Status === 2
            ? "- SOMENTE LEITURA"
            : baseSelecionada?.Status === 3
            ? "- BLOQUEADO"
            : ""}
          {[1, 2, 3].includes(baseSelecionada?.Status ?? -1) && (
            <IconButton
              onClick={() =>
                window.open(
                  `https://adm.nextfit.com.br/cliente/${baseSelecionada?.Id}/cliente-dashboard`,
                  "_blank"
                )
              }
              sx={{
                color:
                  baseSelecionada?.Status === 1
                    ? "rgb(76,175,80)" // Cor do botão ATIVO
                    : baseSelecionada?.Status === 2
                    ? "rgb(225,171,64)" // Cor do botão SOMENTE LEITURA
                    : baseSelecionada?.Status === 3
                    ? "rgb(244,67,54)" // Cor do botão BLOQUEADO
                    : "",
              }}
            >
              <OpenInNewIcon />
            </IconButton>
          )}
        </Typography>
      </Box>

      {baseSelecionada && usuarios.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around", // Distribui os botões igualmente
            gap: "5vh",
            // Espaço entre a razão social e os botões
            paddingX: "25vh",
            paddingY: "2vh",
          }}
        >
          <Button
            variant="contained"
            sx={{ flexGrow: 1, height: "100%", minWidth: 0, width: "100%" }}
          >
            Criar usuário catraca
          </Button>
          <Button
            variant="contained"
            sx={{ flexGrow: 1, height: "100%", minWidth: 0, width: "100%" }}
          >
            Criar equipamentos
          </Button>
          <Button
            variant="contained"
            sx={{ flexGrow: 1, height: "100%", minWidth: 0, width: "100%" }}
          >
            Adicionar observação
          </Button>
          <Button
            variant="contained"
            sx={{ flexGrow: 1, height: "100%", minWidth: 0, width: "100%" }}
          >
            Visualizar últimos acessos
          </Button>
        </Box>
      )}

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
            mx: "auto",
            maxWidth: "50%", // Ajuste para deixar a tabela responsiva
            marginTop: { xs: "1rem", sm: "2rem", md: "3rem" },
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

      {/* Ícone de Mapa no canto inferior esquerdo */}
      <Box
        sx={{
          position: "fixed", // Fixa a posição
          bottom: "16px", // Distância do fundo da tela
          left: "16px", // Distância da lateral esquerda
          zIndex: 9999, // Garante que o ícone fique acima de outros elementos
        }}
      >
        <Tooltip title="Ver Mapa de parceiros">
          <IconButton
            onClick={handleMapClick} // Função chamada ao clicar no ícone
            sx={{
              backgroundColor: "#ffffff", // Cor de fundo do ícone
              borderRadius: "50%", // Faz o ícone ficar arredondado
              boxShadow: 3, // Adiciona uma sombra para destacar o ícone
              "&:hover": {
                backgroundColor: "#e0e0e0", // Efeito de hover
              },
            }}
          >
            <MapIcon sx={{ color: "#1976d2" }} /> {/* Cor do ícone */}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PageMenuDeAcesso;
