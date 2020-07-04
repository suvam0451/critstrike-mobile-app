import React from "react";

export interface IAuthContext {
  signIn: any | null;
  signOut: any | null;
  signUp: any | null;
  addAPIKey: any | null;
  getAPIKey: any | null;
}
export const AuthContext = React.createContext<IAuthContext>({
  signIn: null,
  signOut: null,
  signUp: null,
  addAPIKey: null,
  getAPIKey: null,
});
