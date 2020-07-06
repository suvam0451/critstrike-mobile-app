import axios from "axios";
import { getGitlabInstance, Status } from "./core";
import {
  IPipeline,
  IPipelinesHeader,
  RPipelines,
  RPipeline,
} from "../types/gitlab-types";

/**  */
export async function getProjectPipelines(
  token: string,
  id: number,
  debug: boolean = false
): Promise<RPipelines> {
  let req = axios.create({
    method: "get",
    baseURL: `https://gitlab.com/api/v4/`,
    timeout: 1000,
    headers: {
      "PRIVATE-TOKEN": token,
    },
  });
  return new Promise<RPipelines>((resolve, reject) => {
    req.get<IPipeline[], RPipelines>(`/projects/${id}/pipelines`).then(
      (res) => {
        debug ? console.log(res) : true;
        resolve(res);
      },
      (err) => {
        reject(err);
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
): Promise<IPipeline> {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${pipelineID}`;

  return new Promise<IPipeline>((resolve, reject) => {
    inst.get<IPipeline, RPipeline>(inst.defaults.url!).then(
      (res) => {
        debug ? console.log(res) : true;
        resolve(res.data);
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
