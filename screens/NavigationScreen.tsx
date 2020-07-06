import React, { useEffect, useState, useRef } from "react";
// import Screen from "./Screen";
import {
  StackActionHelpers,
  NavigationContainer,
} from "@react-navigation/native";
import { View, Text, Button, FlatList } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { GitlabProgressCard } from "../components/PipelineCards";
import LoginScreen from "./LoginScreen";
import _ from "lodash";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { PasswordStoreScreen } from "./APIKeysMenu";
import { ProfileScreen } from "./ProfileScreen";
import { IBuildCard } from "../types/app-types";

interface IProps {
  navigation: any;
}

export function StarredPipelines() {}

/** HomeScreenTabs. The first screen the user is greeted with. */
export function HomeScreenTabs() {
  /** Modify this to add screens to navigation */
  let screenArray = [
    { name: "Home", component: HomeScreen },
    { name: "Details", component: BuildMonitorScreen },
    { name: "Login", component: LoginScreen },
    { name: "Passwords", component: PasswordStoreScreen },
    { name: "Profile", component: ProfileScreen },
  ];

  const Stack = createStackNavigator();
  return (
    // <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#009387",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "normal",
        },
      }}
    >
      {_.map(screenArray, (ele) => {
        return (
          <Stack.Screen
            name={ele.name}
            key={ele.name}
            component={ele.component}
          />
        );
      })}
    </Stack.Navigator>
  );
}

// PAGE COMPONENTS
const HomeScreen = (props: IProps) => {
  return (
    <View>
      <Text>Konni Fucking Chiwa !!!</Text>
      <Button
        title="View all pipelines"
        onPress={() => {
          props.navigation.navigate("Details");
        }}
      />
      <Button
        title="View starred pipelines"
        onPress={() => {
          // props.navigation.navigate("Login");
          props.navigation.navigate("CI_Starred");
        }}
      />
      <Button
        title="Go to Passwords screen"
        onPress={() => {
          props.navigation.navigate("Passwords");
        }}
      />
      <Button
        title="Go to Profile screen"
        onPress={() => {
          props.navigation.navigate("Profile");
        }}
      />
    </View>
  );
};

interface IBuildMonitorProps {
  navigation: any;
  idArray: IBuildCard[];
}

/** Has gitlab cards */
const BuildMonitorScreen = (props: IBuildMonitorProps) => {
  const [IsLoading, setIsLoading] = useState(false);

  async function retrieveTags() {
    let yeetos = await AsyncStorage.getItem("buildcards");
  }

  async function depositTags() {
    await AsyncStorage.setItem("buildcards", JSON.stringify(idArray));
  }

  useEffect(() => {
    retrieveTags();
    return () => {
      depositTags();
    };
  }, []);

  let idArray: IBuildCard[] = [
    {
      provider: "gitlab",
      id: 18627416,
    },
    {
      provider: "gitlab",
      id: 16273750,
    },
    {
      provider: "gitlab",
      id: 14775312,
    },
    {
      provider: "gitlab",
      id: 19639484,
    },
  ];

  function RefreshList() {}

  return (
    <View>
      <Text style={{ paddingLeft: 10, fontSize: 18, marginBottom: 0 }}>
        Pull to refresh all...
      </Text>

      <FlatList
        data={idArray}
        renderItem={(ele) => {
          return <GitlabProgressCard projID={ele.item.id} />;
        }}
        keyExtractor={(i, k) => {
          return k.toString();
        }}
        refreshing={IsLoading}
        onRefresh={RefreshList}
        style={{ marginBottom: 16, paddingTop: 16 }}
      />

      <Button
        title="Go to Home screen"
        onPress={() => {
          props.navigation.navigate("Home");
        }}
      />
      <Button
        title="Go back"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <Button
        title="Go to Details screen... again"
        onPress={() => {
          props.navigation.push("Details");
        }}
      />
    </View>
  );
};
