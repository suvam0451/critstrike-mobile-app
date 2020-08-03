import AsyncStorage from "@react-native-community/async-storage";

/** --------------------------------------------- */

export async function GetPrimaryGitlabToken(): Promise<string> {
  const token: string | null = await AsyncStorage.getItem(
    "GITLAB_ACTIVE_TOKEN"
  );
  if (token === null) {
    return new Promise<string>((resolve, reject) => {
      reject(Error("GITLAB_ACTIVE_TOKEN not found in AsyncStorage"));
    });
  } else {
    return new Promise<string>((resolve, reject) => {
      resolve(token);
    });
  }
}

export async function SetPrimaryGitlabToken(token: string) {
  AsyncStorage.setItem("GITLAB_ACTIVE_TOKEN", token);
}

/** --------------------------------------------- */

export async function GetGitlabSavedTokens(): Promise<string[]> {
  const value: string | null = await AsyncStorage.getItem(
    "GITLAB_SAVED_TOKENS"
  );
  if (value === null) {
    return new Promise<string[]>((resolve, reject) => {
      reject(Error("GITLAB_SAVED_TOKENS not found in AsyncStorage"));
    });
  } else {
    return new Promise<string[]>((resolve, reject) => {
      let tokens: string[] = JSON.parse(value);
      resolve(tokens);
    });
  }
}

export async function SetGitlabSavedTokens(tokens: string) {
  AsyncStorage.setItem("GITLAB_SAVED_TOKENS", tokens);
}
