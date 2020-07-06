import { Status } from "./gitlab-types";

export type GitlabCIPrimaryData = {
  status: Status;
  ref: string;
  pipelineID: number | undefined;
  startingTime: string;
  isTag: boolean | undefined;
  projName: string;
};

export type JobCollectiveStatus = {
  numSucceed: number;
  numFailed: number;
  numCanceled: number;
  numPending: number;
  numTotal: number;
};

export interface IBuildCard {
  provider: "gitlab" | "azure" | "github";
  id: number;
}
