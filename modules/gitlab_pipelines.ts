import { JobCollectiveStatus, GitlabCIPrimaryData } from "../types/app-types";
import { getPipelineJobs } from "../api/jobs_gitlab";
import * as Gitlab from "../api/pipelines_gitlab";

/** Returns the number of failed/succeeded/running/pending jobs for
 *  a given gitlab project and pipeline ID
 */
export async function GetPipelineJobs(
  token: string,
  project_id: number,
  pipeline_id: number
): Promise<JobCollectiveStatus> {
  let numSucceed = 0;
  let numFailed = 0;
  let numCancelled = 0;
  let numPending = 0;

  try {
    let _jobs = await getPipelineJobs(token, project_id, pipeline_id);

    let total = _jobs.length;

    return new Promise<JobCollectiveStatus>((resolve, reject) => {
      _jobs.forEach((job) => {
        switch (job.status) {
          case "failed":
            numFailed++;
            break;
          case "success":
            numSucceed++;
            break;
          case "pending":
            numPending++;
            break;
          case "canceled":
            numCancelled++;
            break;
          default: {
            break;
          }
        }
      });
      resolve({
        numSucceed: numSucceed,
        numFailed: numFailed,
        numCanceled: numCancelled,
        numPending: numPending,
        numTotal: total,
      });
    });
  } catch (e) {
    return new Promise<JobCollectiveStatus>((resolve, reject) => {
      reject("Unknown");
    });
  }
}

/** Get information about a single pipeline queried by ID */
export async function GetPipelineInfo(
  token: string,
  project_id: number,
  pipeline_id: number
): Promise<GitlabCIPrimaryData> {
  // Default return values
  let _projName = "unknown !!!";

  let _pipeline = await Gitlab.getPipeline(token, project_id, pipeline_id);
  const { id, ref, status, created_at, tag, duration, web_url } = _pipeline;

  // Extract project name from url
  let ex = /.+\/(.+)\/\-(.*?)/;
  if (ex.test(web_url)) {
    _projName = web_url.match(ex)![1];
  }

  return {
    status: status,
    ref: ref,
    pipelineID: pipeline_id,
    startingTime: created_at,
    isTag: tag,
    projName: _projName,
    projID: project_id,
    external_link: new URL(web_url),
    duration: duration ? duration.toString() : "unknown",
  };
}
