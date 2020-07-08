import { Status } from "./gitlab-types";

export type GitlabCIPrimaryData = {
  status: Status;
  ref: string;
  pipelineID: number | undefined;
  startingTime: string;
  isTag: boolean | undefined;
  projName: string;
  projID: string | number;
  external_link: URL | null;
};

export type JobCollectiveStatus = {
  numSucceed: number;
  numFailed: number;
  numCanceled: number;
  numPending: number;
  numTotal: number;
};

export type IBuildCard =
  | { provider: "gitlab"; id: number; token: string }
  | { provider: "azure"; organization: string; project: string; token: string }
  | { provider: "github"; id: number; token: string };

/** Return type for artifacts */
export type IArtifact = {
  name: string;
  link: URL;
  size: string;
};
