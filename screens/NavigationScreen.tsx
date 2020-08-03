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
import { PickerModal } from "../components/PickerModal";
import { GitlabActiveProfileModal } from "../components/ModalLibrary";

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
  const [ModalVisibility, setModalVisibility] = useState(false);

  return (
    <View>
      <GitlabActiveProfileModal
        isVisible={ModalVisibility}
        setIsVisible={setModalVisibility}
      />
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
      <Button
        title="Show modal"
        onPress={() => {
          setModalVisibility(true);
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
      uid: 0,
      provider: "gitlab",
      id: 18627416,
      token: "-CUasfvMePjsZzEgBHw-",
    },
    {
      uid: 1,
      provider: "gitlab",
      id: 16273750,
      token: "-CUasfvMePjsZzEgBHw-",
    },
    {
      uid: 2,
      provider: "gitlab",
      id: 14775312,
      token: "-CUasfvMePjsZzEgBHw-",
    },
    {
      uid: 3,
      provider: "gitlab",
      id: 19639484,
      token: "-CUasfvMePjsZzEgBHw-",
    },
    {
      uid: 4,
      provider: "azure",
      params: {
        organization: "suvam0451",
        project: "ReEncoding",
        token: "c4cipj4hasom3wrhrlkujsqo7ixtqslocrg72rs55mwwnicnb37q",
      },
    },
    {
      uid: 5,
      provider: "azure",
      params: {
        organization: "suvam0451",
        project: "ReEncoding",
        token: "c4cipj4hasom3wrhrlkujsqo7ixtqslocrg72rs55mwwnicnb37q",
      },
      vars: [
        {
          label: "OP_TAG",
          value: "drivekit_folder",
          IEnum: ["drivekit_folder", "drivekit_file"],
        },
        {
          label: "GDRIVE_FOLDER",
          value: "1lIxfsC_DJ41U5Pjf0OnvmIE8rGu0f3xv",
        },
      ],
    },
    {
      uid: 6,
      provider: "github",
      id: 19639484,
      token: "-CUasfvMePjsZzEgBHw-",
    },
    {
      uid: 7,
      provider: "github",
      id: 19639484,
      token: "-CUasfvMePjsZzEgBHw-",
    },
  ];

  function RefreshList() {}

  return (
    <View>
      <FlatList
        data={idArray}
        renderItem={(ele) => {
          return (
            <GitlabProgressCard data={ele.item} provider={ele.item.provider} />
          );
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
