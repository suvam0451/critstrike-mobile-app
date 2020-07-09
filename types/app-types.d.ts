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
  duration?: string;
};

export type JobCollectiveStatus = {
  numSucceed: number;
  numFailed: number;
  numCanceled: number;
  numPending: number;
  numTotal: number;
};

export type IBuildCard =
  | {
      provider: "gitlab";
      uid: number;
      id: number;
      token: string;
      vars?: IVariable[];
    }
  | { provider: "azure"; uid: number; params: AzureParams; vars?: IVariable[] }
  | {
      provider: "github";
      uid: number;
      id: number;
      token: string;
      vars?: IVariable[];
    };

export type AzureParams = {
  organization: string;
  project: string;
  token: string;
};

export type IVariable = {
  label: string;
  value: string;
  currentValue?: string;
  IEnum?: string[];
};

/** Return type for artifacts */
export type IArtifact = {
  name: string;
  link: URL;
  size: string;
};
