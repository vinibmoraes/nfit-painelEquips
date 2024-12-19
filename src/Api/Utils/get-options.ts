import { LocalStorageHelper } from "../../shared/helpers/local-storage-helper";
import { keyRefreshToken } from "../../shared/keys/local-storage-keys";
import { EVerboHttp } from "../Enums/EVerboHttp";

type RequestOptions = {
  method: string;
  headers: Record<string, string>;
  body?: string;
};

const getOptions = (verbo: EVerboHttp, body?: unknown, refreshToken?: string): RequestOptions => {
  if (!refreshToken) {
    refreshToken =
      LocalStorageHelper.getItem<string>(keyRefreshToken) ??
      (() => {
        throw new Error("Refresh token não encontrado");
      })();
  }

  const options: RequestOptions = {
    method: verbo,
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

export { getOptions };
