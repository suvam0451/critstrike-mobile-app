import {
  PipelineCardButtonExtensions,
  GitlabCIPrimaryData,
  JobCollectiveStatus,
} from "../types/app-types";

export const dummyPipelineCardButtonExtensions = {
  refresh: false,
  log: false,
  history: false,
  artifacts: false,
  external: false,
};

/** Default values to show in a pipeline card.
 *  We override the fields we obtained
 */
export const basePipelineCardPrimaryData: GitlabCIPrimaryData = {
  status: "unknown",
  ref: "loading...",
  pipelineID: undefined,
  startingTime: "loading...",
  isTag: undefined,
  projName: "loading...",
  projID: "loading...",
  external_link: null,
};

export const baseJobStatuses: JobCollectiveStatus = {
  numSucceed: 0,
  numFailed: 0,
  numCanceled: 0,
  numPending: 0,
  numTotal: 0,
};
