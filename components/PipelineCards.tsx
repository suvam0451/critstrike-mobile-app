import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Button, Image, Linking, Alert } from "react-native";
import * as Notifications from "expo-notifications";
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
import AntIcon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
// import { getProjectPipelines, getPipeline } from "../api/pipelines_gitlab";
import * as Azure from "../api/pipelines_azure";
import * as Gitlab from "../api/pipelines_gitlab";
import { IPipeline } from "../types/gitlab-types";
import { AuthContext } from "../components/Context";
import AsyncStorage from "@react-native-community/async-storage";

import { GitlabCIPrimaryData, JobCollectiveStatus } from "../types/app-types";
import { IBuildCard } from "../types/app-types";
import { ThemeColors } from "react-navigation";
import { getColors, getLogo, getStatusColor } from "./PipelineThemes";
import RestartPipeline from "../api/general_restart";

interface IGitlabProgressCardProps {
  data: IBuildCard;
  provider: "gitlab" | "azure" | "github";
}

export function GitlabProgressCard(props: IGitlabProgressCardProps) {
  const [Status, setStatus] = useState("unknown");
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
  const [ColorTheme, setColorTheme] = useState({
    primary: "",
    secondary: "",
    buttonsA: "",
    buttonsB: "",
  });

  // Sets color of artifacts button
  const [ArtifactAccessible, setArtifactAccessible] = useState(false);
  const [FormAccessible, setFormAccessible] = useState(false);

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
  };

  useEffect(() => {
    // Update everything, On page start
    ButtonPress(null);

    // State update for cards
    setColorTheme(getColors(props.provider));
    setAvatarImage(getLogo(props.provider));
    setStatusColor(getStatusColor(props.provider, Status));

    PrimaryData.pipelineID ? setFormAccessible(false) : setFormAccessible(true);

    props.data.vars && props.data.vars.length > 0
      ? setFormAccessible(true)
      : setFormAccessible(false);
  }, [Status, displayDetails]);

  /** Requests a restart of a pipeline. */
  function restartPipeline(event: any): void {
    RestartPipeline(props.data, PrimaryData.projID);
  }

  function requestArtifacts(event: any): void {
    switch (props.data.provider) {
      case "gitlab": {
        break;
      }
      case "azure": {
        const { pipelineID } = PrimaryData;
        if (pipelineID) {
          Azure.getArtifactLinks(props.data.params, pipelineID).then((res) => {
            console.log(`detected ${res.length} artifacts for azure.`);
          });
        }
        break;
      }
      case "github": {
        break;
      }
    }
  }
  /** Do stuff!!! */
  function ButtonPress(e: any) {
    switch (props.data.provider) {
      case "gitlab": {
        let { id, token } = props.data;
        Gitlab.getProjectPipelines(token, id).then((res) => {
          switch (res.status) {
            case 200: {
              let _data: IPipeline[] = res.data;
              // For pipelines screen
              Gitlab.getPipeline(token, id, _data[0].id).then((res) => {
                let _projName = "unknown !!!";

                let ex = /.+\/(.+)\/\-(.*?)/;
                if (ex.test(res.web_url)) {
                  _projName = res.web_url.match(ex)![1];
                }

                const { ref, status, created_at, tag, duration } = res;
                // For color update
                setStatus(status);
                // For data state update
                setPrimaryData({
                  status: status,
                  ref: ref,
                  pipelineID: res.id,
                  startingTime: created_at,
                  isTag: tag,
                  projName: _projName,
                  projID: id,
                  external_link: new URL("okay"),
                  duration: duration ? duration.toString() : "unknown",
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
        const { params } = props.data;
        Azure.listBuilds(params).then(
          (res) => {
            const { sourceBranch, status, startTime, id } = res.value[0];

            // This ref is used for a restart
            setRestartRef(res.value[0].definition.id);
            setStatus(res.value[0].status);
            setPrimaryData({
              ref: sourceBranch,
              projName: res.value[0].repository.name,
              status: status === "completed" ? "success" : "failed",
              startingTime: startTime,
              pipelineID: id,
              isTag: false,
              projID: "N/A",
              external_link: res.value[0]._links.web.href,
            });

            Azure.getTimeline(params, id).then((res) => {
              let A = _.filter(res.records, (ele) => ele.type == "Phase");
              /** Assume job finished, if job was finalized */
              let B = _.filter(
                res.records,
                (ele) => ele.name == "Finalize Job"
              );

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
            <Avatar.Image
              source={AvatarImage}
              size={64}
              accessibilityStates={[]}
            />
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
                onPress={ButtonPress}
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
              label="project-id"
              value={PrimaryData.projID ? PrimaryData.projID : "loading..."}
              maxwidth={194}
            />
            <ValueField label="ref" value={PrimaryData.ref} maxwidth={194} />
            <ValueField
              label="duration"
              value={
                PrimaryData.duration
                  ? PrimaryData.duration.toString()
                  : "unknown"
              }
              maxwidth={194}
            />
            <ValueField
              label="variables"
              value={props.data.vars ? `yes (${props.data.vars.length})` : "no"}
              maxwidth={194}
            />
            <ValueField label="restart-ref" value={RestartRef} maxwidth={194} />
            <ValueField
              label="started_at"
              value={PrimaryData.startingTime}
              maxwidth={194}
            />
            {/* RestartRef */}
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
                onPress={restartPipeline}
                color={ArtifactAccessible ? ColorTheme.buttonsB : "gray"}
              />
              <AntIcon.Button
                {...buttonStylesB}
                name="form"
                onPress={restartPipeline}
                color={FormAccessible ? ColorTheme.buttonsB : "gray"}
              />

              <FAIcon.Button
                {...buttonStylesB}
                name="history"
                onPress={() => {}}
                color={ArtifactAccessible ? ColorTheme.buttonsB : "gray"}
              />
            </View>
            <View style={styles.buttonColumn}>
              <IonIcon.Button
                {...buttonStyles}
                name="md-cloud-download"
                onPress={requestArtifacts}
                disabled={!ArtifactAccessible}
                color={ArtifactAccessible ? ColorTheme.buttonsB : "gray"}
              />
              <FAIcon.Button
                {...buttonStyles}
                name="external-link"
                onPress={() => {
                  Linking.openURL(PrimaryData.external_link!.toString());
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
