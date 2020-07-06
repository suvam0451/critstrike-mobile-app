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
import { AuthContext } from "../components/Context";
import AsyncStorage from "@react-native-community/async-storage";

export function PasswordStoreScreen() {
  const [Keystore, setKeystore] = useState([
    {
      provider: "gitlab",
      profilename: "main",
      password: "-CUasfvMePjsZzEgBHw-",
    },
  ]);

  async function retrieveKeyStore() {
    AsyncStorage.getItem("keystore");
  }
  async function depositKeystore() {
    AsyncStorage.setItem("keystore", JSON.stringify(Keystore));
  }
  useEffect(() => {
    retrieveKeyStore();
    return () => {
      depositKeystore();
    };
  }, []);
  return (
    <View>
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
            <View style={{ marginLeft: 8 }}></View>
            <Title style={styles.title}>Debashish Patra</Title>
          </View>
        </View>
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
