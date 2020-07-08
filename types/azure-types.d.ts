export interface AzureListArtifacts {
  count: number;
  value: [
    {
      id: number;
      name: string;
      source: string; // Not download
      resource: {
        type: "PipelineArtifact"; // PipelineArtifact
        data: string;
        properties: {
          RootId: string;
          artifactsize: string; // Important
        };
        url: URL; // API URL
        downloadUrl: URL; // download URL
      };
    }
  ];
}

export type AzureTimeLine = {
  records: [
    {
      previousAttempts: [];
      id: string;
      parentId: string;
      type: string; // Record type , "Job" --> "Phase"
      name: string; // name of pipeline
      startTime: string;
      finishTime: string;
      state: string; // Important
      result: string; // Important
      changeId: number; // This is the buildId
      log: {
        id: number;
        type: string; // "Container"
        url: URL; // To logs
      };
      identifier: string;
    }
  ];
  url: URL;
  id: string;
  chageId: number;
  lastChangedBy: string;
  lastChangedOn: string;
};

export type AzureBuildList = {
  count: number;
  value: [
    {
      _links: {
        self: {
          href: URL;
        };
        web: {
          href: URL;
        };
        sourceVersionDisplayUri: {
          href: URL;
        };
        timeline: {
          href: URL;
        };
        badge: {
          href: URL;
        };
      };
      properties: {};
      tags: [];
      id: number;
      buildNumber: string;
      status: "completed";
      result: "succeded" | "completed";
      queueTime: string;
      startTime: string;
      finishTime: string;
      sourceBranch: string;
      url: URL; // To build
      definition: {
        id: number; // Different from id above
        name: string; // Project name
        url: URL;
        uri: string;
        project: {
          id: string;
          name: string;
          url: URL;
          state: string;
          revision: number;
          visibility: "public" | "private";
          lastUpdateTime: string;
        };
      };
      project: {
        id: string;
        name: string;
        url: URL;
        state: string;
        revision: number;
        visibility: "public" | "private";
        lastUpdatedTime: string;
      };
      sourceBranch: string;
      requestedFor: {
        displayName: string;
        url: URL; // https://dev.azure.com/suvam0451/_apis/projects/e4150cd1-1fdf-4db9-ad7c-3eff11d6ad17
        _links: {};
        id: string;
        uniqueName: string | null;
        imageUrl: string | null;
        descriptor: string;
      };
      logs: {
        id: number;
        type: "string"; // Container
        url: URL;
      };
      repository: {
        id: string; // Project id
        type: string;
        name: string;
        url: URL;
        checkoutSubmodules: boolean;
      };
      keepForever: boolean;
      retainedByRelease: boolean;
      triggeredByBuild: null;
    }
  ];
};
