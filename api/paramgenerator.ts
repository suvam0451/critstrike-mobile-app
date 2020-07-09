import { IVariable } from "../types/app-types";

export default function AzureParamResolve(data: IVariable[]): string {
  let init = "{";

  data.forEach((pair, i) => {
    init += '"' + pair.label + '":';
    init += '"' + pair.value + '"';
    if (i != data.length - 1) {
      init += ",";
    }
  });

  init += "}";
  return init;
}
