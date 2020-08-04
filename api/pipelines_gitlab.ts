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

// curl --request POST --header "PRIVATE-TOKEN: <your_access_token>" "https://gitlab.example.com/api/v4/projects/1/pipeline?ref=master"

/** Restarts a pipeline
 * e.g.- { ref: "master", variables: [{ 'key' => 'UPLOAD_TO_S3', 'B' => 'true' }] }
 */
export async function restartPipeline(
  token: string,
  projId: number | string,
  data: Object = { ref: "master" },
  debug?: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    getGitlabInstance(token, "POST")
      .post(`projects/${projId}/pipeline`, data)
      .then(
        (res) => (debug ? console.log(res) : true),
        (err) => (debug ? console.log(err) : true)
      );
  });
}

restartPipeline("-CUasfvMePjsZzEgBHw-", 19639484);

export async function getPipelineVariables(
  token: string,
  pipelineID: number,
  projID: number
): Promise<void> {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${pipelineID}/variables`;

  return new Promise<void>((resolve, reject) => {});
}
// https://gitlab.example.com/api/v4/projects/1/pipelines/46/variables

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
