import FormData from "form-data";
import fetch from "node-fetch";

let GITLAB_SECRET = "9d49e7571551ed40058b3dcfec135c";

export function StartCI() {
  console.log("So it begins...");

  let formData = new FormData();
  formData.append("token", GITLAB_SECRET);
  formData.append("ref", "master");
  fetch("https://gitlab.com/api/v4/projects/18627416/trigger/pipeline", {
    method: "POST",
    body: formData,
  }).then((res: any) => {
    return res.json();
  });
}
