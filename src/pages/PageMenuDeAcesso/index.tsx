import React, { useState, useEffect } from "react";
import axios from "axios";
import { ApiResponse } from "../../Api/model/ApiResponseModel";
import { Cadastro as Cadastro } from "../../Api/model/baseModel";
import { Equipamento } from "../../Api/model/equipamentoModel";
import { Usuario } from "../../Api/model/usuarioModel";
import EmailIcon from "@mui/icons-material/Email";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MapIcon from "@mui/icons-material/Map";
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
  Tooltip,
} from "@mui/material";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { URLSearchParams } from "url";
import { EVerboHttp } from "../../Api/model/EVerboHttp";

const PageMenuDeAcesso: React.FC = () => {
  const [refreshToken] = useState<any>(
    localStorage.getItem("refresh_tokenInterno")
  );
  const [email, setEmail] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [bases, setBases] = useState<Cadastro[]>([]);
  const [baseSelecionada, setBaseSelecionada] = useState<Cadastro | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);
  const [usuarioMaster, setUsuarioMaster] = useState<any>(null);
  const [cadastro, setCadastro] = useState<any>(null);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getOptions = (verbo: EVerboHttp) => {
    return {
      method: verbo,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    };
  };

  const buscarBases = async () => {
    setIsSearching(true);
    const emailClienteSemEspaco = email.trim();
    const urlBuscaCliente = `https://apiadm.nextfit.com.br/api/Cadastro/ListarView?Ativacao=null&DataCancelamentoFinal=null&DataCancelamentoInicial=null&DataInicioFinal=null&DataInicioInicial=null&DataUltimoAcessoFinal=null&DataUltimoAcessoInicial=null&EmAtencao=null&PesquisaGeral=${emailClienteSemEspaco}&RealizouTreinamento=null&Status=%5B1,3,2,5,6%5D&Trial=null&Vip=null&page=1&sort=%5B%7B%22property%22:%22DataCriacao%22,%22direction%22:%22desc%22%7D,%7B%22property%22:%22Id%22,%22direction%22:%22desc%22%7D%5D`;

    try {
      const response = await fetch(urlBuscaCliente, getOptions(EVerboHttp.GET));

      if (!response.ok) {
        throw new Error("Erro ao buscar bases");
      }

      const apiResponse: ApiResponse<Cadastro[]> = await response.json();
      const bases = apiResponse.Content;

      if (apiResponse.Total === 0) {
        enqueueSnackbar("Nenhuma base encontrada.", {
          variant: "info",
        });
        setIsSearching(false);
        return;
      }

      setBases(bases);
      setSearchCompleted(true);

      bases.length === 1
        ? await handleSelecionarBase(bases[0])
        : setModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar bases:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelecionarBase = async (cadastro: Cadastro) => {
    try {
      selecionarCadastro(cadastro);
      localStorage.setItem("codigoCadastro", cadastro.Id.toString());
      localStorage.setItem("codigoUnidade", cadastro.CodigoUnidade.toString());

      // Passa o ID ou código da base, conforme esperado
      await buscarUsuarios(cadastro.Id); // ou base.CodigoUnidade, dependendo da definição de buscarUsuarios
      await usuarioMaster(); // Obtém o usuário master
      await obterAccessTokenMaster(); // Atualiza o access token
      await fetchEquipamentos(); // Atualiza os equipamentos
    } catch (error) {
      console.error("Erro ao processar a seleção da base:", error);
    }
  };

  const fetchEquipamentos = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("Access token não encontrado!");
      return;
    }

    try {
      const response = await fetch(
        "https://api.nextfit.com.br/api/equipamento?filter=%5B%7B%22property%22:%22Inativo%22,%22operator%22:%22equal%22,%22value%22:false,%22and%22:true%7D%5D&page=1",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar equipamentos");

      const data = await response.json();

      if (data.Success) {
        setEquipamentos(
          data.Content.map((item: any) => ({
            Descricao: item.Descricao,
            Id: item.Id,
          }))
        );
      } else {
        console.error("Erro ao buscar equipamentos:", data.Message);
      }
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchEquipamentos = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("Access token not found!");
        return;
      }

      try {
        const response = await fetch(
          "https://api.nextfit.com.br/api/equipamento?filter=%5B%7B%22property%22:%22Inativo%22,%22operator%22:%22equal%22,%22value%22:false,%22and%22:true%7D%5D&page=1",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.Success) {
          setEquipamentos(
            data.Content.map((item: any) => ({
              Descricao: item.Descricao,
              Id: item.Id,
            }))
          );
        } else {
          console.error("Failed to fetch equipamentos:", data.Message);
        }
      } catch (error) {
        console.error("Error fetching equipamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipamentos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    buscarBases();
  };

  const selecionarCadastro = (base: Cadastro) => {
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
      const response = await fetch(urlUsuarios, getOptions(EVerboHttp.GET));

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const apiResponse: ApiResponse<Usuario[]> = await response.json();
      const usuarios = apiResponse.Content;
      setUsuarios(usuarios);

      const usuarioMaster = usuarios.find(
        (usuario) => usuario.TipoPerfil === 1
      );

      if (!usuarioMaster) {
        console.warn("Nenhum usuário com TipoPerfil 1 encontrado.");
        return;
      }

      localStorage.setItem("IdUsuarioMaster", usuarioMaster.Id.toString());
      setUsuarioMaster(usuarioMaster);
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

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          mt: "15vh",
          mx: "auto",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
          mb: "30px",
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
            mb: "40px",
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
                onClick={() => selecionarCadastro(base)}
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Centraliza as tabelas no espaço disponível
          paddingX: 2, // Margem horizontal
          width: "100%",
          maxWidth: "1200px", // Limita a largura máxima do conteúdo
          margin: "0 auto", // Centraliza no container da página
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            width: "100%",
          }}
        >
          {/* Tabela de Equipamentos */}
          {equipamentos.length > 0 && (
            <TableContainer
              sx={{
                flexBasis: "auto",
                maxWidth: "35%", // Ajuste para a largura máxima
                overflowY: "auto",
                boxShadow: 1,
                borderRadius: 2,
                maxHeight: equipamentos.length > 0 ? "none" : "fit-content",
              }}
            >
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "#f5f5f5",
                        fontWeight: "bold",
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "16px",
                      }}
                    >
                      Equipamento(s)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipamentos.map((equipamento, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          borderRight: "1px solid",
                          borderColor: "divider",
                          padding: "12px",
                          fontSize: "14px",
                        }}
                      >
                        {equipamento.Descricao}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tabela de Usuários */}
          {usuarios.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{
                flexBasis: "65%",
                maxWidth: "65%",
                maxHeight: "50vh",
                overflowY: "auto",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "#f5f5f5",
                        fontWeight: "bold",
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "16px",
                      }}
                    >
                      Usuário
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f5f5f5",
                        fontWeight: "bold",
                        alignItems: "center",
                        padding: "12px",
                        fontSize: "16px",
                        textAlign: "left",
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
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          borderRight: "1px solid",
                          borderColor: "divider",
                          padding: "12px",
                          fontSize: "14px",
                        }}
                      >
                        {usuario.nome}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          fontSize: "14px",
                          borderColor: "divider",
                        }}
                      >
                        <span>{usuario.email}</span>
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                          <IconButton
                            onClick={() => copiarEmail(usuario.email)}
                            sx={{
                              color: "#8323A0",
                              "&:hover": {
                                color: "#6C1E9B",
                              },
                            }}
                          >
                            <FileCopyIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              copiarTelefone(usuario.dddFone, usuario.Fone)
                            }
                            sx={{
                              color: "#8323A0",
                              "&:hover": {
                                color: "#6C1E9B",
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
      </Box>

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
