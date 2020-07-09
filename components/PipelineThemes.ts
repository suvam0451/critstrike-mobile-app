/** Colour palette mapping */
export function getColors(provider: string) {
  switch (provider) {
    case "gitlab": {
      return {
        primary: "#f46a25",
        secondary: "#6200ee",
        buttonsA: "#2f333c",
        buttonsB: "#2f333c",
      };
    }
    case "azure": {
      return {
        primary: "#0066dd",
        secondary: "#fff",
        buttonsA: "#2f333c",
        buttonsB: "#2f333c",
      };
    }
    case "github": {
      return {
        primary: "#000",
        secondary: "#fff",
        buttonsA: "#2f333c",
        buttonsB: "#2f333c",
      };
    }
    default: {
      return {
        primary: "#000",
        secondary: "#fff",
        buttonsA: "#2f333c",
        buttonsB: "#2f333c",
      };
    }
  }
}

export function getLogo(provider: string): any {
  switch (provider) {
    case "gitlab": {
      return {
        uri: "https://stikka.io/31-large_default/gitlab-logo-sticker.jpg",
      };
    }
    case "azure": {
      return require("../assets/azurelogo.png");
    }
    case "github": {
      return require("../assets/githublogo.png");
    }
    default: {
      return require("../assets/githublogo.png");
    }
  }
}

export function getStatusColor(provider: string, baseStatus: string): string {
  switch (provider) {
    case "gitlab": {
      switch (baseStatus) {
        case "success": {
          return "green";
        }
        case "failed": {
          return "red";
        }
        case "canceled": {
          return "orange";
        }
        case "unknown": {
          return "gray";
        }
        default:
          return "gray";
      }
    }
    case "azure": {
      switch (baseStatus) {
        case "completed": {
          return "green";
        }
      }
      console.log("azure detected...");
      return "grey";
    }
    case "github": {
      console.log("github detected...");
      return "grey";
    }
    default: {
      return "grey";
    }
  }
}
