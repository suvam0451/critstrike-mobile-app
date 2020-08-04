import FormData from "form-data";
import fetch from "node-fetch";
import { getActiveGitlabInstance, getGitlabInstance } from "./core";
import { GetPrimaryGitlabToken } from "../utils/appStorage";
import { identity } from "lodash";

let GITLAB_SECRET = "9d49e7571551ed40058b3dcfec135c";

export function StartCI(token: string, projID: number) {
  let formData = new FormData();
  formData.append("token", token);
  formData.append("ref", "master");
  fetch(`https://gitlab.com/api/v4/projects/${projID}/trigger/pipeline`, {
    method: "POST",
    body: formData,
  }).then((res: any) => {
    return res.json();
  });
}

/** Lists a user's projects  */
export async function ListProjects(): Promise<IGitlabProject[]> {
  let { token, user_id } = await GetPrimaryGitlabToken();
  let _inst = getGitlabInstance(token);

  return new Promise<IGitlabProject[]>((resolve, reject) => {
    _inst.get(`/users/${user_id}/projects`).then(
      (res) => {
        const { data, headers } = res;
        resolve(data);
      },
      (err) => {}
    );
  });
}

/** Result of qiery /projects */
export type IGitlabProject = {
  id: number; // Use this id to query
  namespace: {
    avatar_url: string;
    id: number; // This is the namespace id
    name: string;
    web_url: string;
    kind: string; // "user"/ "group"
  };
  owner: {
    avatar_url: string;
    id: number; // User ID
    state: string;
    username: string;
    web_url: string;
  };
  path: string; // zy-sz -- use to display
  path_with_namespace: string; // abc/zy-sx
};
