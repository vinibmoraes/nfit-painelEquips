import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LoginInternoDto,
  RespostaBaseApi,
} from "../../Api/Utils/resposta-base-api";
import { Cadastro as Cadastro } from "../../Api/model/Cadastro";
import { Equipamento } from "../../Api/model/Equipamento";
import { Usuario } from "../../Api/model/Usuario";
import EmailIcon from "@mui/icons-material/Email";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
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
  Skeleton,
} from "@mui/material";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { URLSearchParams } from "url";
import { EVerboHttp } from "../../Api/Enums/EVerboHttp";
import { LocalStorageHelper } from "../../shared/helpers/local-storage-helper";
import {
  keyCodigoCadastro,
  keyCodigoUnidade,
  keyRefreshToken,
  keyUnidadeSelecionadaAuthToken,
  keyUsuarioMaster,
} from "../../shared/keys/local-storage-keys";
import { getOptions } from "../../Api/Utils/get-options";
import { get } from "http";
import Footer from "./footer";

const PageMenuDeAcesso: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [bases, setBases] = useState<Cadastro[]>([]);
  const [cadastroSelecionado, setCadastroSelecionado] =
    useState<Cadastro | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);
  const [usuarioMaster, setUsuarioMaster] = useState<any>(null);
  const [cadastro, setCadastro] = useState<any>(null);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const buscarCadastros = async () => {
    setIsSearching(true);
    const emailClienteSemEspaco = email.trim();
    const urlBuscaCliente = `https://apiadm.nextfit.com.br/api/Cadastro/ListarView?Ativacao=null&DataCancelamentoFinal=null&DataCancelamentoInicial=null&DataInicioFinal=null&DataInicioInicial=null&DataUltimoAcessoFinal=null&DataUltimoAcessoInicial=null&EmAtencao=null&PesquisaGeral=${emailClienteSemEspaco}&RealizouTreinamento=null&Status=%5B1,3,2,5,6%5D&Trial=null&Vip=null&page=1&sort=%5B%7B%22property%22:%22DataCriacao%22,%22direction%22:%22desc%22%7D,%7B%22property%22:%22Id%22,%22direction%22:%22desc%22%7D%5D`;

    try {
      const response = await fetch(urlBuscaCliente, getOptions(EVerboHttp.GET));

      if (!response.ok) {
        throw new Error("Erro ao buscar bases");
      }

      const apiResponse: RespostaBaseApi<Cadastro[]> = await response.json();
      const cadastros = apiResponse.Content;

      if (apiResponse.Total === 0) {
        enqueueSnackbar("Nenhuma base encontrada.", {
          variant: "info",
        });
        setIsSearching(false);
        return;
      }

      setBases(cadastros);
      setSearchCompleted(true);

      if (cadastros.length === 1) {
        const cadastroUnico: Cadastro = cadastros[0];
        handleSelecionarCadastro(cadastroUnico);
        return;
      }
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar bases:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const buscarEquipamentosCadastroSelecionado = async () => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    try {
      const response = await fetch(
        "https://api.nextfit.com.br/api/equipamento?filter=%5B%7B%22property%22:%22Inativo%22,%22operator%22:%22equal%22,%22value%22:false,%22and%22:true%7D%5D&page=1",
        getOptions(EVerboHttp.GET, undefined, authToken)
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar equipamentos");
      }

      const resposta: RespostaBaseApi<Equipamento[]> = await response.json();

      const equipamentos = resposta.Content;
      setEquipamentos(equipamentos);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchEquipamentos = async () => {
      const accessToken = LocalStorageHelper.getItem(
        keyUnidadeSelecionadaAuthToken
      );
      if (!accessToken) {
        console.error("Access token not found!");
        return;
      }

      console.log(accessToken);

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

          console.log(data.Content);
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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    buscarCadastros();
  };

  //TODO: analisar se métodos devem utilizar o cadastro.Id como parâmetro
  const handleSelecionarCadastro = async (cadastro: Cadastro) => {
    try {
      setCadastroSelecionado(cadastro);
      LocalStorageHelper.setItem(keyCodigoCadastro, cadastro.Id);
      LocalStorageHelper.setItem(keyCodigoUnidade, cadastro.CodigoUnidade);

      await buscarUsuarios(cadastro.Id);
      await buscarAuthTokenCadastroSelecionado(cadastro);
      await buscarEquipamentosCadastroSelecionado();
    } catch (error) {
      console.error("Erro ao processar a seleção da base:", error);
    }
  };

  const selecionarCadastro = async (cadastro: Cadastro) => {
    setCadastroSelecionado(cadastro);
    await handleSelecionarCadastro(cadastro);
    setModalOpen(false);
  };

  const buscarUsuarios = async (codigoCadastro: number) => {
    const url = `https://apiadm.nextfit.com.br/api/Usuario/RecuperarUsuariosCadastro?AcessoBloqueado=false&CodigoCadastro=${codigoCadastro}&Inativo=false&limit=20&page=1&sort=%5B%7B%22property%22:%22Inativo%22,%22direction%22:%22asc%22%7D,%7B%22property%22:%22TipoPerfil%22,%22direction%22:%22asc%22%7D,%7B%22property%22:%22Nome%22,%22direction%22:%22asc%22%7D%5D`;
    try {
      const response = await fetch(url, getOptions(EVerboHttp.GET));

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const apiResponse: RespostaBaseApi<Usuario[]> = await response.json();
      const usuarios = apiResponse.Content;
      setUsuarios(usuarios);

      const usuarioMaster = usuarios.find(
        (usuario) => usuario.TipoPerfil === 1
      );

      if (!usuarioMaster) {
        console.warn("Nenhum usuário com TipoPerfil 1 encontrado.");
        return;
      }

      LocalStorageHelper.setItem<Usuario>(keyUsuarioMaster, usuarioMaster);
      setUsuarioMaster(usuarioMaster);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const buscarAuthTokenCadastroSelecionado = async (
    cadastro: Cadastro
  ): Promise<void> => {
    if (!cadastro?.Id) {
      enqueueSnackbar("A base não foi encontrada.");
      return;
    }

    var usuarioLocalStorage: Usuario | null =
      LocalStorageHelper.getItem(keyUsuarioMaster);

    const payload = {
      Codigo: cadastro.Id,
      CodigoUsuario: usuarioLocalStorage?.Id,
    };

    try {
      const url =
        "https://apiadm.nextfit.com.br/api/Cadastro/AcessarPorUsuario";
      const response = await fetch(url, getOptions(EVerboHttp.POST, payload));

      if (!response.ok) {
        throw new Error("Erro ao buscar token de acesso");
      }

      const resposta: RespostaBaseApi<LoginInternoDto> = await response.json();
      const unidadeAuthToken = resposta.Content.access_token;

      LocalStorageHelper.setItem(
        keyUnidadeSelecionadaAuthToken,
        unidadeAuthToken
      );

      enqueueSnackbar("Busca realizada!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        "Erro ao obter o token. Verifique os dados e tente novamente.",
        {
          variant: "error",
        }
      );
    }
  };

  const inativarEquipamento = async (codigoEquipamento: string) => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    try {
      const response = await fetch(
        "https://api.nextfit.com.br/api/equipamento/Inativar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Codigo: codigoEquipamento }), // Envia o código como string
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao inativar equipamento");
      }

      // Remove o equipamento da lista após inativação bem-sucedida
      setEquipamentos(
        (prevEquipamentos) =>
          prevEquipamentos.filter(
            (equipamento) => equipamento.Id.toString() !== codigoEquipamento
          ) // Compara como string
      );

      enqueueSnackbar("Equipamento removido com sucesso!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao inativar equipamento:", error);
      enqueueSnackbar("Erro ao inativar equipamento. Tente novamente.", {
        variant: "error",
      });
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
        sx={{
          mt: "15vh",
          mx: "auto",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
          mb: "30px",
          color:
            cadastroSelecionado?.Status === 1
              ? "rgb(76,175,80)" // - ATIVO
              : cadastroSelecionado?.Status === 2
              ? "rgb(225,171,64)" // - SOMENTE LEITURA
              : cadastroSelecionado?.Status === 3
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
          {cadastroSelecionado?.RazaoSocial}{" "}
          {cadastroSelecionado?.Status === 1
            ? "- ATIVO"
            : cadastroSelecionado?.Status === 2
            ? "- SOMENTE LEITURA"
            : cadastroSelecionado?.Status === 3
            ? "- BLOQUEADO"
            : ""}
          {[1, 2, 3].includes(cadastroSelecionado?.Status ?? -1) && (
            <IconButton
              onClick={() =>
                window.open(
                  `https://adm.nextfit.com.br/cliente/${cadastroSelecionado?.Id}/cliente-dashboard`,
                  "_blank"
                )
              }
              sx={{
                marginLeft: "10px",
                color:
                  cadastroSelecionado?.Status === 1
                    ? "rgb(76,175,80)" // Cor do botão ATIVO
                    : cadastroSelecionado?.Status === 2
                    ? "rgb(225,171,64)" // Cor do botão SOMENTE LEITURA
                    : cadastroSelecionado?.Status === 3
                    ? "rgb(244,67,54)" // Cor do botão BLOQUEADO
                    : "",
              }}
            >
              <OpenInNewIcon />
            </IconButton>
          )}
          {[1, 2, 3].includes(cadastroSelecionado?.Status ?? -1) && (
            <IconButton
              onClick={() => {
                // Recupera os valores do localStorage
                const accessToken = LocalStorageHelper.getItem<string>(
                  keyUnidadeSelecionadaAuthToken
                );
                const refreshToken =
                  LocalStorageHelper.getItem<string>(keyRefreshToken);
                const codigoUnidade =
                  LocalStorageHelper.getItem<string>(keyCodigoUnidade);

                // Monta o link
                const link = `https://app.nextfit.com.br/logininterno?access_token=${accessToken}&refresh_token=${refreshToken}&codigoUnidade=${codigoUnidade}`;

                // Copia o link para a área de transferência
                navigator.clipboard.writeText(link);

                // Exibe uma notificação
                enqueueSnackbar("Link de acesso a base copiado!", {
                  variant: "info",
                });
              }}
              sx={{
                color:
                  cadastroSelecionado?.Status === 1
                    ? "rgb(76,175,80)" // Cor do botão ATIVO
                    : cadastroSelecionado?.Status === 2
                    ? "rgb(225,171,64)" // Cor do botão SOMENTE LEITURA
                    : cadastroSelecionado?.Status === 3
                    ? "rgb(244,67,54)" // Cor do botão BLOQUEADO
                    : "",
              }}
            >
              <ContentCopyIcon sx={{ fontSize: "85%" }} />
            </IconButton>
          )}
        </Typography>
      </Box>

      {cadastroSelecionado && usuarios.length > 0 && (
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
          {cadastroSelecionado && equipamentos.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{
                flexBasis: "65%",
                maxWidth: "35%", // Ajuste para a largura máxima
                overflowY: "auto",
                boxShadow: 1,
                borderRadius: 2,
                maxHeight: "50vh",
                // maxHeight: equipamentos.length > 0 ? "none" : "fit-content",
              }}
            >
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
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
                          // borderRight: "1px solid",
                          borderColor: "divider",
                          padding: "12px",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {equipamento.Descricao}

                        <IconButton
                          onClick={() =>
                            inativarEquipamento(equipamento.Id.toString())
                          } // Passa o Id como string
                          sx={{
                            color: "#8323A0",
                            "&:hover": {
                              color: "#6C1E9B",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tabela de Usuários */}
          {cadastroSelecionado && usuarios.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{
                flexBasis: equipamentos.length > 0 ? "65%" : "65%", // Ajusta a largura com base na presença de equipamentos
                maxWidth: equipamentos.length > 0 ? "65%" : "100%",
                maxHeight: "50vh",
                overflowY: "auto",
                boxShadow: 1,
                borderRadius: 2,
                margin: equipamentos.length === 0 ? "0 auto" : "0", // Centraliza a tabela de usuários quando não há equipamentos
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
                        {usuario.Nome}
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
                        <span>{usuario.Email}</span>
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                          <IconButton
                            onClick={() => copiarEmail(usuario.Email)}
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
                              copiarTelefone(usuario.DddFone, usuario.Fone)
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

      <Footer />
    </Box>
  );
};

export default PageMenuDeAcesso;
