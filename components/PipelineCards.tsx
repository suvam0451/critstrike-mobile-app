import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Button, Image, Linking } from "react-native";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import TabOneScreen from "../screens/TabOneScreen";
import {
  useTheme, // Also available from other package
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  TouchableRipple,
  Text,
  IconButton,
  Switch,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper";
import { Status } from "../api/core";
import { getPipelineJobs } from "../api/jobs_gitlab";
import _ from "lodash";
// import Icon from "react-native-vector-icons/Ionicons";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { getProjectPipelines, getPipeline } from "../api/pipelines_gitlab";
import * as Azure from "../api/pipelines_azure";
import { IPipeline } from "../types/gitlab-types";
import { AuthContext } from "../components/Context";
import AsyncStorage from "@react-native-community/async-storage";

import { GitlabCIPrimaryData, JobCollectiveStatus } from "../types/app-types";
import { IBuildCard } from "../types/app-types";
import { ThemeColors } from "react-navigation";

interface IGitlabProgressCardProps {
  data: IBuildCard;
  provider: "gitlab" | "azure" | "github";
}

export function GitlabProgressCard(props: IGitlabProgressCardProps) {
  const [Status, setStatus] = useState<Status>("unknown");
  const [StatusColor, setStatusColor] = useState("red");
  const [StatusText, setStatusText] = useState("unknown");
  const [projectSlug, setProjectSlug] = useState("pending...");
  const [displayDetails, setDisplayDetails] = useState(false);
  const [StartingTime, setStartingTime] = useState("loading...");
  const [PipelineID, setPipelineID] = useState<number | undefined>(undefined);
  const [IsTag, setIsTag] = useState<boolean | undefined>(undefined);
  /** This ref is used while restarting the pipeline */
  const [RestartRef, setRestartRef] = useState<number>(-1);
  const [PrimaryData, setPrimaryData] = useState<GitlabCIPrimaryData>({
    status: "unknown",
    ref: "loading...",
    pipelineID: undefined,
    startingTime: "loading...",
    isTag: undefined,
    projName: "loading...",
    projID: "loading...",
    external_link: null,
  });
  const [ColorTheme, setColorTheme] = useState({ primary: "", secondary: "" });

  const { getAPIKey, addAPIKey } = useContext(AuthContext);
  const [RunningJobs, setRunningJobs] = useState<number>(0);
  const [JobStatuses, setJobStatuses] = useState<JobCollectiveStatus>({
    numSucceed: 0,
    numFailed: 0,
    numCanceled: 0,
    numPending: 0,
    numTotal: 0,
  });
  const [AvatarImage, setAvatarImage] = useState<any>(null);

  let buttonStyles = {
    size: 24,
    backgroundColor: "transparent",
    color: "#2f333c",
  };

  let buttonStylesB = {
    size: 20,
    backgroundColor: "transparent",
    color: "#2f333c",
  };

  useEffect(() => {
    // Update everything, On page start
    ButtonPress();
    switch (props.provider) {
      case "gitlab": {
        setAvatarImage({
          uri: "https://stikka.io/31-large_default/gitlab-logo-sticker.jpg",
        });
        setColorTheme({
          primary: "#f46a25",
          secondary: "#6200ee",
        });
        break;
      }
      case "azure": {
        setAvatarImage(require("../assets/azurelogo.png"));
        setColorTheme({
          primary: "#0066dd",
          secondary: "#ffffff",
        });
        break;
      }
      case "github": {
        setAvatarImage(require("../assets/githublogo.png"));
        setColorTheme({
          primary: "#000",
          secondary: "#ffffff",
        });
      }
    }
    switch (Status) {
      case "success": {
        setStatusColor("green");
        break;
      }
      case "failed": {
        setStatusColor("red");
        break;
      }
      case "canceled": {
        setStatusColor("orange");
        break;
      }
      case "unknown": {
        setStatusColor("gray");
        break;
      }
    }

    if (displayDetails) {
    }
    return () => {};
  }, [Status, displayDetails]);

  function restartPipeline(event: any): void {
    switch (props.data.provider) {
      case "gitlab": {
        let { token } = props.data;
        break;
      }
      case "azure": {
        let { organization, token, project } = props.data;
        Azure.restartPipeline(
          {
            token: token,
            organization: organization,
            project: project,
          },
          7
        ).then((res) => {});
        break;
      }
      case "github": {
        let { token } = props.data;
        break;
      }
    }
  }

  function requestArtifacts(event: any): void {
    switch (props.data.provider) {
      case "gitlab": {
        break;
      }
      case "azure": {
        let { organization, token, project } = props.data;
        const { pipelineID } = PrimaryData;
        if (pipelineID) {
          Azure.getArtifactLinks(token, organization, project, pipelineID).then(
            (res) => {
              console.log(res);
            }
          );
        }
        break;
      }
      case "github": {
        break;
      }
    }
  }
  /** Do stuff!!! */
  async function ButtonPress() {
    switch (props.data.provider) {
      case "gitlab": {
        let { id, token } = props.data;
        getProjectPipelines(token, id).then((res) => {
          switch (res.status) {
            case 200: {
              let _data: IPipeline[] = res.data;
              // For pipelines screen
              getPipeline(token, id, _data[0].id).then((res) => {
                let _projName = "unknown !!!";

                let ex = /.+\/(.+)\/\-(.*?)/;
                if (ex.test(res.web_url)) {
                  _projName = res.web_url.match(ex)![1];
                }

                // Color update
                setStatus(res.status);

                setPrimaryData({
                  status: res.status,
                  ref: res.ref,
                  pipelineID: res.id,
                  startingTime: res.created_at,
                  isTag: res.tag,
                  projName: _projName,
                  projID: id,
                  external_link: new URL("okay"),
                });
              });

              getPipelineJobs(token, id, _data[0].id).then((res) => {
                let numSucceed = 0;
                let numFailed = 0;
                let numCancelled = 0;
                let numPending = 0;
                let total = res.length;
                let smith: string[] = [];
                res.forEach((job) => {
                  smith.push(job.name);
                  switch (job.status) {
                    case "failed": {
                      numFailed++;
                      break;
                    }
                    case "success": {
                      numSucceed++;
                      break;
                    }
                    case "pending": {
                      numPending++;
                      break;
                    }
                    case "canceled": {
                      numCancelled++;
                    }
                    default: {
                      break;
                    }
                  }
                });
                let pending = total - numCancelled - numFailed - numSucceed;

                setJobStatuses({
                  numSucceed: numSucceed,
                  numFailed: numFailed,
                  numCanceled: numCancelled,
                  numPending: pending,
                  numTotal: total,
                });

                AsyncStorage.setItem("numCanceled", numCancelled.toString());
              });
              break;
            }
          }
        });
        break;
      }
      case "azure": {
        const { token, project, organization } = props.data;
        Azure.listBuilds(token, organization, project).then(
          (res) => {
            const ref = res.value[0].sourceBranch;
            const projName = res.value[0].repository.name;
            const { sourceBranch, status, startTime, id } = res.value[0];

            // setRestartRef(res.value[0].definition.id);
            setPrimaryData({
              ref: sourceBranch,
              projName: res.value[0].repository.name,
              status: status === "completed" ? "success" : "failed",
              startingTime: startTime,
              pipelineID: id,
              isTag: false,
              projID: 101,
              external_link: res.value[0]._links.web.href,
            });

            const projID = res.value[0].repository.id;
            console.log(ref, projName);

            Azure.getTimeline(
              { token: token, project: project, organization: organization },
              id
            ).then((res) => {
              let A = _.filter(res.records, (ele) => ele.type == "Phase");
              /** Assume job finished, if job was finalized */
              let B = _.filter(
                res.records,
                (ele) => ele.name == "Finalize Job"
              );
              console.log(A.length, B.length);

              setJobStatuses({
                numSucceed: B.length,
                numFailed: A.length - B.length,
                numCanceled: 0,
                numPending: 0,
                numTotal: A.length,
              });
            });
          },
          (err) => console.log(err)
        );
        break;
      }
    }
  }

  return (
    <View>
      <View style={styles.gitlabCard}>
        <View
          style={[
            styles.gitlabCardDashboard,
            { borderColor: ColorTheme.primary },
          ]}
        >
          {/* Logo image */}
          <View style={styles.gitlabCardSectionA}>
            <Avatar.Image source={AvatarImage} size={64} />
          </View>
          {/* Dashboard, name, status */}
          <View style={styles.gitlabCardSectionB}>
            <Title style={styles.title}>{PrimaryData.projName}</Title>
            <Caption style={[styles.caption, styles.bottomDrawerSection]}>
              Status:{" "}
              <Text accessibilityStates={[]} style={{ color: StatusColor }}>
                {PrimaryData.status}
              </Text>
            </Caption>
            <View style={styles.jobSection}>
              <View style={styles.jobSectionA}>
                <Caption style={styles.captionJobStatus}>
                  {RunningJobs}/{JobStatuses.numSucceed}/{JobStatuses.numFailed}{" "}
                  ({JobStatuses.numTotal})
                </Caption>
              </View>
              <View>
                <View style={styles.jobSectionB}>
                  <Caption style={styles.captionBottom}>
                    {PrimaryData.projID}
                  </Caption>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.gitlabCardSectionC,
              { backgroundColor: ColorTheme.primary },
            ]}
          >
            <View style={styles.detailsButtonA}>
              <IonIcon.Button
                {...buttonStyles}
                name="md-refresh"
                onPress={() => {
                  ButtonPress();
                }}
                ellipsizeMode="middle"
              />
            </View>
            <View style={styles.detailsButtonB}>
              <IonIcon.Button
                {...buttonStyles}
                name="md-arrow-down"
                onPress={() => {
                  setDisplayDetails(!displayDetails);
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 8,
            display: displayDetails ? "flex" : "none",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              paddingLeft: 16,
              paddingTop: 8,
              flexGrow: 1,
            }}
          >
            <ValueField
              label="id"
              value={PipelineID ? PipelineID : "loading..."}
              maxwidth={240}
            />
            <ValueField label="ref" value={PrimaryData.ref} maxwidth={240} />
            <ValueField
              label="started_at"
              value={PrimaryData.startingTime}
              maxwidth={240}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              maxWidth: 84,
            }}
          >
            {/* Additional actions toolbar */}
            <View style={styles.buttonColumn}>
              <FAIcon.Button
                {...buttonStylesB}
                name="refresh"
                onPress={requestArtifacts}
              />
              <FAIcon.Button
                {...buttonStylesB}
                name="history"
                onPress={() => {
                  Linking.openURL(PrimaryData.external_link!.toString());
                }}
              />
            </View>
            <View style={styles.buttonColumn}>
              <IonIcon.Button
                {...buttonStyles}
                name="md-cloud-download"
                onPress={requestArtifacts}
              />
              <FAIcon.Button
                {...buttonStyles}
                name="external-link"
                onPress={() => {
                  setDisplayDetails(!displayDetails);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

interface IValueFieldProps {
  maxwidth: number;
  label: string;
  value: string | number;
}

function ValueField(props: IValueFieldProps) {
  return (
    <View style={{ maxWidth: props.maxwidth }}>
      <View style={styles.field}>
        <Text accessibilityStates={[]} style={{ flex: 1, fontWeight: "bold" }}>
          {props.label}:{" "}
        </Text>
        <Text accessibilityStates={[]} style={{ flex: 1 }}>
          {props.value}
        </Text>
      </View>
    </View>
  );
}

// Thanks for open-source styling from Mr. Pradip (Youtube -- Pradip Debnath)
const styles = StyleSheet.create({
  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  gitlabCard: {
    display: "flex",
    alignContent: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  gitlabCardDashboard: {
    alignContent: "center",
    textAlign: "center",
    height: 90, // FIXME: 100
    display: "flex",
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 0,
    marginHorizontal: 8,
    borderColor: "brown",
    borderRadius: 4,
    borderWidth: 2,
  },
  jobSection: {
    // Affected by margin of bottomDrawerSection
    display: "flex",
    flexDirection: "row",
    marginBottom: 0,
    height: 30,
  },
  jobSectionA: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  jobSectionB: {
    flex: 1,
    marginRight: 8,
    justifyContent: "flex-end",
  },
  field: {
    display: "flex",
    height: 20,
    flexDirection: "row",
  },

  // This is the circular card
  gitlabCardSectionA: {
    width: 80,
    marginLeft: 12,
    marginTop: 11,
  },
  // Name, status, dashboard
  gitlabCardSectionB: {
    flexGrow: 1,
  },
  gitlabCardSectionC: {
    width: 54,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    paddingLeft: 36,
    paddingVertical: 2,
  },
  gitlabCardText: {
    alignContent: "center",
    textAlign: "center",
  },
  detailsButtonA: {
    width: 42,
    marginLeft: -32,
  },
  detailsButtonB: {
    width: 42,
    marginLeft: -32,
  },
  bottomDrawerSection: {
    marginBottom: 12,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  caption: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "900",
  },
  captionJobStatus: {
    // inside jobSectionB
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "bold",
  },
  captionBottom: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "900",
  },
  drawerSection: {
    marginTop: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  row: {
    marginTop: 20,
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    marginTop: 0,
    marginBottom: -4,
    fontWeight: "bold",
  },
  userInfoSection: {
    paddingLeft: 20,
  },
});
