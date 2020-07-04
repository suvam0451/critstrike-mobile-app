import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Button } from "react-native";
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
// import Icon from "react-native-vector-icons/Ionicons";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import {
  getProjectPipelines,
  getPipeline,
  IPipelinesResponse,
  IPipeline,
} from "../api/pipelines_gitlab";
import { AuthContext } from "../components/Context";
import AsyncStorage from "@react-native-community/async-storage";

interface IGitlabProgressCardProps {
  projID: number;
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
  const [Ref, setRef] = useState("loading...");

  const { getAPIKey, addAPIKey } = useContext(AuthContext);
  // Pipeline States
  const [RunningJobs, setRunningJobs] = useState<number>(0);
  const [SuccessJobs, setSuccessJobs] = useState<number>(0);
  const [CanceledJobs, setCanceledJobs] = useState<number>(0);
  const [FailedJobs, setFailedJobs] = useState<number>(0);
  const [PendingJobs, setPendingJobs] = useState<number>(0);
  const [TotalJobs, setTotalJobs] = useState<number>(0);
  const [JobsText, setJobsText] = useState<number>(0);

  useEffect(() => {
    console.log(props.projID);
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

  /** Do stuff!!! */
  async function ButtonPress() {
    getProjectPipelines("-CUasfvMePjsZzEgBHw-", props.projID).then((res) => {
      let token = "-CUasfvMePjsZzEgBHw-";
      switch (res.status) {
        case 200: {
          let _data: IPipeline[] = res.data;
          // For pipelines screen
          getPipeline(token, props.projID, _data[0].id).then((res) => {
            setStatus(res.data.status);
            setRef(res.data.ref);
            setPipelineID(res.data.id);
            setStartingTime(res.data.created_at);
            setIsTag(res.data.tag);
          });

          getPipelineJobs(token, props.projID, _data[0].id).then((res) => {
            let numSucceed = 0;
            let numFailed = 0;
            let numCancelled = 0;
            let numPending = 0;
            let total = 0;
            let smith: string[] = [];
            res.forEach((job) => {
              smith.push(job.name);
              total++;
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

            setCanceledJobs(numCancelled);
            setTotalJobs(total);
            setFailedJobs(numFailed);
            setSuccessJobs(numSucceed);

            AsyncStorage.setItem("numCanceled", numCancelled.toString());
          });
          break;
        }
      }
    });
  }

  return (
    <View>
      <Button
        onPress={() => {
          addAPIKey();
        }}
        title="Add API Key"
      />
      <View style={styles.gitlabCard}>
        <View style={styles.gitlabCardDashboard}>
          <View style={styles.gitlabCardSectionA}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri:
                    "https://stikka.io/31-large_default/gitlab-logo-sticker.jpg",
                }}
                size={64}
                accessibilityStates={[]}
              />
            </View>
          </View>
          <View style={styles.gitlabCardSectionB}>
            <View style={{ marginLeft: 8 }}>
              <Title style={styles.title}>Debashish Patra</Title>
              <Caption style={[styles.caption, styles.bottomDrawerSection]}>
                Status:{" "}
                <Text accessibilityStates={[]} style={{ color: StatusColor }}>
                  {Status}
                </Text>
              </Caption>
              <View style={styles.jobSection}>
                <View style={styles.jobSectionA}>
                  <Caption style={styles.captionJobStatus}>
                    {RunningJobs}/{SuccessJobs}/{FailedJobs} ({TotalJobs})
                  </Caption>
                </View>
                <View>
                  <View style={styles.jobSectionB}>
                    <Caption style={styles.captionBottom}>
                      {props.projID}
                    </Caption>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.gitlabCardSectionC}>
            <View style={styles.detailsButtonA}>
              <Icon.Button
                name="md-refresh"
                size={24}
                onPress={ButtonPress}
                backgroundColor="transparent"
                color="#2f333c"
                ellipsizeMode="middle"
              />
            </View>
            <View style={styles.detailsButtonB}>
              <Icon.Button
                name="md-arrow-down"
                size={24}
                onPress={() => {
                  setDisplayDetails(!displayDetails);
                }}
                backgroundColor="transparent"
                color="#2f333c"
              />
            </View>
          </View>
        </View>
        <View style={styles.gitlabCardDetails}>
          <View style={styles.textFields}>
            <ValueField
              label="id"
              value={PipelineID ? PipelineID : "loading..."}
              maxwidth={300}
            />
            <ValueField label="ref" value={Ref} maxwidth={300} />
            <ValueField
              label="started_at"
              value="2020-06-27T22:35:12.803Z"
              maxwidth={300}
            />
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
        <Text accessibilityStates={[]} style={styles.fieldLabel}>
          {props.label}:{" "}
        </Text>
        <Text accessibilityStates={[]} style={styles.fieldValue}>
          {props.value}
        </Text>
      </View>
    </View>
  );
}

// Thanks for open-source styling from Mr. Pradip (Youtube -- Pradip Debnath)
const styles = StyleSheet.create({
  gitlabCard: {
    display: "flex",
    alignContent: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  gitlabCardDashboard: {
    alignContent: "center",
    textAlign: "center",
    height: 100,
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
  projectIDSection: {
    marginRight: 0,
  },
  gitlabCardDetails: {
    marginHorizontal: 8,
  },
  textFields: {
    paddingLeft: 16,
  },
  field: {
    display: "flex",
    height: 20,
    flexDirection: "row",
  },
  fieldLabel: {
    flex: 1,
    fontWeight: "bold",
  },
  fieldValue: {
    flex: 1,
  },

  detailsButtonA: {
    width: 42,
    marginLeft: -32,
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  detailsButtonB: {
    width: 42,
    marginLeft: -32,
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  gitlabCardSectionA: {
    width: 80,
    marginLeft: 12,
  },
  gitlabCardSectionB: {
    flexGrow: 1,
  },
  gitlabCardSectionC: {
    width: 54,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f46a25",
    paddingLeft: 36,
    paddingRight: 0,
  },
  gitlabCardText: {
    alignContent: "center",
    textAlign: "center",
  },
  bottomDrawerSection: {
    marginBottom: 20,
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
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "bold",
  },
  captionBottom: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "900",
  },
  drawerContent: {
    flex: 1,
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
