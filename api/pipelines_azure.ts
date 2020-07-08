import axios, { AxiosInstance } from "axios";
import {
  getGitlabInstance,
  Status,
  getAzureInstance,
  axiosGetRequest,
  axiosPutRequest,
  axiosPatchRequest,
  axiosPostRequest,
} from "./core";
import {
  IPipeline,
  IPipelinesHeader,
  RPipelines,
  RPipeline,
} from "../types/gitlab-types";
import { registerAnimation } from "react-native-animatable";
import { URISource } from "@react-native-community/hooks/lib/useImageDimensions";
import { resolvePlugin } from "@babel/core";
import {
  AzureListArtifacts,
  AzureBuildList,
  AzureTimeLine,
} from "../types/azure-types";
import { IArtifact } from "../types/app-types";
import { filter } from "lodash";

// suvam0451/ReEncoding
// https://dev.azure.com/suvam0451/_apis/distributedtask/pools/{poolId}/agents?api-version=5.1

/** Lists all builds for a project
 * @returns Builds Array of builds
 */
export async function listBuilds(
  token: string,
  organization: string,
  project: string,
  debug: boolean = false
): Promise<AzureBuildList> {
  return new Promise<AzureBuildList>((resolve, reject) => {
    getAzureInstance(token)
      .get<AzureBuildList>(
        `${organization}/${project}/_apis/build/builds?api-version=5.1`
      )
      .then(
        (res) => {
          debug ? console.log(res) : true;
          resolve(res.data);
        },
        (err) => {
          reject("NOT FOUND");
        }
      );
  });
  // Project JSON GET API
  //   https://dev.azure.com/suvam0451/_apis/projects/e4150cd1-1fdf-4db9-ad7c-3eff11d6ad17
}

/** List all artifacts
 *
 * https://dev.azure.com/{organization}/{project}/_apis/build/builds/{buildId}/artifacts?api-version=5.1
 */
export async function listArtifacts(
  token: string,
  organization: string,
  project: string,
  buildId: string | number,
  debug: boolean = false
): Promise<AzureListArtifacts> {
  return new Promise<AzureListArtifacts>((resolve, reject) => {
    axiosGetRequest<AzureListArtifacts>(
      getAzureInstance(token, "get"),
      `${organization}/${project}/_apis/build/builds/${buildId}/artifacts?api-version=5.1`,
      debug
    ).then((res) => {
      resolve(res);
    });
  });
}

export async function getDefinitions(params: AzureParams) {
  const { token, organization, project } = params;
  axiosGetRequest<any>(
    getAzureInstance(token, "get"),
    `${organization}/${project}/_apis/build/definitions?api-version=5.1`
  ).then((res) => {
    console.log(res.value[0]);
  });
}

export async function getBuildProperties(params: AzureParams, buildId: number) {
  const { token, organization, project } = params;
  axiosGetRequest<any>(
    getAzureInstance(token, "get"),
    `${organization}/${project}/_apis/build/builds/${buildId}/properties?api-version=5.1`
  ).then((res) => {
    console.log(res);
  });
}

/** Get the timeline for a build */
export async function getTimeline(
  params: AzureParams,
  buildId: number
): Promise<AzureTimeLine> {
  const { token, organization, project } = params;

  return new Promise<AzureTimeLine>((resolve, reject) => {
    axiosGetRequest<AzureTimeLine>(
      getAzureInstance(token, "get"),
      `${organization}/${project}/_apis/build/builds/${buildId}/timeline?api-version=5.1`
    ).then((res) => {
      resolve(res);
    });
  });
}

type AzureParams = {
  token: string;
  organization: string;
  project: string;
};

/** Gets the list of artifacts */
export async function getArtifactLinks(
  token: string,
  organization: string,
  project: string,
  buildId: string | number
): Promise<IArtifact[]> {
  return new Promise<IArtifact[]>((resolve, reject) => {
    listArtifacts(token, organization, project, buildId).then((res) => {
      console.log(res);
      resolve(
        res.value.map(
          (ele): IArtifact => {
            return {
              name: ele.name,
              link: ele.resource.downloadUrl,
              size: ele.resource.properties.artifactsize,
            };
          }
        )
      );
    });
  });
}

/** Restarts a pipeline, referenced by a certain "definition.id"
 *  @param  definitionId Build[0].definition.id
 */
export async function restartPipeline(
  p: AzureParams,
  definitionId: string | number,
  parameters?: Object | undefined
) {
  const { token, organization, project } = p;
  axiosPostRequest(
    getAzureInstance(token, "POST", 5000),
    `${organization}/${project}/_apis/build/builds?api-version=5.1`,
    parameters
      ? {
          parameters: parameters,
          definition: {
            id: definitionId,
          },
        }
      : {
          definition: {
            id: definitionId,
          },
        }
  ).then(
    (res) => console.log(res),
    (err) => console.log(err)
  );
}

restartPipeline(
  {
    token: "c4cipj4hasom3wrhrlkujsqo7ixtqslocrg72rs55mwwnicnb37q",
    organization: "suvam0451",
    project: "ReEncoding",
  },
  7
);
