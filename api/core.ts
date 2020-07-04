import axios from "axios";

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

/** Creates and returnes an axios object. */
export function getGitlabInstance(token: string, method: string = "get") {
  return axios.create({
    method: "get",
    baseURL: `https://gitlab.com/api/v4/`,
    timeout: 1000,
    headers: {
      "PRIVATE-TOKEN": token,
    },
  });
}
