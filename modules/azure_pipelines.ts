import {
  JobCollectiveStatus,
  GitlabCIPrimaryData,
  AzureParams,
} from "../types/app-types";
import { AzureTimeLine } from "../types/azure-types";
import { getPipelineJobs } from "../api/jobs_gitlab";
import * as Gitlab from "../api/pipelines_gitlab";
import * as Azure from "../api/pipelines_azure";
import { baseJobStatuses } from "../utils/variables";

export async function GetBuilds(
  params: AzureParams
): Promise<GitlabCIPrimaryData> {
  let _builds = await Azure.listBuilds(params);
  const { value } = _builds;
  const { repository, _links, sourceBranch, status, startTime, id } = value[0];

  return {
    ref: sourceBranch,
    projName: repository.name,
    status: status === "completed" ? "success" : "failed",
    startingTime: startTime,
    pipelineID: id,
    isTag: false,
    projID: "N/A",
    external_link: _links.web.href,
  };
}

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

/** Processes a pipeline for success/failure/pending/running job counts */
export function CountJobStatuses(timeline: AzureTimeLine): JobCollectiveStatus {
  const { records } = timeline;

  /** This query gives us approximate started jobs */
  let A = records.filter((ele) => ele.type == "Phase");
  /** This query gives up approximate finished jobs */
  let B = records.filter((ele) => ele.name == "Finalize Job");

  return {
    ...baseJobStatuses,
    numSucceed: B.length,
    numFailed: A.length - B.length,
    numTotal: A.length,
  };
}
