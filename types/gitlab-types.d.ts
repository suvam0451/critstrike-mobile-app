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

export interface IPipeline {
  id: number;
  sha: string;
  ref: string;
  status: Status;
  created_at: string;
  updated_at: string;
  web_url: string;
  duration: number;
  finished_at: string;
  tag: boolean;
  user: {
    avatar_url: string;
    id: number;
    name: string;
    state: string;
    username: string;
    web_url: string;
  };
}

export interface IPipelinesHeader {
  link: {};
  "ratelimit-limit": number;
  "ratelimit-observed": number;
  "ratelimit-remaining": number;
  "x-page": number;
  "x-per-page": number;
  "x-prev-page": number;
  "x-request-id": number;
  "x-total": number;
  "x-total-pages": number;
}

/** Response of /projects/{id}/pipelines */
export interface IPipeline {
  id: number;
  sha: string;
  ref: string;
  status: Status;
  created_at: string;
  updated_at: string;
  web_url: string;
  duration: number;
  finished_at: string;
  tag: boolean;
  user: {
    avatar_url: string;
    id: number;
    name: string;
    state: string;
    username: string;
    web_url: string;
  };
}

/** Response of -- /projects/{id}/pipelines */
export interface RPipelines {
  status: number;
  data: IPipeline[];
  headers: IPipelinesHeader;
}

/** Response of -- /projects/{id}/pipelines/{id} */
export interface RPipeline {
  status: number;
  data: IPipeline;
  headers: IPipelinesHeader;
}

/** Response.data of projects/{id}/pipelines/jobs?per_page={20} */
export interface IPipelineJobsData {
  commit: {
    author_email: string;
    author_name: string;
    created_at: string;
    id: string;
    message: string;
    short_id: string;
    title: string;
  };
  coverage: null;
  allow_failure: boolean;
  created_at: string;
  started_at: string;
  finished_at: string;
  duration: 0.465;
  artifacts_file: {
    filename: string;
    size: number;
  };
  artifacts: {
    file_type: string;
    size: number;
    filename: string;
    file_format: string;
  }[];
  artifacts_expire_at: string;
  id: number;
  name: string;
  pipeline: {
    id: number;
    ref: string;
    sha: string;
    status: Status;
  };
  ref: string;
  runner: null;
  stage: string;
  status: Status;
  tag: boolean; // If running from a tag
  web_url: string;
  user: {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
    created_at: string;
    bio: string | null;
    location: string | null;
    public_email: string;
    skype: string;
    linkedin: string;
    twitter: string;
    website_url: string;
    organization: string;
  };
}

/** Response.headers of projects/{id}/pipelines/jobs?per_page={20} */
export interface IPipelineJobsHeader {
  "cache-control": "public, max-age=0";
  "cf-cache-status": "DYNAMIC";
  "cf-ray": string;
  "cf-request-id": string;
  date: string;
  etag: string;
  "expect-ct": string;
  "gitlab-lb": string;
  "gitlab-sv": string;
  link: '<https://gitlab.com/api/v4/projects/18627416/pipelines/161464373/jobs?id=18627416&page=2&per_page=20&pipeline_id=161464373>; rel="next", <https://gitlab.com/api/v4/projects/18627416/pipelines/161464373/jobs?id=18627416&page=1&per_page=20&pipeline_id=161464373>; rel="first", <https://gitlab.com/api/v4/projects/18627416/pipelines/161464373/jobs?id=18627416&page=2&per_page=20&pipeline_id=161464373>; rel="last"';
  "ratelimit-limit": number;
  "ratelimit-observed": number;
  "ratelimit-remaining": number;
  "ratelimit-reset": string;
  "ratelimit-resettime": string;
  "referrer-policy": string;
  server: "cloudflare";
  "strict-transport-security": "max-age=31536000";
  vary: "Accept-Encoding, Origin";
  "x-content-type-options": string;
  "x-frame-options": string;
  "x-next-page": number | null;
  "x-page": number;
  "x-per-page": number;
  "x-prev-page": number | null;
  "x-request-id": string;
  "x-runtime": number;
  "x-total": number;
  "x-total-pages": number;
}
