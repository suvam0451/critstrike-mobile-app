export type Status =
  | "created"
  | "pending"
  | "running"
  | "failed"
  | "canceled"
  | "success"
  | "unknown"
  | "skipped"
  | "manual";

export type GitlabCIPrimaryData = {
  status: Status;
  ref: string;
  pipelineID: number | undefined;
  startingTime: string;
  isTag: boolean | undefined;
  projName: string;
};
