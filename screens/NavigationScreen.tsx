import React, { useEffect } from "react";
// import Screen from "./Screen";
import {
  StackActionHelpers,
  NavigationContainer,
} from "@react-navigation/native";
import { View, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { GitlabProgressCard } from "../components/PipelineCards";
import LoginScreen from "./LoginScreen";
import _ from "lodash";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { PasswordStoreScreen } from "./APIKeysMenu";

interface IProps {
  navigation: any;
}

/** HomeScreenTabs. The first screen the user is greeted with. */
export function HomeScreenTabs() {
  let screenArray = [
    { name: "Home", component: HomeScreen },
    { name: "Details", component: BuildMonitorScreen },
    { name: "Login", component: LoginScreen },
    { name: "Passwords", component: PasswordStoreScreen },
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
            component={ele.component}
            options={{
              headerStyle: {
                backgroundColor: "#009387",
              },
            }}
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
        title="Go to Details screen"
        onPress={() => {
          props.navigation.navigate("Details");
        }}
      />
      <Button
        title="Go to Login screen"
        onPress={() => {
          props.navigation.navigate("Login");
        }}
      />
      <Button
        title="Go to Passwords screen"
        onPress={() => {
          props.navigation.navigate("Passwords");
        }}
      />
    </View>
  );
};

interface IBuildCard {
  provider: "gitlab" | "azure" | "github";
  id: number;
}

interface IBuildMonitorProps {
  navigation: any;
  idArray: IBuildCard[];
}

const BuildMonitorScreen = (props: IBuildMonitorProps) => {
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
  ];

  return (
    <ScrollView>
      <Text>Details Screen</Text>
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

      {_.map(idArray, (obj) => {
        switch (obj.provider) {
          case "gitlab": {
            return <GitlabProgressCard projID={obj.id} />;
          }
          case "github": {
            return <GitlabProgressCard projID={obj.id} />;
          }
          case "azure": {
            return <GitlabProgressCard projID={obj.id} />;
          }
        }
      })}
    </ScrollView>
  );
};
