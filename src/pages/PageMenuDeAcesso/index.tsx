import React, { useState, useEffect } from "react";
import axios from "axios";
import Usuario from "../../Api/model/usuarioModel";
import Base from "../../Api/model/baseModel";
import ApiResponse from "../../Api/model/ApiResponseModel";
import Equipamento from "../../Api/model/equipamentoModel";
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
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // buscarBases: Realiza uma chamada à API com o email digitado pelo usuário. Processa e exibe as bases de cliente no modal se encontrar múltiplas entradas. Se houver apenas uma base encontrada, ela é automaticamente selecionada. Armazena dados da base selecionada no localStorage.

  const buscarBases = async () => {
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

  //fetchEquipamentos: Realiza a requisição para a API. Manipula e armazena os dados no estado local equipamentos. Indica ao usuário através do loading se os dados ainda estão sendo carregados.

  const fetchEquipamentos = async (baseId?: number) => {
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

  useEffect(() => {
    if (baseSelecionada) {
      const storedAccessToken = localStorage.getItem("access_token");
      if (!storedAccessToken) {
        console.error("Access token não encontrado no localStorage!");
        return;
      }
      // Se o token estiver correto, faça a requisição à API
      fetchEquipamentos(baseSelecionada.Id);
    }
  }, [baseSelecionada]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    buscarBases();
  };

  //selecionarBase: Define a base como selecionada. Busca os usuários associados à base. Busca o "Usuário Master". Solicita um token de acesso da base.

  const selecionarBase = async (base: Base) => {
    console.log("Selecionando base:", base);

    try {
      setBaseSelecionada(base);
      setModalOpen(false);
      localStorage.setItem("unidadeId", base.Id.toString());
      localStorage.setItem("codigoUnidade", base.CodigoUnidade.toString());

      const usuarios: Usuario[] = await buscarUsuarios(base.Id);
      const usuarioMaster = await buscarUsuarioMaster(usuarios, base.Id);

      if (!usuarioMaster || !usuarioMaster.Id) {
        console.error(
          "Usuário master não está definido corretamente",
          usuarioMaster
        );
        return;
      }

      // Obter o token após buscar usuário master
      await obterAccessTokenMaster(base.Id, usuarioMaster.Id);

      // Buscar equipamentos após atualizar o token
      await fetchEquipamentos(base.Id);
    } catch (error) {
      console.error("Erro ao selecionar a base:", error);
    }
  };

  const buscarUsuarioMaster = async (
    usuarios: Usuario[],
    baseId: number
  ): Promise<any> => {
    if (!Array.isArray(usuarios)) {
      console.error("A variável 'usuarios' não é um array válido", usuarios);
      return;
    }

    const usuariosTipoPerfil1 = usuarios.filter(
      (usuario: any) => usuario.TipoPerfil === 1
    );

    if (usuariosTipoPerfil1.length > 0) {
      const usuarioMaster = usuariosTipoPerfil1[0];
      localStorage.setItem("IdUsuarioMaster", usuarioMaster.Id.toString());
      console.log("Usuário master salvo:", usuarioMaster);

      setUsuarioMaster(usuarioMaster);
      return usuarioMaster;
    } else {
      console.warn("Nenhum usuário com TipoPerfil 1 encontrado.");
      setUsuarioMaster(null); // Definir como null se não encontrar um usuário
    }

    if (usuarioMaster && usuarioMaster.Id) {
      await obterAccessTokenMaster(baseId, usuarioMaster.Id);
    }
  };

  //buscarUsuarios: Realiza uma requisição para a API. Processa e armazena os usuários no estado usuarios.

  const buscarUsuarios = async (codigoCadastro: number): Promise<any> => {
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
          dddFone: usuario.DddFone,
          fone: usuario.Fone,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  //obterAccessTokenMaster: Realiza uma requisição POST com dados do usuário. Manipula o token de acesso no localStorage. Notifica o usuário sobre o sucesso ou falha com enqueueSnackbar

  const obterAccessTokenMaster = async (
    codigoBase: number,
    codigoUsuarioMaster: number
  ): Promise<void> => {
    const refresh_tokenInterno2 = localStorage.getItem("refresh_tokenInterno");

    if (!refresh_tokenInterno2) {
      enqueueSnackbar("Erro: Dados incompletos para obter o token.", {
        variant: "error",
      });
      return;
    }

    const payload = {
      Codigo: codigoBase,
      CodigoUsuario: codigoUsuarioMaster,
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

      if (response.data.Success && response.data.Content?.Access_token) {
        const accessToken = response.data.Content.Access_token;
        localStorage.setItem("access_token", accessToken); // Atualiza o token no localStorage

        enqueueSnackbar("Token de acesso obtido e salvo com sucesso!", {
          variant: "success",
        });
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

  console.log(usuarios);
  console.log(equipamentos);

  //html-CSS em MUI

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
                onClick={async () => await selecionarBase(base)}
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
          mt: 2,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 1,
          maxHeight: "40vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Equipamentos
        </Typography>
        {loading ? (
          <Typography>Carregando equipamentos...</Typography>
        ) : equipamentos.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Descrição</strong>
                  </TableCell>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipamentos.map((equipamento) => (
                  <TableRow key={equipamento.Id}>
                    <TableCell>{equipamento.Descricao}</TableCell>
                    <TableCell>{equipamento.Id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Nenhum equipamento encontrado.</Typography>
        )}
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
