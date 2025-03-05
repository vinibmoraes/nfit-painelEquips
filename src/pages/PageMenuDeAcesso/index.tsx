import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { CheckCircle, Cancel } from "@mui/icons-material";
import DialpadIcon from "@mui/icons-material/Dialpad";
import PortraitIcon from "@mui/icons-material/Portrait";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
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
  const [equipamentoParaInativar, setEquipamentoParaInativar] = useState<
    number | null
  >(null);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);

  const [modalTipoEquipamentoOpen, setModalTipoEquipamentoOpen] =
    useState(false);

  const [modalCatracaOpen, setModalCatracaOpen] = useState(false);
  const [modalLeitorOpen, setModalLeitorOpen] = useState(false);
  const [modalReconhecimentoFacialOpen, setModalReconhecimentoFacialOpen] =
    useState(false);
  const [modalImpressoraOpen, setModalImpressoraOpen] = useState(false);
  const [modeloCatraca, setModeloCatraca] = useState<string>("");
  const [descricaoCatraca, setDescricaoCatraca] = useState<string>("");
  const [versaoTopData, setVersaoTopData] = useState<string>("");
  const [ipServidorTopData, setIpServidorTopData] = useState<string>("");
  const [ipInnerTopData, setIpInnerTopData] = useState<string>("");
  const [sentidoCatraca, setSentidoCatraca] = useState<string>("horario");
  const [tipoLeitor, setTipoLeitor] = useState<string>("codigo-barras");
  const [biometriaHabilitada, setBiometriaHabilitada] =
    useState<boolean>(false);
  const [modalLeitorBiometricoOpen, setModalLeitorBiometricoOpen] =
    useState(false);
  const [tipoLeitorBiometrico, setTipoLeitorBiometrico] = useState<string>("");
  const [giroCatraca, setGiroCatraca] = useState<string>("entrada");
  // Estados para a catraca Actuar LiteNet 2
  const [faixaIp, setFaixaIp] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [versaoActuar, setVersaoActuar] = useState<string>("v1");
  const [sentidoCatracaLiteNet, setSentidoCatracaLiteNet] =
    useState<string>("horario");
  const [giroCatracaLiteNet, setGiroCatracaLiteNet] =
    useState<string>("entrada");
  const [ipHenry7x, setIpHenry7x] = useState<string>("");
  const [sentidoHenry7x, setSentidoHenry7x] = useState<string>("horario");
  const [giroHenry7x, setGiroHenry7x] = useState<string>("entrada");
  const [modoLeituraHenry7x, setModoLeituraHenry7x] =
    useState<string>("teclado-biometria");
  const [ipHenry8x, setIpHenry8x] = useState<string>("");
  const [sentidoHenry8x, setSentidoHenry8x] = useState<string>("horario");
  const [giroHenry8x, setGiroHenry8x] = useState<string>("entrada");
  const [nomeSerialGenerica, setNomeSerialGenerica] = useState<string>("");
  const [portaComSerialGenerica, setPortaComSerialGenerica] =
    useState<string>("");
  const [sentidoSerialGenerica, setSentidoSerialGenerica] =
    useState<string>("horario");
  const [giroSerialGenerica, setGiroSerialGenerica] =
    useState<string>("entrada");
  const [rtsSerialGenerica, setRtsSerialGenerica] = useState<boolean>(true);
  const [dtrSerialGenerica, setDtrSerialGenerica] = useState<boolean>(true);
  const [ipIdBlockEnterprise, setIpIdBlockEnterprise] = useState<string>("");
  const [sentidoIdBlockEnterprise, setSentidoIdBlockEnterprise] =
    useState<string>("horario");
  const [giroIdBlockEnterprise, setGiroIdBlockEnterprise] =
    useState<string>("entrada");
  const [ipIdBlockModoPro, setIpIdBlockModoPro] = useState<string>("");
  const [sentidoIdBlockModoPro, setSentidoIdBlockModoPro] =
    useState<string>("horario");
  const [giroIdBlockModoPro, setGiroIdBlockModoPro] =
    useState<string>("entrada");
  const [ipProveuTupa, setIpProveuTupa] = useState<string>("");
  const [sentidoProveuTupa, setSentidoProveuTupa] = useState<string>("horario");
  const [giroProveuTupa, setGiroProveuTupa] = useState<string>("entrada");
  const [tipoComunicacaoTecnibra, setTipoComunicacaoTecnibra] =
    useState<string>("tcpip");
  const [ipTecnibra, setIpTecnibra] = useState<string>("");
  const [portaComTecnibra, setPortaComTecnibra] = useState<string>("");
  const [sentidoTecnibra, setSentidoTecnibra] = useState<string>("horario");
  const [giroTecnibra, setGiroTecnibra] = useState<string>("entrada");
  const [autenticacaoTecladoTecnibra, setAutenticacaoTecladoTecnibra] =
    useState<boolean>(true);
  const [autenticacaoBiometriaTecnibra, setAutenticacaoBiometriaTecnibra] =
    useState<boolean>(true);
  const [autenticacaoTecladoIdBlock, setAutenticacaoTecladoIdBlock] =
    useState<boolean>(false);
  const [autenticacaoBiometriaIdBlock, setAutenticacaoBiometriaIdBlock] =
    useState<boolean>(false);
  const [autenticacaoFacialIdBlock, setAutenticacaoFacialIdBlock] =
    useState<boolean>(false);
  const [descricaoImpressora, setDescricaoImpressora] = useState<string>("");
  const [tipoFacial, setTipoFacial] = useState("");
  const [ipIDFace, setIpIDFace] = useState("");
  const [criarCatracaDependente, setCriarCatracaDependente] = useState(false);
  const [nomeCameraPrincipal, setNomeCameraPrincipal] = useState<string>("");
  const [tamanhoMinimoFace, setTamanhoMinimoFace] = useState<number>(100);
  const [utilizarOutraCameraParaCadastro, setUtilizarOutraCameraParaCadastro] =
    useState<boolean>(false);
  const [ipHikvision, setIpHikvision] = useState<string>("");
  const [portaHttpHikvision, setPortaHttpHikvision] = useState<string>("80");
  const [portaServidorHikvision, setPortaServidorHikvision] =
    useState<string>("8000");
  const [usuarioHikvision, setUsuarioHikvision] = useState<string>("");
  const [senhaHikvision, setSenhaHikvision] = useState<string>("");
  const [modalObservacaoOpen, setModalObservacaoOpen] = useState(false);
  const [tipoObservacao, setTipoObservacao] = useState<
    "semPredefinicao" | "instalacao" | null
  >(null);
  const [observacaoTexto, setObservacaoTexto] = useState("");
  const [habilitarControleImpressao, setHabilitarControleImpressao] =
    useState(false);
  const [modalAcessosOpen, setModalAcessosOpen] = useState(false);
  const [acessos, setAcessos] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o refreshToken está presente no LocalStorage
    const refreshToken = LocalStorageHelper.getItem<string>(keyRefreshToken);

    if (!refreshToken) {
      // Se o refreshToken não existir, redireciona para a tela de login
      navigate("/pageLogin");
    }
  }, [navigate]);

  const expiresAt = new Date(localStorage.getItem("expires_at") || "");
  if (new Date() > expiresAt) {
    navigate("/pageLogin");
  }

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
      setEmail("");
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

  const inativarEquipamento = async (codigoEquipamento: number) => {
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
            (equipamento) => equipamento.Id !== codigoEquipamento
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

  const obterPerfilAdministrador = async (codigoUnidade: string) => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    try {
      const response = await fetch(
        `https://api.nextfit.com.br/api/PerfilAcesso?fields=%5B%22Id%22,%22Nome%22%5D&filter=%5B%7B%22property%22:%22Nome%22,%22operator%22:%22contains%22,%22value%22:%22%22,%22and%22:%22true%22%7D,%7B%22property%22:%22Inativo%22,%22operator%22:%22equal%22,%22value%22:false,%22and%22:true%7D%5D&limit=5&page=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao obter perfis de acesso");
      }

      const data: RespostaBaseApi<{ Id: number; Nome: string }[]> =
        await response.json();

      // Filtra o perfil de administrador
      const perfilAdministrador = data.Content.find(
        (perfil) => perfil.Nome === "Administrador"
      );

      if (!perfilAdministrador) {
        throw new Error("Perfil de administrador não encontrado");
      }

      return perfilAdministrador.Id.toString(); // Retorna o Id como string
    } catch (error) {
      console.error("Erro ao obter perfil de administrador:", error);
      return null;
    }
  };

  const criarUsuarioCatraca = async () => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    // Verifica se há um cadastro selecionado
    if (!cadastroSelecionado) {
      enqueueSnackbar("Nenhum cadastro selecionado.", {
        variant: "error",
      });
      return;
    }

    // Recupera o e-mail do usuário master
    const usuarioMaster = LocalStorageHelper.getItem<Usuario>(keyUsuarioMaster);
    const emailMaster = usuarioMaster?.Email || "";

    // Formata o e-mail com "catraca" após o @
    const emailCatraca = emailMaster.replace(/@[^.]+/, "@controle");

    const emailJaExiste = usuarios.some(
      (usuario) => usuario.Email === emailCatraca
    );

    if (emailJaExiste) {
      enqueueSnackbar("O e-mail de controle já existe!", {
        variant: "warning",
      });
      return; // Interrompe a criação do usuário
    }

    // Define a data de nascimento (um dia antes da data atual)
    const dataNascimento = new Date();
    dataNascimento.setDate(dataNascimento.getDate() - 1); // Subtrai um dia

    // Obtém o CodigoPerfilAcesso do perfil de administrador
    const codigoPerfilAcesso = await obterPerfilAdministrador(
      cadastroSelecionado.CodigoUnidade.toString() // Agora garantimos que cadastroSelecionado não é null/undefined
    );

    if (!codigoPerfilAcesso) {
      enqueueSnackbar("Erro ao obter o perfil de administrador.", {
        variant: "error",
      });
      return;
    }

    // Dados do usuário
    const usuarioData = {
      Nome: "Controle de acesso (Não alterar)",
      Email: emailCatraca,
      TelefoneCompleto: "(99)999999999",
      DddFone: "99",
      Fone: "999999999",
      Senha: "123456a",
      DataNascimento: dataNascimento.toISOString(), // Formato ISO
      TipoCadastro: 1,
      TipoConselho: 1,
      CodigoUnidadePreferencial: cadastroSelecionado.CodigoUnidade.toString(), // Convertido para string
      Unidades: [
        {
          CodigoUnidade: cadastroSelecionado.CodigoUnidade.toString(), // Convertido para string
          CodigoPerfilAcesso: codigoPerfilAcesso, // Perfil de acesso obtido dinamicamente
        },
      ],
      Usuario: emailCatraca,
    };

    console.log("Payload enviado:", usuarioData); // Log para depuração

    try {
      const response = await fetch("https://api.nextfit.com.br/api/usuario", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioData),
      });

      console.log("Resposta da API:", response); // Log para depuração

      if (!response.ok) {
        const errorResponse = await response.json(); // Captura a resposta de erro da API
        console.error("Resposta de erro da API:", errorResponse); // Log para depuração
        throw new Error(
          errorResponse.Message || "Erro ao criar usuário catraca"
        );
      }

      const resposta: RespostaBaseApi<{ Id: number }> = await response.json();

      if (resposta.Success) {
        enqueueSnackbar("Usuário catraca criado com sucesso!", {
          variant: "success",
        });
        console.log("ID do usuário criado:", resposta.Content.Id);

        // Atualiza a lista de usuários no frontend
        const novoUsuario: Usuario = {
          Id: resposta.Content.Id,
          Nome: usuarioData.Nome,
          Email: usuarioData.Email,
          TelefoneCompleto: usuarioData.TelefoneCompleto,
          DddFone: usuarioData.DddFone,
          Fone: usuarioData.Fone,
          TipoPerfil: 1, // Defina o tipo de perfil conforme necessário
          Inativo: false,
          TipoCadastro: usuarioData.TipoCadastro,
          TipoConselho: usuarioData.TipoConselho,
          CodigoUnidadePreferencial: usuarioData.CodigoUnidadePreferencial,
          Unidades: usuarioData.Unidades,
          Usuario: usuarioData.Usuario,
          AcessoBloqueado: false,
        };

        // Adiciona o novo usuário ao estado `usuarios`
        setUsuarios((prevUsuarios) => [...prevUsuarios, novoUsuario]);
      } else {
        throw new Error(resposta.Message || "Erro ao criar usuário catraca");
      }
    } catch (error) {
      console.error("Erro ao criar usuário catraca:", error);
      enqueueSnackbar("Erro ao criar usuário catraca. Tente novamente.", {
        variant: "error",
      });
    }
  };

  const handleSelecionarTipoEquipamento = (tipo: string) => {
    setModalTipoEquipamentoOpen(false); // Fecha o modal de seleção de tipo
    switch (tipo) {
      case "catraca":
        setModalCatracaOpen(true);
        break;
      case "leitor":
        setModalLeitorBiometricoOpen(true); // Abre o modal de leitor biométrico
        break;
      case "reconhecimento_facial":
        setModalReconhecimentoFacialOpen(true);
        break;
      case "impressora":
        setModalImpressoraOpen(true);
        break;
      default:
        break;
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

  const modelosCatraca = [
    "Fake",
    "TopData",
    "Actuar Smart",
    "Actuar LiteNet2",
    "Henry 7x",
    "Henry 8x",
    "Serial Genérica",
    "iD Block Enterprise",
    "iD Block Modo Pro",
    "Proveu Tupã",
    "Tecnibra TCA IHM",
  ];

  const handleCriarCatraca = async () => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    if (!modeloCatraca) {
      enqueueSnackbar("Selecione um modelo de catraca.", {
        variant: "warning",
      });
      return;
    }

    let payload: any;

    if (modeloCatraca === "Fake") {
      // Payload para catraca Fake
      payload = {
        Descricao: descricaoCatraca,
        Tipo: 1,
        ModeloCatraca: 20,
        ModeloLeitorBiometria: null,
        ModeloImpressora: null,
        ModeloReconhecimentoFacial: null,
        ModeloTeclado: null,
        Fake: {
          Giro: 2,
        },
      };
    } else if (modeloCatraca === "TopData") {
      // Verifica se o tipo de leitor é "Prox. Wiegand FC Sem Separador" (tipoLeitor === 6)
      const descricao =
        tipoLeitor === "wiegand"
          ? `TopData c/facial v: ${versaoTopData} Servidor: ${ipServidorTopData} Inner: ${ipInnerTopData}`
          : `TopData v: ${versaoTopData} Servidor: ${ipServidorTopData} Inner: ${ipInnerTopData}`;

      // Payload para catraca TopData
      payload = {
        Descricao: descricao,
        Tipo: 1,
        ModeloCatraca: 1,
        ModeloLeitorBiometria: null,
        ModeloImpressora: null,
        ModeloReconhecimentoFacial: null,
        ModeloTeclado: null,
        TopData: {
          TipoComunicacao: 2,
          Porta: "3570",
          QuantidadeDigitos: 4,
          Giro: 2,
          SentidoCatraca: sentidoCatraca === "horario" ? 1 : 2,
          Inner: "1",
          Biometria: biometriaHabilitada,
          Identificacao: true,
          Teclado: true,
          TipoLeitor: tipoLeitor === "codigo-barras" ? 0 : 6,
        },
      };
    } else if (modeloCatraca === "Actuar Smart") {
      // Cria o leitor biométrico Digital Persona V2
      const codigoLeitorBiometrico =
        await criarLeitorBiometricoDigitalPersonaV2();

      if (!codigoLeitorBiometrico) {
        enqueueSnackbar(
          "Erro ao criar leitor biométrico. A catraca não foi criada.",
          {
            variant: "error",
          }
        );
        return;
      }

      // Payload para catraca Actuar Smart
      payload = {
        Descricao: "Actuar Smart",
        Tipo: 1,
        ModeloCatraca: 3,
        ModeloLeitorBiometria: null,
        ModeloImpressora: null,
        ModeloReconhecimentoFacial: null,
        ModeloTeclado: null,
        ActuarSmart: {
          ModoIp: 1,
          Giro: giroCatraca === "entrada" ? 2 : 4, // 2 para entrada, 4 para entrada e saída
          SentidoCatraca: sentidoCatraca === "horario" ? 1 : 2, // 1 para horário, 2 para anti-horário
          UtilizaLeitorBiometricoExternoValidacao: true,
          CodigoLeitorBiometricoExternoValidacao: codigoLeitorBiometrico,
        },
      };
    } else if (modeloCatraca === "Actuar LiteNet2") {
      // Payload para catraca Actuar LiteNet 2
      if (!faixaIp || !numero) {
        enqueueSnackbar("Preencha todos os campos obrigatórios.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento correto do campo Giro com base no backend
      let giro;
      switch (giroCatracaLiteNet) {
        case "entrada":
          giro = 2; // Controla Entrada
          break;
        case "entrada-saida":
          giro = 4; // Controla Entrada e Saída
          break;
        default:
      }

      payload = {
        Descricao:
          versaoActuar === "v1"
            ? "Actuar LiteNet 2"
            : "Actuar LiteNet 2 c/teclado",
        Tipo: 1,
        ModeloCatraca: 19,
        ModeloLeitorBiometria: null,
        ModeloImpressora: null,
        ModeloReconhecimentoFacial: null,
        ModeloTeclado: null,
        ActuarLiteNet2: {
          Versao: versaoActuar === "v1" ? 1 : 2,
          QuantidadeDigitos: 4,
          Numero: numero,
          SentidoCatraca: sentidoCatracaLiteNet === "horario" ? 1 : 2,
          FaixaIp: faixaIp,
          Giro: giro, // Usando o valor mapeado corretamente
        },
      };
    } else if (modeloCatraca === "Henry 7x") {
      // Validação dos campos obrigatórios
      if (!ipHenry7x) {
        enqueueSnackbar("Preencha o IP da catraca.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento dos valores do formulário
      const sentido = sentidoHenry7x === "horario" ? 1 : 2; // 1 para horário, 2 para anti-horário
      const giro = giroHenry7x === "entrada" ? 2 : 4; // 2 para entrada, 4 para entrada e saída
      const formaLeitura =
        modoLeituraHenry7x === "teclado-biometria"
          ? 3
          : modoLeituraHenry7x === "teclado"
          ? 1
          : 2; // 3 para teclado e biometria, 1 para teclado, 2 para biometria

      // Payload para a Henry 7x
      payload = {
        Descricao: "Henry 7X", // Fixo
        Tipo: 1, // Fixo
        ModeloCatraca: 4, // Fixo
        ModeloLeitorBiometria: null, // Fixo
        ModeloImpressora: null, // Fixo
        ModeloReconhecimentoFacial: null, // Fixo
        ModeloTeclado: null, // Fixo
        Henry7X: {
          TipoComunicacao: 1, // Fixo
          Porta: "3000", // Fixo
          SentidoCatraca: sentido, // Preenchido pelo usuário
          Ip: ipHenry7x, // Preenchido pelo usuário
          Giro: giro, // Preenchido pelo usuário
          FormaLeitura: formaLeitura, // Preenchido pelo usuário
          QuantidadeDigitos: 4, // Fixo
          TempoLiberacaoSegundos: 3, // Fixo
        },
      };
    } else if (modeloCatraca === "Henry 8x") {
      // Validação dos campos obrigatórios
      if (!ipHenry8x) {
        enqueueSnackbar("Preencha o IP da catraca.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento dos valores do formulário
      const sentido = sentidoHenry8x === "horario" ? 1 : 2; // 1 para horário, 2 para anti-horário
      const giro = giroHenry8x === "entrada" ? 2 : 4; // 2 para entrada, 4 para entrada e saída

      // Payload para a Henry 8x
      payload = {
        Descricao: `Henry 8x WebServer: ${ipHenry8x}`, // Descrição com o IP
        Tipo: 1, // Fixo
        ModeloCatraca: 8, // Fixo
        ModeloLeitorBiometria: null, // Fixo
        ModeloImpressora: null, // Fixo
        ModeloReconhecimentoFacial: null, // Fixo
        ModeloTeclado: null, // Fixo
        Henry8X: {
          Ip: ipHenry8x, // Preenchido pelo usuário
          Porta: "3000", // Fixo
          ModeloPlaca: 1, // Fixo
          Giro: giro, // Preenchido pelo usuário
          SentidoCatraca: sentido, // Preenchido pelo usuário
          QuantidadeDigitos: 4, // Fixo
          TempoLiberacaoSegundos: 5, // Fixo
          ModeloBiometria: 1, // Fixo
        },
      };
    } else if (modeloCatraca === "Serial Genérica") {
      // Validação dos campos obrigatórios
      if (!nomeSerialGenerica || !portaComSerialGenerica) {
        enqueueSnackbar("Preencha todos os campos obrigatórios.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento dos valores do formulário
      const sentido = sentidoSerialGenerica === "horario" ? 1 : 2; // 1 para horário, 2 para anti-horário
      const giro = giroSerialGenerica === "entrada" ? 2 : 4; // 2 para entrada, 4 para entrada e saída

      // Payload para a Serial Genérica
      payload = {
        Descricao: nomeSerialGenerica, // Nome do equipamento
        Tipo: 1, // Fixo
        ModeloCatraca: 9, // Fixo
        ModeloLeitorBiometria: null, // Fixo
        ModeloImpressora: null, // Fixo
        ModeloReconhecimentoFacial: null, // Fixo
        ModeloTeclado: null, // Fixo
        SerialGenerica: {
          PortaCom: portaComSerialGenerica, // Preenchido pelo usuário
          SentidoCatraca: sentido, // Preenchido pelo usuário
          QuantidadeDigitos: 4, // Fixo
          Giro: giro, // Preenchido pelo usuário
          TempoLiberacaoSegundos: 3, // Fixo
          Rts: rtsSerialGenerica, // Preenchido pelo usuário
          Dtr: dtrSerialGenerica, // Preenchido pelo usuário
        },
      };
    } else if (modeloCatraca === "iD Block Enterprise") {
      // Validação dos campos obrigatórios
      if (!ipIdBlockEnterprise) {
        enqueueSnackbar("Preencha o IP da catraca.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento dos valores do formulário
      const sentido = sentidoIdBlockEnterprise === "horario" ? 1 : 2; // 1 para horário, 2 para anti-horário
      const giro = giroIdBlockEnterprise === "entrada" ? 2 : 4; // 2 para entrada, 4 para entrada e saída

      // Payload para a iD Block Enterprise
      payload = {
        Descricao: `iD Block Enterprise - ${ipIdBlockEnterprise}`, // Descrição com o IP
        Tipo: 1, // Fixo
        ModeloCatraca: 2, // Fixo
        ModeloLeitorBiometria: null, // Fixo
        ModeloImpressora: null, // Fixo
        ModeloReconhecimentoFacial: null, // Fixo
        ModeloTeclado: null, // Fixo
        IdBlock: {
          Ip: ipIdBlockEnterprise, // Preenchido pelo usuário
          Porta: "80", // Fixo
          Usuario: "admin", // Fixo
          Senha: "admin", // Fixo
          SentidoCatraca: sentido, // Preenchido pelo usuário
          Giro: giro, // Preenchido pelo usuário
        },
      };
    } else if (modeloCatraca === "iD Block Modo Pro") {
      // Validação dos campos obrigatórios
      if (!ipIdBlockModoPro) {
        enqueueSnackbar("Preencha o IP da catraca.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento dos valores do formulário
      const sentido = sentidoIdBlockModoPro === "horario" ? 1 : 2; // 1 para horário, 2 para anti-horário
      const giro = giroIdBlockModoPro === "entrada" ? 2 : 4; // 2 para entrada, 4 para entrada e saída

      // Payload para a iD Block Modo Pro
      payload = {
        Descricao: `iD Block Next - Modo Pro - ${ipIdBlockModoPro}`, // Descrição com o IP
        Tipo: 1, // Fixo
        ModeloCatraca: 26, // Fixo
        ModeloLeitorBiometria: null, // Fixo
        ModeloImpressora: null, // Fixo
        ModeloReconhecimentoFacial: null, // Fixo
        ModeloTeclado: null, // Fixo
        IdBlockV2: {
          Ip: ipIdBlockModoPro, // Preenchido pelo usuário
          PortaServidorLocal: "8081", // Fixo
          Facial: autenticacaoFacialIdBlock, // Preenchido pelo usuário
          Teclado: autenticacaoTecladoIdBlock, // Preenchido pelo usuário
          Biometria: autenticacaoBiometriaIdBlock, // Preenchido pelo usuário
          FormaLiberacao: 1, // Fixo
          Giro: giro, // Preenchido pelo usuário
          Modelo: 2, // Fixo
          Senha: "admin", // Fixo
          SentidoCatraca: sentido, // Preenchido pelo usuário
          TempoLiberacaoSegundos: 3, // Fixo
          Usuario: "admin", // Fixo
        },
      };
    } else if (modeloCatraca === "Proveu Tupã") {
      // Validação dos campos obrigatórios
      if (!ipProveuTupa) {
        enqueueSnackbar("Preencha o IP da catraca.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento dos valores do formulário
      const sentido = sentidoProveuTupa === "horario" ? 1 : 2; // 1 para horário, 2 para anti-horário
      const giro = giroProveuTupa === "entrada" ? 2 : 4; // 2 para entrada, 4 para entrada e saída

      // Payload para a Proveu Tupã
      payload = {
        Descricao: "Proveu Tupã", // Fixo
        Tipo: 1, // Fixo
        ModeloCatraca: 11, // Fixo
        ModeloLeitorBiometria: null, // Fixo
        ModeloImpressora: null, // Fixo
        ModeloReconhecimentoFacial: null, // Fixo
        ModeloTeclado: null, // Fixo
        ProveuTupa: {
          Ip: ipProveuTupa, // Preenchido pelo usuário
          Porta: "5151", // Fixo
          QuantidadeDigitos: 4, // Fixo
          SentidoCatraca: sentido, // Preenchido pelo usuário
          Codigo: "0001", // Fixo
          Giro: giro, // Preenchido pelo usuário
          TempoLiberacaoSegundos: 5, // Fixo
        },
      };
    } else if (modeloCatraca === "Tecnibra TCA IHM") {
      // Validação dos campos obrigatórios
      if (
        (tipoComunicacaoTecnibra === "tcpip" && !ipTecnibra) ||
        (tipoComunicacaoTecnibra === "serial" && !portaComTecnibra)
      ) {
        enqueueSnackbar("Preencha todos os campos obrigatórios.", {
          variant: "warning",
        });
        return;
      }

      // Mapeamento dos valores do formulário
      const sentido = sentidoTecnibra === "horario" ? 1 : 2; // 1 para horário, 2 para anti-horário
      const giro = giroTecnibra === "entrada" ? 2 : 4; // 2 para entrada, 4 para entrada e saída
      const tipoComunicacao = tipoComunicacaoTecnibra === "tcpip" ? 1 : 2; // 1 para TCP/IP, 2 para Serial

      // Payload para a Tecnibra
      payload = {
        Descricao: "Tecnibra", // Fixo
        Tipo: 1, // Fixo
        ModeloCatraca: 7, // Fixo
        ModeloLeitorBiometria: null, // Fixo
        ModeloImpressora: null, // Fixo
        ModeloReconhecimentoFacial: null, // Fixo
        ModeloTeclado: null, // Fixo
        TecnibraTcaIhm: {
          TipoComunicacao: tipoComunicacao, // Preenchido pelo usuário
          Codigo: "1", // Fixo
          Senha: "123456", // Fixo
          TempoLiberacaoSegundos: 3, // Fixo
          QuantidadeDigitos: 4, // Fixo
          SentidoCatraca: sentido, // Preenchido pelo usuário
          Giro: giro, // Preenchido pelo usuário
          UtilizaTeclado: autenticacaoTecladoTecnibra, // Preenchido pelo usuário
          UtilizaBiometria: autenticacaoBiometriaTecnibra, // Preenchido pelo usuário
          ...(tipoComunicacao === 1
            ? { Ip: ipTecnibra } // Adiciona o campo Ip apenas para TCP/IP
            : { PortaCom: portaComTecnibra }), // Adiciona o campo PortaCom apenas para Serial
        },
      };
    }

    try {
      const response = await fetch(
        "https://api.nextfit.com.br/api/equipamento",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar catraca");
      }

      enqueueSnackbar("Catraca criada com sucesso!", {
        variant: "success",
      });

      // Fecha o modal e reseta os estados
      setModalCatracaOpen(false);
      setModeloCatraca("");
      setDescricaoCatraca("");
      setVersaoTopData("");
      setIpServidorTopData("");
      setIpInnerTopData("");
      setSentidoCatraca("horario");
      setGiroCatraca("entrada");
      setFaixaIp("");
      setNumero("");
      setVersaoActuar("v1");
      setSentidoCatracaLiteNet("horario");
      setGiroCatracaLiteNet("entrada");
      setIpHenry7x("");
      setSentidoHenry7x("horario");
      setGiroHenry7x("entrada");
      setModoLeituraHenry7x("teclado-biometria");
      setIpHenry8x("");
      setSentidoHenry8x("horario");
      setGiroHenry8x("entrada");
      setNomeSerialGenerica("");
      setPortaComSerialGenerica("");
      setSentidoSerialGenerica("horario");
      setGiroSerialGenerica("entrada");
      setRtsSerialGenerica(true);
      setDtrSerialGenerica(true);
      setIpIdBlockEnterprise("");
      setSentidoIdBlockEnterprise("horario");
      setGiroIdBlockEnterprise("entrada");
      setIpIdBlockModoPro("");
      setSentidoIdBlockModoPro("horario");
      setGiroIdBlockModoPro("entrada");
      setIpProveuTupa("");
      setSentidoProveuTupa("horario");
      setGiroProveuTupa("entrada");
      setTipoComunicacaoTecnibra("tcpip");
      setIpTecnibra("");
      setPortaComTecnibra("");
      setSentidoTecnibra("horario");
      setGiroTecnibra("entrada");
      setAutenticacaoTecladoTecnibra(true);
      setAutenticacaoBiometriaTecnibra(true);
      setAutenticacaoTecladoIdBlock(false);
      setAutenticacaoBiometriaIdBlock(false);
      setAutenticacaoFacialIdBlock(false);

      // Atualiza a lista de equipamentos
      await buscarEquipamentosCadastroSelecionado();
    } catch (error) {
      console.error("Erro ao criar catraca:", error);
      enqueueSnackbar("Erro ao criar catraca. Tente novamente.", {
        variant: "error",
      });
    }
  };

  const handleCriarLeitorBiometrico = async () => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    if (!tipoLeitorBiometrico) {
      enqueueSnackbar("Selecione um tipo de leitor biométrico.", {
        variant: "warning",
      });
      return;
    }

    let payload: any;

    // Verifica o tipo de leitor biométrico selecionado
    switch (tipoLeitorBiometrico) {
      case "Digital Persona V2":
        payload = {
          Descricao: "Digital Persona V2",
          Tipo: 2, // Tipo 2 para leitor biométrico
          ModeloCatraca: null,
          ModeloLeitorBiometria: 2, // Modelo específico para Digital Persona V2
          ModeloImpressora: null,
          ModeloReconhecimentoFacial: null,
          ModeloTeclado: null,
          DigitalPersonaUAreU: {
            Driver: 2, // Driver específico para Digital Persona V2
          },
        };
        break;

      case "Futronic":
        payload = {
          Descricao: "Futronic",
          Tipo: 2, // Tipo 2 para leitor biométrico
          ModeloCatraca: null,
          ModeloLeitorBiometria: 1, // Modelo específico para Futronic
          ModeloImpressora: null,
          ModeloReconhecimentoFacial: null,
          ModeloTeclado: null,
          FS80H: {
            UtilizaImpressaoTreino: false, // Configuração específica para Futronic
          },
        };
        break;

      case "Hamster DX":
        payload = {
          Descricao: "Hamster DX",
          Tipo: 2, // Tipo 2 para leitor biométrico
          ModeloCatraca: null,
          ModeloLeitorBiometria: 3, // Modelo específico para Hamster DX
          ModeloImpressora: null,
          ModeloReconhecimentoFacial: null,
          ModeloTeclado: null,
          HamsterDx: {
            UtilizaImpressaoTreino: false, // Configuração específica para Hamster DX
          },
        };
        break;

      default:
        enqueueSnackbar("Tipo de leitor biométrico não suportado.", {
          variant: "warning",
        });
        return;
    }

    try {
      const response = await fetch(
        "https://api.nextfit.com.br/api/equipamento",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar leitor biométrico");
      }

      enqueueSnackbar("Leitor biométrico criado com sucesso!", {
        variant: "success",
      });

      setModalLeitorBiometricoOpen(false);
      setTipoLeitorBiometrico("");

      await buscarEquipamentosCadastroSelecionado();
    } catch (error) {
      console.error("Erro ao criar leitor biométrico:", error);
      enqueueSnackbar("Erro ao criar leitor biométrico. Tente novamente.", {
        variant: "error",
      });
    }
  };

  const criarLeitorBiometricoDigitalPersonaV2 = async (): Promise<
    number | null
  > => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    const payload = {
      Descricao: "Digital Persona V2",
      Tipo: 2, // Tipo 2 para leitor biométrico
      ModeloCatraca: null,
      ModeloLeitorBiometria: 2, // Modelo específico para Digital Persona V2
      ModeloImpressora: null,
      ModeloReconhecimentoFacial: null,
      ModeloTeclado: null,
      DigitalPersonaUAreU: {
        Driver: 2, // Driver específico para Digital Persona V2
      },
    };

    try {
      const response = await fetch(
        "https://api.nextfit.com.br/api/equipamento",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar leitor biométrico");
      }

      const resposta: RespostaBaseApi<{ Id: number }> = await response.json();
      return resposta.Content.Id; // Retorna o Id do leitor biométrico criado
    } catch (error) {
      console.error("Erro ao criar leitor biométrico:", error);
      enqueueSnackbar("Erro ao criar leitor biométrico. Tente novamente.", {
        variant: "error",
      });
      return null;
    }
  };

  const handleCriarImpressora = async () => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    // Validação dos campos obrigatórios
    if (!descricaoImpressora) {
      enqueueSnackbar("Preencha a descrição da impressora.", {
        variant: "warning",
      });
      return;
    }

    try {
      let impressoraId: number | null = null;

      // Cria a impressora correta primeiro
      const payloadImpressora = {
        Descricao: descricaoImpressora,
        Tipo: 3, // Tipo 3 para impressora
        ModeloCatraca: null,
        ModeloLeitorBiometria: null,
        ModeloImpressora: 1, // Modelo específico para impressora
        ModeloReconhecimentoFacial: null,
        ModeloTeclado: null,
      };

      const responseImpressora = await fetch(
        "https://api.nextfit.com.br/api/equipamento",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadImpressora),
        }
      );

      if (!responseImpressora.ok) {
        throw new Error("Erro ao criar impressora");
      }

      const respostaImpressora: RespostaBaseApi<{ Id: number }> =
        await responseImpressora.json();
      impressoraId = respostaImpressora.Content.Id; // Salva o ID da impressora criada

      // Se a checkbox estiver marcada, cria a catraca fake e vincula a impressora
      if (habilitarControleImpressao) {
        const payloadCatraca = {
          Descricao: "Controle de Impressão",
          Tipo: 1, // Tipo 1 para catraca
          ModeloCatraca: 20, // Modelo específico para catraca fake
          ModeloLeitorBiometria: null,
          ModeloImpressora: null,
          ModeloReconhecimentoFacial: null,
          ModeloTeclado: null,
          Fake: {
            Giro: 2,
            UtilizaImpressaoTreino: true,
            CodigoImpressoraTreino: impressoraId, // Usa o ID da impressora criada
            ImpressoraTreino: {
              Descricao: descricaoImpressora, // Descrição da impressora correta
              Tipo: 3, // Tipo 3 para impressora
              ModeloCatraca: null,
              ModeloLeitorBiometria: null,
              ModeloImpressora: 1, // Modelo específico para impressora
              ModeloReconhecimentoFacial: null,
              ModeloTeclado: null,
            },
          },
        };

        const responseCatraca = await fetch(
          "https://api.nextfit.com.br/api/equipamento",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadCatraca),
          }
        );

        if (!responseCatraca.ok) {
          throw new Error("Erro ao criar catraca fake");
        }
      }

      enqueueSnackbar("Impressora criada com sucesso!", { variant: "success" });

      // Fecha o modal e reseta os estados
      setModalImpressoraOpen(false);
      setDescricaoImpressora("");
      setHabilitarControleImpressao(false); // Resetando o checkbox

      // Atualiza a lista de equipamentos
      await buscarEquipamentosCadastroSelecionado();
    } catch (error) {
      console.error("Erro ao criar impressora:", error);
      enqueueSnackbar("Erro ao criar impressora. Tente novamente.", {
        variant: "error",
      });
    }
  };

  const handleCriarFacial = async () => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    if (tipoFacial === "Hikvision") {
      const payloadHikvision = {
        Descricao: `Hikvision | IP: ${ipHikvision}`,
        Tipo: 5,
        ModeloCatraca: null,
        ModeloLeitorBiometria: null,
        ModeloImpressora: null,
        ModeloReconhecimentoFacial: 3,
        ModeloTeclado: null,
        HikvisionFacial: {
          Ip: ipHikvision,
          PortaHttp: portaHttpHikvision,
          PortaServidor: portaServidorHikvision,
          Usuario: usuarioHikvision,
          Senha: senhaHikvision,
        },
      };

      try {
        const response = await fetch(
          "https://api.nextfit.com.br/api/equipamento",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadHikvision),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao criar Hikvision Facial");
        }

        enqueueSnackbar("Hikvision Facial criado com sucesso!", {
          variant: "success",
        });

        setModalReconhecimentoFacialOpen(false);
        setIpHikvision("");
        setPortaHttpHikvision("80");
        setPortaServidorHikvision("8000");
        setUsuarioHikvision("");
        setSenhaHikvision("");
        await buscarEquipamentosCadastroSelecionado();
      } catch (error) {
        console.error("Erro ao criar Hikvision Facial:", error);
        enqueueSnackbar("Erro ao criar Hikvision Facial. Tente novamente.", {
          variant: "error",
        });
      }
    } else if (tipoFacial === "Facial Next Fit") {
      // Lógica existente para Facial Next Fit
      const payloadFacialNextFit = {
        Descricao: "Facial Next Fit",
        Tipo: 5,
        ModeloCatraca: null,
        ModeloLeitorBiometria: null,
        ModeloImpressora: null,
        ModeloReconhecimentoFacial: 1,
        ModeloTeclado: null,
        RfNextFit: {
          NomeCameraPrincipal: nomeCameraPrincipal,
          TamanhoMinimoFace: tamanhoMinimoFace,
          UtilizarOutraCameraParaCadastro: utilizarOutraCameraParaCadastro,
          ModoReconhecimentoFacial: 1, // Valor fixo conforme o payload
        },
      };

      try {
        const response = await fetch(
          "https://api.nextfit.com.br/api/equipamento",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadFacialNextFit),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao criar Facial Next Fit");
        }

        enqueueSnackbar("Facial Next Fit criado com sucesso!", {
          variant: "success",
        });

        setModalReconhecimentoFacialOpen(false);
        setNomeCameraPrincipal("");
        setTamanhoMinimoFace(100);
        setUtilizarOutraCameraParaCadastro(false);
        await buscarEquipamentosCadastroSelecionado();
      } catch (error) {
        console.error("Erro ao criar Facial Next Fit:", error);
        enqueueSnackbar("Erro ao criar Facial Next Fit. Tente novamente.", {
          variant: "error",
        });
      }
    } else if (tipoFacial === "iDFace") {
      // Lógica existente para iDFace
      const payloadIDFace = {
        Descricao: `iDFace | IP: ${ipIDFace}`,
        Tipo: 5,
        ModeloCatraca: null,
        ModeloImpressora: null,
        ModeloLeitorBiometria: null,
        ModeloReconhecimentoFacial: 2,
        ModeloTeclado: null,
        IdFace: {
          Ip: ipIDFace,
          PortaServidorLocal: "8081",
          Usuario: "admin",
          Senha: "admin",
          FormaLiberacao: criarCatracaDependente ? 1 : 2, // 1 para SecBox, 2 para iDFace
        },
      };

      try {
        const response = await fetch(
          "https://api.nextfit.com.br/api/equipamento",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadIDFace),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao criar iDFace");
        }

        const resposta: RespostaBaseApi<{ Id: number }> = await response.json();

        if (criarCatracaDependente) {
          const payloadCatracaFake = {
            Descricao: "Catraca dependente do iDFace",
            Tipo: 1, // Tipo 1 para catraca
            ModeloCatraca: 20, // Modelo Fake
            ModeloLeitorBiometria: null,
            ModeloImpressora: null,
            ModeloReconhecimentoFacial: null,
            ModeloTeclado: null,
            Fake: {
              Giro: 2, // Giro padrão
            },
            EquipamentoCatraca: {
              UtilizaReconhecimentoFacial: true,
              CodigoEquipamentoReconhecimentoFacial: resposta.Content.Id,
            },
          };

          const responseCatraca = await fetch(
            "https://api.nextfit.com.br/api/equipamento",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payloadCatracaFake),
            }
          );

          if (!responseCatraca.ok) {
            throw new Error("Erro ao criar catraca dependente");
          }
        }

        enqueueSnackbar("iDFace criado com sucesso!", {
          variant: "success",
        });

        setModalReconhecimentoFacialOpen(false);
        setIpIDFace("");
        setCriarCatracaDependente(false);
        await buscarEquipamentosCadastroSelecionado();
      } catch (error) {
        console.error("Erro ao criar iDFace:", error);
        enqueueSnackbar("Erro ao criar iDFace. Tente novamente.", {
          variant: "error",
        });
      }
    }
  };

  const handleCriarObservacao = async () => {
    const refreshToken = LocalStorageHelper.getItem<string>(keyRefreshToken);

    if (!refreshToken) {
      enqueueSnackbar("Token de autenticação não encontrado.", {
        variant: "error",
      });
      return;
    }

    if (!cadastroSelecionado) {
      enqueueSnackbar("Nenhum cadastro selecionado.", {
        variant: "error",
      });
      return;
    }

    const payload = {
      CodigoCadastro: cadastroSelecionado.Id.toString(),
      Tipo: 5, // Tipo de observação (ajuste conforme necessário)
      Observacao: observacaoTexto, // Usa o texto do textarea, que pode ter sido editado
    };

    try {
      const response = await fetch(
        "https://apiadm.nextfit.com.br/api/CadastroObservacao",
        getOptions(EVerboHttp.POST, payload, refreshToken)
      );

      if (!response.ok) {
        throw new Error("Erro ao criar observação");
      }

      enqueueSnackbar("Observação criada com sucesso!", {
        variant: "success",
      });

      setModalObservacaoOpen(false);
      setTipoObservacao(null);
      setObservacaoTexto("");
    } catch (error) {
      console.error("Erro ao criar observação:", error);
      enqueueSnackbar("Erro ao criar observação. Tente novamente.", {
        variant: "error",
      });
    }
  };

  const handleSelecionarTipoObservacao = (
    tipo: "semPredefinicao" | "instalacao"
  ) => {
    setTipoObservacao(tipo);

    if (tipo === "instalacao") {
      // Preenche o textarea com o texto padrão
      const equipamentosInstalados = equipamentos
        .map((e) => e.Descricao)
        .join(", ");
      const textoPadrao = `Instalação de equipamento(s) concluída com sucesso.\nEquipamento(s) instalado(s):\n${equipamentosInstalados}`;
      setObservacaoTexto(textoPadrao);
    } else {
      // Limpa o textarea para observação sem predefinição
      setObservacaoTexto("");
    }
  };

  const buscarUltimosAcessos = async () => {
    const authToken =
      LocalStorageHelper.getItem<string>(keyUnidadeSelecionadaAuthToken) ?? "";

    // Obtendo a data e hora atuais
    const agora = new Date();
    const quarentaEOitoHorasAtras = new Date(
      agora.getTime() - 48 * 60 * 60 * 1000
    ); // Subtrai 48 horas corretamente

    // Função para formatar a data no padrão dd/MM/yyyy+HH:mm
    const formatarData = (data: Date) => {
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0"); // Meses começam do 0
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, "0");
      const minutos = String(data.getMinutes()).padStart(2, "0");

      return `${dia}%2F${mes}%2F${ano}+${horas}%3A${minutos}`; // Encode correto
    };

    const dataHoraFimStr = formatarData(agora);
    const dataHoraIniStr = formatarData(quarentaEOitoHorasAtras);

    try {
      const response = await fetch(
        `https://api.nextfit.com.br/api/relcliente/RecuperarAcessosContrato?AgruparAcessosPorCliente=false&CodigoCliente=null&DataHoraFimStr=${dataHoraFimStr}&DataHoraIniStr=${dataHoraIniStr}&TipoAcesso=1&limit=30&page=1`,
        getOptions(EVerboHttp.GET, undefined, authToken)
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar acessos dos clientes: ${response.status}`
        );
      }

      const resposta = await response.json();

      const acessos = resposta.Content.map(
        (acesso: {
          AcessoLiberado: boolean;
          ModoReconhecimento: number;
          NomeCliente: string;
          DataHora: string;
        }) => ({
          Status: acesso.AcessoLiberado ? "Liberado" : "Negado",
          ModoReconhecimento: acesso.ModoReconhecimento,
          NomeCliente: acesso.NomeCliente,
          DataHora: new Date(acesso.DataHora).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          }),
        })
      );

      console.log(acessos);
      return acessos;
    } catch (error) {
      console.error("Erro ao buscar acessos:", error);
      return [];
    }
  };

  const renderModoReconhecimento = (tipo: number) => {
    switch (tipo) {
      case 1:
        return <DialpadIcon />; //teclado
      case 2:
        return <FingerprintIcon />; //biometria
      case 3:
        return <QrCodeScannerIcon />; //qrcode
      case 4:
        return <PortraitIcon />; //facial
      default:
        return <Typography variant="body1">-</Typography>;
    }
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
            onClick={criarUsuarioCatraca}
            sx={{ flexGrow: 1, height: "100%", minWidth: 0, width: "100%" }}
          >
            Criar usuário catraca
          </Button>
          <Button
            variant="contained"
            onClick={() => setModalTipoEquipamentoOpen(true)}
            sx={{ flexGrow: 1, height: "100%", minWidth: 0, width: "100%" }}
          >
            Criar equipamentos
          </Button>
          <Button
            variant="contained"
            onClick={() => setModalObservacaoOpen(true)}
            sx={{ flexGrow: 1, height: "100%", minWidth: 0, width: "100%" }}
          >
            Adicionar observação
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              const dados = await buscarUltimosAcessos();
              setAcessos(dados);
              setModalAcessosOpen(true);
            }}
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
                          onClick={() => {
                            setEquipamentoParaInativar(equipamento.Id); // Armazena o Id do equipamento
                            setModalConfirmacaoAberto(true); // Abre o modal de confirmação
                          }}
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
      <Modal
        open={modalConfirmacaoAberto}
        onClose={() => setModalConfirmacaoAberto(false)} // Fecha o modal ao clicar fora
        aria-labelledby="modal-confirmacao-titulo"
        aria-describedby="modal-confirmacao-descricao"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="modal-confirmacao-titulo"
            sx={{ display: "flex", justifyContent: "center" }}
            variant="h6"
            component="h2"
          >
            Confirmar remoção
          </Typography>
          <Typography
            id="modal-confirmacao-descricao"
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          >
            Tem certeza que deseja remover este equipamento?
          </Typography>
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setModalConfirmacaoAberto(false)} // Fecha o modal sem inativar
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (equipamentoParaInativar) {
                  inativarEquipamento(equipamentoParaInativar); // Inativa o equipamento
                }
                setModalConfirmacaoAberto(false); // Fecha o modal
              }}
            >
              Remover
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={modalTipoEquipamentoOpen}
        onClose={() => setModalTipoEquipamentoOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Selecione o equipamento a criar:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleSelecionarTipoEquipamento("catraca")}
            >
              Catraca
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSelecionarTipoEquipamento("leitor")}
            >
              Leitor biométrico
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                handleSelecionarTipoEquipamento("reconhecimento_facial")
              }
            >
              Reconhecimento Facial
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSelecionarTipoEquipamento("impressora")}
            >
              Impressora
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={modalCatracaOpen} onClose={() => setModalCatracaOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Criar Catraca
          </Typography>

          {/* Combobox para seleção do modelo de catraca */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="modelo-catraca-label">Modelo da Catraca</InputLabel>
            <Select
              labelId="modelo-catraca-label"
              id="modelo-catraca"
              value={modeloCatraca}
              label="Modelo da Catraca"
              onChange={(e) => setModeloCatraca(e.target.value as string)}
            >
              {modelosCatraca.map((modelo, index) => (
                <MenuItem key={index} value={modelo}>
                  {modelo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campos específicos para a catraca Fake) */}
          {modeloCatraca === "Fake" && (
            <TextField
              label="Descrição"
              fullWidth
              value={descricaoCatraca}
              onChange={(e) => setDescricaoCatraca(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {/* Campos específicos para a catraca TopData */}
          {modeloCatraca === "TopData" && (
            <>
              <TextField
                label="Versão"
                fullWidth
                value={versaoTopData}
                onChange={(e) => setVersaoTopData(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="IP do Servidor"
                fullWidth
                value={ipServidorTopData}
                onChange={(e) => setIpServidorTopData(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="IP do Inner"
                fullWidth
                value={ipInnerTopData}
                onChange={(e) => setIpInnerTopData(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-catraca-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-catraca-label"
                  id="sentido-catraca"
                  value={sentidoCatraca}
                  label="Sentido da Catraca"
                  onChange={(e) => setSentidoCatraca(e.target.value as string)}
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tipo-leitor-label">Tipo de Leitor</InputLabel>
                <Select
                  labelId="tipo-leitor-label"
                  id="tipo-leitor"
                  value={tipoLeitor}
                  label="Tipo de Leitor"
                  onChange={(e) => setTipoLeitor(e.target.value as string)}
                >
                  <MenuItem value="codigo-barras">Código de Barras</MenuItem>
                  <MenuItem value="wiegand">
                    Prox. Wiegand FC Sem Separador
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={biometriaHabilitada}
                    onChange={(e) => setBiometriaHabilitada(e.target.checked)}
                  />
                }
                label="Habilitar Biometria"
                sx={{ mb: 2 }}
              />
            </>
          )}

          {/* Campos específicos para a catraca Actuar Smart) */}
          {modeloCatraca === "Actuar Smart" && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-catraca-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-catraca-label"
                  id="sentido-catraca"
                  value={sentidoCatraca}
                  label="Sentido da Catraca"
                  onChange={(e) => setSentidoCatraca(e.target.value as string)}
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-catraca-label">Giro da Catraca</InputLabel>
                <Select
                  labelId="giro-catraca-label"
                  id="giro-catraca"
                  value={giroCatraca}
                  label="Giro da Catraca"
                  onChange={(e) => setGiroCatraca(e.target.value as string)}
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {modeloCatraca === "Actuar LiteNet2" && (
            <>
              <TextField
                label="Faixa de IP"
                fullWidth
                value={faixaIp}
                onChange={(e) => setFaixaIp(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Número"
                fullWidth
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="versao-actuar-label">Versão</InputLabel>
                <Select
                  labelId="versao-actuar-label"
                  id="versao-actuar"
                  value={versaoActuar}
                  label="Versão"
                  onChange={(e) => setVersaoActuar(e.target.value as string)}
                >
                  <MenuItem value="v1">V1 - Actuar (sem teclado)</MenuItem>
                  <MenuItem value="v2">V2 - Toletus (com teclado)</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-catraca-litenet-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-catraca-litenet-label"
                  id="sentido-catraca-litenet"
                  value={sentidoCatracaLiteNet}
                  label="Sentido da Catraca"
                  onChange={(e) =>
                    setSentidoCatracaLiteNet(e.target.value as string)
                  }
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-catraca-litenet-label">
                  Giro da Catraca
                </InputLabel>
                <Select
                  labelId="giro-catraca-litenet-label"
                  id="giro-catraca-litenet"
                  value={giroCatracaLiteNet}
                  label="Giro da Catraca"
                  onChange={(e) =>
                    setGiroCatracaLiteNet(e.target.value as string)
                  }
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {modeloCatraca === "Henry 7x" && (
            <>
              {/* Campo: IP da Catraca */}
              <TextField
                label="IP da Catraca"
                fullWidth
                value={ipHenry7x}
                onChange={(e) => setIpHenry7x(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Campo: Sentido da Catraca */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-henry7x-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-henry7x-label"
                  id="sentido-henry7x"
                  value={sentidoHenry7x}
                  label="Sentido da Catraca"
                  onChange={(e) => setSentidoHenry7x(e.target.value as string)}
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>

              {/* Campo: Giro da Catraca */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-henry7x-label">Giro da Catraca</InputLabel>
                <Select
                  labelId="giro-henry7x-label"
                  id="giro-henry7x"
                  value={giroHenry7x}
                  label="Giro da Catraca"
                  onChange={(e) => setGiroHenry7x(e.target.value as string)}
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Campo: Modo de Leitura */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="modo-leitura-henry7x-label">
                  Modo de Leitura
                </InputLabel>
                <Select
                  labelId="modo-leitura-henry7x-label"
                  id="modo-leitura-henry7x"
                  value={modoLeituraHenry7x}
                  label="Modo de Leitura"
                  onChange={(e) =>
                    setModoLeituraHenry7x(e.target.value as string)
                  }
                >
                  <MenuItem value="teclado-biometria">
                    Teclado e Biometria
                  </MenuItem>
                  <MenuItem value="teclado">Teclado</MenuItem>
                  <MenuItem value="biometria">Biometria</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {modeloCatraca === "Henry 8x" && (
            <>
              <TextField
                label="IP da Catraca"
                fullWidth
                value={ipHenry8x}
                onChange={(e) => setIpHenry8x(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-henry8x-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-henry8x-label"
                  id="sentido-henry8x"
                  value={sentidoHenry8x}
                  label="Sentido da Catraca"
                  onChange={(e) => setSentidoHenry8x(e.target.value as string)}
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-henry8x-label">Giro da Catraca</InputLabel>
                <Select
                  labelId="giro-henry8x-label"
                  id="giro-henry8x"
                  value={giroHenry8x}
                  label="Giro da Catraca"
                  onChange={(e) => setGiroHenry8x(e.target.value as string)}
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {modeloCatraca === "Serial Genérica" && (
            <>
              <TextField
                label="Nome do Equipamento"
                fullWidth
                value={nomeSerialGenerica}
                onChange={(e) => setNomeSerialGenerica(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Porta COM"
                fullWidth
                value={portaComSerialGenerica}
                onChange={(e) => setPortaComSerialGenerica(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-serial-generica-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-serial-generica-label"
                  id="sentido-serial-generica"
                  value={sentidoSerialGenerica}
                  label="Sentido da Catraca"
                  onChange={(e) =>
                    setSentidoSerialGenerica(e.target.value as string)
                  }
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-serial-generica-label">
                  Giro da Catraca
                </InputLabel>
                <Select
                  labelId="giro-serial-generica-label"
                  id="giro-serial-generica"
                  value={giroSerialGenerica}
                  label="Giro da Catraca"
                  onChange={(e) =>
                    setGiroSerialGenerica(e.target.value as string)
                  }
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rtsSerialGenerica}
                    onChange={(e) => setRtsSerialGenerica(e.target.checked)}
                  />
                }
                label="RTS"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dtrSerialGenerica}
                    onChange={(e) => setDtrSerialGenerica(e.target.checked)}
                  />
                }
                label="DTR"
                sx={{ mb: 2 }}
              />
            </>
          )}

          {modeloCatraca === "iD Block Enterprise" && (
            <>
              <TextField
                label="IP da Catraca"
                fullWidth
                value={ipIdBlockEnterprise}
                onChange={(e) => setIpIdBlockEnterprise(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-idblock-enterprise-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-idblock-enterprise-label"
                  id="sentido-idblock-enterprise"
                  value={sentidoIdBlockEnterprise}
                  label="Sentido da Catraca"
                  onChange={(e) =>
                    setSentidoIdBlockEnterprise(e.target.value as string)
                  }
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-idblock-enterprise-label">
                  Giro da Catraca
                </InputLabel>
                <Select
                  labelId="giro-idblock-enterprise-label"
                  id="giro-idblock-enterprise"
                  value={giroIdBlockEnterprise}
                  label="Giro da Catraca"
                  onChange={(e) =>
                    setGiroIdBlockEnterprise(e.target.value as string)
                  }
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {modeloCatraca === "iD Block Modo Pro" && (
            <>
              {/* Campos existentes (IP, Sentido, Giro) */}
              <TextField
                label="IP da Catraca"
                fullWidth
                value={ipIdBlockModoPro}
                onChange={(e) => setIpIdBlockModoPro(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-idblock-modopro-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-idblock-modopro-label"
                  id="sentido-idblock-modopro"
                  value={sentidoIdBlockModoPro}
                  label="Sentido da Catraca"
                  onChange={(e) =>
                    setSentidoIdBlockModoPro(e.target.value as string)
                  }
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-idblock-modopro-label">
                  Giro da Catraca
                </InputLabel>
                <Select
                  labelId="giro-idblock-modopro-label"
                  id="giro-idblock-modopro"
                  value={giroIdBlockModoPro}
                  label="Giro da Catraca"
                  onChange={(e) =>
                    setGiroIdBlockModoPro(e.target.value as string)
                  }
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Checkboxes para autenticação */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autenticacaoTecladoIdBlock}
                    onChange={(e) =>
                      setAutenticacaoTecladoIdBlock(e.target.checked)
                    }
                  />
                }
                label="Autenticação com Teclado"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autenticacaoBiometriaIdBlock}
                    onChange={(e) =>
                      setAutenticacaoBiometriaIdBlock(e.target.checked)
                    }
                  />
                }
                label="Autenticação com Biometria"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autenticacaoFacialIdBlock}
                    onChange={(e) =>
                      setAutenticacaoFacialIdBlock(e.target.checked)
                    }
                  />
                }
                label="Autenticação com Facial"
                sx={{ mb: 2 }}
              />
            </>
          )}
          {modeloCatraca === "Proveu Tupã" && (
            <>
              <TextField
                label="IP da Catraca"
                fullWidth
                value={ipProveuTupa}
                onChange={(e) => setIpProveuTupa(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-proveutupa-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-proveutupa-label"
                  id="sentido-proveutupa"
                  value={sentidoProveuTupa}
                  label="Sentido da Catraca"
                  onChange={(e) =>
                    setSentidoProveuTupa(e.target.value as string)
                  }
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-proveutupa-label">
                  Giro da Catraca
                </InputLabel>
                <Select
                  labelId="giro-proveutupa-label"
                  id="giro-proveutupa"
                  value={giroProveuTupa}
                  label="Giro da Catraca"
                  onChange={(e) => setGiroProveuTupa(e.target.value as string)}
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {modeloCatraca === "Tecnibra TCA IHM" && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tipo-comunicacao-tecnibra-label">
                  Tipo de Comunicação
                </InputLabel>
                <Select
                  labelId="tipo-comunicacao-tecnibra-label"
                  id="tipo-comunicacao-tecnibra"
                  value={tipoComunicacaoTecnibra}
                  label="Tipo de Comunicação"
                  onChange={(e) =>
                    setTipoComunicacaoTecnibra(e.target.value as string)
                  }
                >
                  <MenuItem value="tcpip">TCP/IP</MenuItem>
                  <MenuItem value="serial">Serial</MenuItem>
                </Select>
              </FormControl>

              {tipoComunicacaoTecnibra === "tcpip" && (
                <TextField
                  label="IP da Catraca"
                  fullWidth
                  value={ipTecnibra}
                  onChange={(e) => setIpTecnibra(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}

              {tipoComunicacaoTecnibra === "serial" && (
                <TextField
                  label="Porta COM"
                  fullWidth
                  value={portaComTecnibra}
                  onChange={(e) => setPortaComTecnibra(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sentido-tecnibra-label">
                  Sentido da Catraca
                </InputLabel>
                <Select
                  labelId="sentido-tecnibra-label"
                  id="sentido-tecnibra"
                  value={sentidoTecnibra}
                  label="Sentido da Catraca"
                  onChange={(e) => setSentidoTecnibra(e.target.value as string)}
                >
                  <MenuItem value="horario">Horário</MenuItem>
                  <MenuItem value="anti-horario">Anti-Horário</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="giro-tecnibra-label">
                  Giro da Catraca
                </InputLabel>
                <Select
                  labelId="giro-tecnibra-label"
                  id="giro-tecnibra"
                  value={giroTecnibra}
                  label="Giro da Catraca"
                  onChange={(e) => setGiroTecnibra(e.target.value as string)}
                >
                  <MenuItem value="entrada">Controla Entrada</MenuItem>
                  <MenuItem value="entrada-saida">
                    Controla Entrada e Saída
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={autenticacaoTecladoTecnibra}
                    onChange={(e) =>
                      setAutenticacaoTecladoTecnibra(e.target.checked)
                    }
                  />
                }
                label="Autenticação com Teclado"
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={autenticacaoBiometriaTecnibra}
                    onChange={(e) =>
                      setAutenticacaoBiometriaTecnibra(e.target.checked)
                    }
                  />
                }
                label="Autenticação com Biometria"
                sx={{ mb: 2 }}
              />
            </>
          )}

          {/* Botões de Ação */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setModalCatracaOpen(false)} // Fecha o modal sem criar
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCriarCatraca}>
              Criar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={modalLeitorBiometricoOpen}
        onClose={() => setModalLeitorBiometricoOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Criar Leitor Biométrico
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="tipo-leitor-biometrico-label">
              Tipo de Leitor Biométrico
            </InputLabel>
            <Select
              labelId="tipo-leitor-biometrico-label"
              id="tipo-leitor-biometrico"
              value={tipoLeitorBiometrico}
              label="Tipo de Leitor Biométrico"
              onChange={(e) =>
                setTipoLeitorBiometrico(e.target.value as string)
              }
            >
              <MenuItem value="Digital Persona V2">Digital Persona V2</MenuItem>
              <MenuItem value="Futronic">Futronic</MenuItem>
              <MenuItem value="Hamster DX">Hamster DX</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setModalLeitorBiometricoOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCriarLeitorBiometrico}>
              Criar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={modalLeitorBiometricoOpen}
        onClose={() => setModalLeitorBiometricoOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Criar Leitor Biométrico
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="tipo-leitor-biometrico-label">
              Tipo de Leitor Biométrico
            </InputLabel>
            <Select
              labelId="tipo-leitor-biometrico-label"
              id="tipo-leitor-biometrico"
              value={tipoLeitorBiometrico}
              label="Tipo de Leitor Biométrico"
              onChange={(e) =>
                setTipoLeitorBiometrico(e.target.value as string)
              }
            >
              <MenuItem value="Digital Persona V2">Digital Persona V2</MenuItem>
              <MenuItem value="Futronic">Futronic</MenuItem>
              <MenuItem value="Hamster DX">Hamster DX</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setModalLeitorBiometricoOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCriarLeitorBiometrico}>
              Criar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal de criação de reconhecimento facial */}
      <Modal
        open={modalReconhecimentoFacialOpen}
        onClose={() => setModalReconhecimentoFacialOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Criar Reconhecimento Facial
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="tipo-facial-label">Tipo de Facial</InputLabel>
            <Select
              labelId="tipo-facial-label"
              id="tipo-facial"
              value={tipoFacial}
              label="Tipo de Facial"
              onChange={(e) => setTipoFacial(e.target.value as string)}
            >
              <MenuItem value="Facial Next Fit">Facial Next Fit</MenuItem>
              <MenuItem value="iDFace">iDFace</MenuItem>
              <MenuItem value="Hikvision">Hikvision</MenuItem>
            </Select>
          </FormControl>

          {tipoFacial === "Hikvision" && (
            <>
              <TextField
                label="IP do Facial"
                fullWidth
                value={ipHikvision}
                onChange={(e) => setIpHikvision(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Porta HTTP"
                fullWidth
                value={portaHttpHikvision}
                onChange={(e) => setPortaHttpHikvision(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Porta do Servidor"
                fullWidth
                value={portaServidorHikvision}
                onChange={(e) => setPortaServidorHikvision(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Usuário"
                fullWidth
                type="string"
                value={usuarioHikvision}
                onChange={(e) => setUsuarioHikvision(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Senha"
                fullWidth
                type="string"
                value={senhaHikvision}
                onChange={(e) => setSenhaHikvision(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}

          {tipoFacial === "iDFace" && (
            <>
              <TextField
                label="IP do iDFace"
                fullWidth
                value={ipIDFace}
                onChange={(e) => setIpIDFace(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={criarCatracaDependente}
                    onChange={(e) =>
                      setCriarCatracaDependente(e.target.checked)
                    }
                  />
                }
                label="Criar catraca dependente"
                sx={{ mb: 2 }}
              />
            </>
          )}

          {tipoFacial === "Facial Next Fit" && (
            <>
              <TextField
                label="Nome da Câmera Principal"
                fullWidth
                value={nomeCameraPrincipal}
                onChange={(e) => setNomeCameraPrincipal(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setModalReconhecimentoFacialOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCriarFacial}>
              Criar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={modalImpressoraOpen}
        onClose={() => setModalImpressoraOpen(false)} // Fecha o modal ao clicar fora ou pressionar Esc
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Criar Impressora
          </Typography>

          <TextField
            label="Descrição da Impressora"
            fullWidth
            value={descricaoImpressora}
            onChange={(e) => setDescricaoImpressora(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={habilitarControleImpressao}
                onChange={(e) =>
                  setHabilitarControleImpressao(e.target.checked)
                }
              />
            }
            label="Habilitar Controle de Impressão"
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setModalImpressoraOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleCriarImpressora}>
              Criar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={modalObservacaoOpen}
        onClose={() => setModalObservacaoOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Adicionar Observação
          </Typography>

          {tipoObservacao === null ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() =>
                  handleSelecionarTipoObservacao("semPredefinicao")
                }
              >
                Observação sem predefinição
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSelecionarTipoObservacao("instalacao")}
              >
                Observação de instalação
              </Button>
            </Box>
          ) : (
            <>
              <TextField
                label="Observação"
                fullWidth
                multiline
                rows={4}
                value={observacaoTexto}
                onChange={(e) => setObservacaoTexto(e.target.value)} // Permite edição do texto
                sx={{ mb: 2 }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setTipoObservacao(null);
                    setObservacaoTexto("");
                  }}
                >
                  Voltar
                </Button>
                <Button variant="contained" onClick={handleCriarObservacao}>
                  Salvar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para exibir os acessos */}
      <Modal open={modalAcessosOpen} onClose={() => setModalAcessosOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, display: "flex", justifyContent: "center" }}
          >
            Últimos Acessos:
          </Typography>

          {acessos.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 400, overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Nome do Cliente</TableCell>
                    <TableCell>Data e Hora</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acessos.map((acesso, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Tooltip
                          title={
                            acesso.Status === "Liberado"
                              ? "Acesso liberado"
                              : "Acesso negado"
                          }
                        >
                          {acesso.Status === "Liberado" ? (
                            <CheckCircle sx={{ color: "green" }} />
                          ) : (
                            <Cancel sx={{ color: "red" }} />
                          )}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {renderModoReconhecimento(acesso.ModoReconhecimento)}
                      </TableCell>
                      <TableCell>{acesso.NomeCliente}</TableCell>
                      <TableCell>{acesso.DataHora}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">
              Nenhum acesso recente encontrado.
            </Typography>
          )}
        </Box>
      </Modal>

      <Footer />
    </Box>
  );
};

export default PageMenuDeAcesso;
