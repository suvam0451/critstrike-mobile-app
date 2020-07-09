import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { Buffer } from "buffer";

export type Status =
  | "created"
  | "pending"
  | "running"
  | "failed"
  | "canceled"
  | "success"
  | "unknown"
  | "skipped"
  | "manual";

// AxiosRequestConfig.method
export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK"
  | undefined;

/** Creates and returnes an axios object --> https://gitlab.com/api/v4/  */
export function getGitlabInstance(
  token: string,
  method: Method = "get"
): AxiosInstance {
  return axios.create({
    method: method,
    baseURL: `https://gitlab.com/api/v4/`,
    timeout: 1000,
    headers: {
      "PRIVATE-TOKEN": token,
    },
  });
}

/** Creates and returnes an axios object. */
export function getAzureInstance(
  token: string,
  method: Method = "get",
  timeOut = 1000
) {
  // const username = "suvam0451",
  // password = token;
  // let _token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");
  const _token = Buffer.from(`:${token}`, "utf8").toString("base64");
  return axios.create({
    method: method,
    baseURL: `https://dev.azure.com/`,
    timeout: timeOut,
    headers: {
      Authorization: `Basic ${_token}`,
    },
  });
}

/** Generic typed get requests, returning data */
export async function axiosGetRequest<T>(
  inst: AxiosInstance,
  query: string,
  debug: boolean = false
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    inst.get<T>(query).then((res) => {
      debug ? console.log(res) : true;
      resolve(res.data);
    });
  });
}

/** Generic typed get requests, returning data */
export async function axiosPutRequest<T>(
  inst: AxiosInstance,
  query: string,
  debug: boolean = false
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    inst.put<T>(query).then((res) => {
      debug ? console.log(res) : true;
      resolve(res.data);
    });
  });
}

/** Generic typed get requests, returning data */
export async function axiosPatchRequest<T>(
  inst: AxiosInstance,
  query: string,
  debug: boolean = false
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    inst.patch<T>(query).then((res) => {
      debug ? console.log(res) : true;
      resolve(res.data);
    });
  });
}

/** Generic typed get requests, returning data */
export async function axiosPostRequest<T>(
  inst: AxiosInstance,
  query: string,
  body: Object,
  debug: boolean = false
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    inst.post<T>(query, body).then(
      (res) => {
        debug ? console.log(res) : true;
        resolve(res.data);
      },
      (err) => console.log(err)
    );
  });
}
