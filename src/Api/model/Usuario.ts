export interface Usuario {
  Id: number;
  Nome: string;
  Email: string;
  DddFone: string;
  Fone: string;
  TipoPerfil: number;
  AcessoBloqueado: boolean;
  Inativo: boolean;
  TelefoneCompleto: string;
  TipoCadastro: number;
  TipoConselho: number;
  CodigoUnidadePreferencial: string;
  Unidades: {
    CodigoUnidade: string;
    CodigoPerfilAcesso: string;
  }[];
  Usuario: string;
}
