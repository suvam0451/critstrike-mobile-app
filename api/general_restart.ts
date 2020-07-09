import * as Azure from "./pipelines_azure";
import * as Gitlab from "./pipelines_gitlab";
import { Alert } from "react-native";
import { IBuildCard } from "../types/app-types";
import AzureParamResolve from "./paramgenerator";

export default function RestartPipeline(
  data: IBuildCard,
  projID: number | string
): void {
  Alert.alert(
    "New Pipeline",
    "This will POST a copy of the referenced pipeline. Are you sure ?",
    [
      {
        text: "Continue",
        onPress: () => {
          switch (data.provider) {
            case "gitlab": {
              const { token, vars } = data;
              Gitlab.restartPipeline(token, projID);
              break;
            }
            case "azure": {
              console.log("Yeet");
              const { vars } = data;
              const { organization, token, project } = data.params;
              Azure.restartPipeline(
                {
                  token: token,
                  organization: organization,
                  project: project,
                },
                7,
                vars ? AzureParamResolve(vars) : undefined,
                true
              ).then(
                (res) => console.log(res),
                (err) => console.log(err)
              );
              break;
            }
            case "github": {
              let { token } = data;
              break;
            }
          }
        },
      },
      {
        text: "Abort",
      },
    ]
  );
}
