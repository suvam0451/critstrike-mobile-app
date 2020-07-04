import axios from "axios";
import { getGitlabInstance } from "./core";

interface IGitlabProject {
  id: number;
  description: string;
  visibility: "public" | "private" | "protected";
  jobs_enabled: boolean;
}

async function getUserProjects(userid: string) {
  let inst = getGitlabInstance("-CUasfvMePjsZzEgBHw-");
  inst.defaults.url = `/users/${userid}/projects/`;
}

async function getProject(token: string, userid: string) {
  let inst = getGitlabInstance(token);
  inst.defaults.url = `/projects/${userid}/`;
}
