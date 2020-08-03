import FormData from "form-data";
import fetch from "node-fetch";
import { getActiveGitlabInsatnce, getGitlabInstance } from "./core";

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
export async function ListProjects() {
  let _inst = await getActiveGitlabInsatnce();
  _inst.get("/projects").then(
    (res) => {
      console.log(res);
    },
    (err) => {
      console.log(err);
    }
  );
}
