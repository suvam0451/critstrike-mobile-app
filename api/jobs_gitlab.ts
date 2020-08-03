import axios from "axios";
import { getGitlabInstance, Status } from "./core";
import { pipeline } from "form-data";
import { IPipelineJobsData, IPipelineJobsHeader } from "../types/gitlab-types";

/**  */
export async function getJob(
  token: string,
  projID: string | number,
  jobID: number,
  debug?: boolean
) {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${jobID}`;

  inst.get(inst.defaults.url).then((res) => {
    let _data: IPipelineJobsData = res.data;
    debug ? console.log(_data) : true;
    return res;
  });
}

/**  */
export async function getPipelines(
  token: string,
  projID: string | number,
  jobID: number,
  debug?: boolean
) {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines}`;

  inst.get(inst.defaults.url).then((res) => {
    let _data: IPipelineJobsData = res.data;
    debug ? console.log(_data) : true;
    return res;
  });
}

/** When we list jobs via pipeline ID */
interface IJobsFromPipeline {
  created_at: string;
  id: number;
  ref: string;
  sha: string;
  status: Status;
  updated_at: string;
  web_url: string; // This is the pipeline URL, not job URL
}

/** List of all the jobs in a pipeline.
 *
 * NOTE: Uses keyset pagination and fetches 20 links be default.
 */
export async function getPipelineJobs(
  token: string,
  projID: string | number,
  pipelineID: number,
  debug: boolean = false
): Promise<IPipelineJobsData[]> {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${pipelineID}/jobs?&per_page=20`;
  let retval: IPipelineJobsData[] = [];
  return new Promise<IPipelineJobsData[]>((resolve, reject) => {
    inst.get(inst.defaults.url!).then(
      (res) => {
        debug ? console.log(res) : true;
        let _headers: IPipelineJobsHeader = res.headers;
        let totalPages = _headers["x-total-pages"]; // The function handles the offset
        retval = retval.concat(res.data as IPipelineJobsData[]);

        // Fetch the remaining pages, if any...
        allPipelineJobs(token, projID, pipelineID, totalPages).then((res2) => {
          retval = retval.concat(res2);
          resolve(retval);
        });
      },
      (err) => {
        reject(err);
      }
    );
  });
}

async function allPipelineJobs(
  token: string,
  projID: string | number,
  pipelineID: number,
  totalPages: number,
  debug: boolean = false
): Promise<IPipelineJobsData[]> {
  let retval: IPipelineJobsData[] = [];
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${pipelineID}/jobs?&per_page=20`;

  let baseCounter = 2;
  do {
    let res = await inst.get(
      `/projects/${projID}/pipelines/${pipelineID}/jobs?page=${baseCounter}&per_page=20`
    );
    debug ? console.log(res) : true;
    retval = retval.concat(res.data as IPipelineJobsData[]);
  } while (baseCounter++ < totalPages);
  return new Promise<IPipelineJobsData[]>((resolve, reject) => {
    resolve(retval);
  });
}
