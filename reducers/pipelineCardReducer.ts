import { IBuildCard } from "../types/app-types";
import { GetBuildCards, SetBuildCards } from "../utils/appStorage";

export type IPipelineCardAction =
  | { type: "append"; data: IBuildCard }
  | { type: "clear" }
  | { type: "extend" }
  | { type: "retrieve" }
  | { type: "set"; newData: IBuildCard[] };

export type IPipelineCardState = IBuildCard[];

/** retrieve query may not work properly. Please check... */
export function pipelineCardReducer(
  state: IPipelineCardState,
  action: IPipelineCardAction
): IPipelineCardState {
  switch (action.type) {
    case "append": {
      const { data } = action;
      GetBuildCards().then(
        (res) => {
          // Extend the list of cards by one !!!
          let newVal = res.concat(data);
          SetBuildCards(newVal);
          return newVal;
        },
        (err) => {
          // If the key is empty, set this as the first and only element
          SetBuildCards([data]);
          return [data];
        }
      );
    }
    case "clear": {
      // Clear out the storage entry
      SetBuildCards([]);
      return [];
    }
    case "extend": {
      return [];
    }
    case "retrieve": {
      GetBuildCards().then(
        (res) => {
          return res;
        },
        () => {
          // The storage entry can never be empty
          SetBuildCards([]);
          return [];
        }
      );
      return [];
    }
    case "set": {
      const { newData } = action;
      SetBuildCards(action.newData);
      return newData;
    }
  }
}
