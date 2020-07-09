import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
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
import { Divider } from "react-native-paper";
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
  Button as PaperButton,
} from "react-native-paper";
import { Status } from "../api/core";
import _ from "lodash";
import { IBuildCard } from "../types/app-types";

import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-community/async-storage";
import KeyValuePairField from "../components/KeyValuePairField";
import { listBuilds } from "../api/pipelines_azure";

export function ProfileScreen() {
  const [Dashboard, setDashboard] = useState({
    running: 0,
    available: 0,
    keystoreLen: 0,
  });
  useEffect(() => {
    AsyncStorage.getItem("buildcards").then((res) => {
      if (res != null) {
        let yeet: IBuildCard[] = JSON.parse(res!);
        setDashboard({
          running: 0,
          available: yeet.length,
          keystoreLen: yeet.length,
        });
      }
      console.log(res);
    });

    return () => {};
  }, []);

  /** Modify this to edit screen navigation paths */
  let _nav = [
    {
      icon: "heart-outline",
      text: "Favourites",
      comp: "Settings",
    },
    {
      icon: "heart-outline",
      text: "View Pipelines",
      comp: "Settings",
    },
    {
      icon: "share-outline",
      text: "Share with friends",
      comp: "Settings",
    },
    {
      icon: "settings-outline",
      text: "Settings",
      comp: "Settings",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Avatar.Image
            source={{
              uri: "https://stikka.io/31-large_default/gitlab-logo-sticker.jpg",
            }}
            size={64}
            accessibilityStates={[]}
          />
          <View style={{ marginLeft: 20 }}>
            <Title style={[styles.title, { marginTop: 15, marginBottom: 5 }]}>
              John Doe
            </Title>
            <Caption style={styles.caption}>@suvam0451</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <MaterialIcon name="map-marker-radius" color="#777777" size={20} />
          <Text
            style={{ color: "#777777", marginLeft: 20 }}
            accessibilityStates={[]}
          >
            Kolkata,{" "}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialIcon name="map-marker-radius" color="#777777" size={20} />
          <Text
            style={{ color: "#777777", marginLeft: 20 }}
            accessibilityStates={[]}
          >
            Kolkata,{" "}
          </Text>
        </View>
      </View>

      {/* Counters */}
      <View style={[styles.infoBoxWrapper]}>
        <View
          style={[
            styles.infoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <Title>{Dashboard.available}</Title>
          <Caption>Pipelines</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>11</Title>
          <Caption>API Keys</Caption>
        </View>
      </View>

      <KeyValuePairField CardIdx={5} paramIdx={0} />
      <Divider accessibilityStates={[]} />
      <KeyValuePairField CardIdx={5} paramIdx={1} />
      {/* Screen navigations */}
      <View style={styles.menuWrapper}>
        {_.map(_nav, (ele) => {
          return (
            <TouchableRipple onPress={() => {}} accessibilityStates={[]}>
              <View style={styles.menuItem}>
                <MaterialIcon name={ele.icon} color="#FF6347" size={25} />
                <Text style={styles.menuItemText} accessibilityStates={[]}>
                  {ele.text}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
