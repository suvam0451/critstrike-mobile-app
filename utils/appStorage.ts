import AsyncStorage from "@react-native-community/async-storage";
import { IBuildCard } from "../types/app-types";

let { getItem, setItem } = AsyncStorage;
/** ---------------------------------------------
 *  Key definitions
 *
 *  Use this file to manage all keys set by AsyncStorage !!
 *  These are the keys used throughout the app.
 * --------------------------------------------- */

// Current access token (to use for projects etc.)
const GITLAB_ACTIVE_TOKEN = "GITLAB_ACTIVE_TOKEN";

// A list of all past tokens, to switch with above)
const GITLAB_SAVED_TOKENS = "GITLAB_SAVED_TOKENS";

// A list of pipeline cards to display on pipelines view page
const PIPELINE_CARDS = "buildCards";

/** */
export async function GetPrimaryGitlabToken(): Promise<IGitlabStoredToken> {
  const token: string | null = await getItem(GITLAB_ACTIVE_TOKEN);
  if (token === null) {
    return new Promise<IGitlabStoredToken>((resolve, reject) => {
      reject(Error(`${GITLAB_ACTIVE_TOKEN} not found in AsyncStorage`));
    });
  } else {
    return new Promise<IGitlabStoredToken>((resolve, reject) => {
      resolve(JSON.parse(token));
    });
  }
}

type IGitlabStoredToken = {
  user_id: number;
  token: string;
};
export async function SetPrimaryGitlabToken(data: IGitlabStoredToken) {
  setItem(GITLAB_ACTIVE_TOKEN, JSON.stringify(data));
}

/** --------------------------------------------- */

export async function GetGitlabSavedTokens(): Promise<string[]> {
  const value = await getItem(GITLAB_SAVED_TOKENS);
  if (value === null) {
    return new Promise<string[]>((resolve, reject) => {
      reject(Error(`${GITLAB_SAVED_TOKENS} not found in AsyncStorage`));
    });
  } else {
    return new Promise<string[]>((resolve, reject) => {
      let tokens: string[] = JSON.parse(value);
      resolve(tokens);
    });
  }
}

export async function SetGitlabSavedTokens(tokens: string) {
  setItem(GITLAB_SAVED_TOKENS, tokens);
}

/** ------------------------------------------------------ */
export async function GetBuildCards(): Promise<IBuildCard[]> {
  const value = await getItem(PIPELINE_CARDS);

  return new Promise<IBuildCard[]>((resolve, reject) => {
    if (value !== null) {
      resolve(JSON.parse(value));
    } else {
      reject(Error(`${PIPELINE_CARDS} not found in AsyncStorage`));
    }
  });
}

export async function SetBuildCards(data: IBuildCard[]) {
  setItem(PIPELINE_CARDS, JSON.stringify(data));
}
