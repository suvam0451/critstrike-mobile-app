import axios from "axios";
import { getGitlabInstance, Status } from "./core";
import { pipeline } from "form-data";

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

interface IPipelineJob {
  commit: {
    author_email: string;
    author_name: string;
    created_at: string;
    id: string;
    message: string;
    short_id: string;
    title: string;
  };
  coverage: null;
  allow_failure: boolean;
  created_at: string;
  started_at: string;
  finished_at: string;
  duration: 0.465;
  artifacts_file: {
    filename: string;
    size: number;
  };
  artifacts: {
    file_type: string;
    size: number;
    filename: string;
    file_format: string;
  }[];
  artifacts_expire_at: string;
  id: number;
  name: string;
  pipeline: {
    id: number;
    ref: string;
    sha: string;
    status: Status;
  };
  ref: string;
  runner: null;
  stage: string;
  status: Status;
  tag: boolean; // If running from a tag
  web_url: string;
  user: {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
    created_at: string;
    bio: string | null;
    location: string | null;
    public_email: string;
    skype: string;
    linkedin: string;
    twitter: string;
    website_url: string;
    organization: string;
  };
}

// curl --header "https://gitlab.example.com/api/v4/projects/1/pipelines/6/jobs?scope[]=pending&scope[]=running"

/**  */
export async function getJob(
  token: string,
  projID: string | number,
  jobID: number
) {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${jobID}`;

  inst.get(inst.defaults.url).then((res) => {
    let _data: IPipelineJob = res.data;
    console.log(res);
    return res;
  });
}

/**  */
export async function getPipelines(
  token: string,
  projID: string | number,
  jobID: number
) {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines}`;

  inst.get(inst.defaults.url).then((res) => {
    let _data: IPipelineJob = res.data;
    console.log(res);
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

interface IPipelineJobsHeader {
  "cache-control": "public, max-age=0";
  "cf-cache-status": "DYNAMIC";
  "cf-ray": string;
  "cf-request-id": string;
  date: string;
  etag: string;
  "expect-ct": string;
  "gitlab-lb": string;
  "gitlab-sv": string;
  link: '<https://gitlab.com/api/v4/projects/18627416/pipelines/161464373/jobs?id=18627416&page=2&per_page=20&pipeline_id=161464373>; rel="next", <https://gitlab.com/api/v4/projects/18627416/pipelines/161464373/jobs?id=18627416&page=1&per_page=20&pipeline_id=161464373>; rel="first", <https://gitlab.com/api/v4/projects/18627416/pipelines/161464373/jobs?id=18627416&page=2&per_page=20&pipeline_id=161464373>; rel="last"';
  "ratelimit-limit": number;
  "ratelimit-observed": number;
  "ratelimit-remaining": number;
  "ratelimit-reset": string;
  "ratelimit-resettime": string;
  "referrer-policy": string;
  server: "cloudflare";
  "strict-transport-security": "max-age=31536000";
  vary: "Accept-Encoding, Origin";
  "x-content-type-options": string;
  "x-frame-options": string;
  "x-next-page": number | null;
  "x-page": number;
  "x-per-page": number;
  "x-prev-page": number | null;
  "x-request-id": string;
  "x-runtime": number;
  "x-total": number;
  "x-total-pages": number;
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
): Promise<IPipelineJob[]> {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${pipelineID}/jobs?&per_page=20`;
  let retval: IPipelineJob[] = [];
  return new Promise<IPipelineJob[]>((resolve, reject) => {
    inst.get(inst.defaults.url!).then(
      (res) => {
        debug ? console.log(res) : true;
        let _headers: IPipelineJobsHeader = res.headers;
        let totalPages = _headers["x-total-pages"]; // The function handles the offset
        retval = retval.concat(res.data as IPipelineJob[]);

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
): Promise<IPipelineJob[]> {
  let retval: IPipelineJob[] = [];
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${projID}/pipelines/${pipelineID}/jobs?&per_page=20`;

  let baseCounter = 2;
  do {
    let res = await inst.get(
      `/projects/${projID}/pipelines/${pipelineID}/jobs?page=${baseCounter}&per_page=20`
    );
    debug ? console.log(res) : true;
    retval = retval.concat(res.data as IPipelineJob[]);
  } while (baseCounter++ < totalPages);
  return new Promise<IPipelineJob[]>((resolve, reject) => {
    resolve(retval);
  });
}
