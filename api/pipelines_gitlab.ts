import axios from "axios";
import { getGitlabInstance, Status } from "./core";

export interface IPipeline {
  id: number;
  sha: string;
  ref: string;
  status: Status;
  created_at: string;
  updated_at: string;
  web_url: string;
  duration: number;
  finished_at: string;
  tag: boolean;
  user: {
    avatar_url: string;
    id: number;
    name: string;
    state: string;
    username: string;
    web_url: string;
  };
}

export interface IPipelinesHeader {
  link: {};
  "ratelimit-limit": number;
  "ratelimit-observed": number;
  "ratelimit-remaining": number;
  "x-page": number;
  "x-per-page": number;
  "x-prev-page": number;
  "x-request-id": number;
  "x-total": number;
  "x-total-pages": number;
}

export interface IPipelinesResponse {
  status: number;
  data: IPipeline[];
  headers: IPipelinesHeader | undefined;
}

export interface IPipelineResponse {
  status: number;
  data: IPipeline;
  headers: IPipelinesHeader | undefined;
}

/**  */
export async function getProjectPipelines(
  token: string,
  id: number,
  debug: boolean = false
): Promise<IPipelinesResponse> {
  let req = axios.create({
    // url: `/projects/${id}/pipelines`,
    method: "get",
    baseURL: `https://gitlab.com/api/v4/`,
    timeout: 1000,
    headers: {
      "PRIVATE-TOKEN": token,
    },
  });
  return new Promise<IPipelinesResponse>((resolve, reject) => {
    req.get(`/projects/${id}/pipelines`).then(
      (res) => {
        debug ? console.log(res) : true;
        let _data: IPipeline[] = res.data;
        let _headers: IPipelinesHeader = res.headers;
        resolve({ status: res.status, data: _data, headers: _headers });
      },
      (err) => {
        console.log(err);
        resolve({ status: 404, data: err, headers: undefined });
      }
    );
  });
}

/** Gets information about a pipeline. */
export async function getPipeline(
  token: string,
  projID: string | number,
  pipelineID: number,
  debug: boolean = false
): Promise<IPipelineResponse> {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${pipelineID}`;

  return new Promise<IPipelineResponse>((resolve, reject) => {
    inst.get(inst.defaults.url!).then(
      (res) => {
        debug ? console.log(res) : true;
        let _data: IPipeline = res.data;
        let _headers: IPipelinesHeader = res.headers;
        resolve({ status: res.status, data: _data, headers: _headers });
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function putPipeline(
  token: string,
  projID: string | number,
  debug: boolean = false
) {
  let formData = new FormData();
  formData.append("token", token);
  formData.append("ref", "master");
  fetch(`https://gitlab.com/api/v4/projects/${projID}/trigger/pipeline`, {
    method: "POST",
    body: formData,
  }).then((res: any) => {
    debug ? console.log(res) : true;
    return res.json();
  });
}
