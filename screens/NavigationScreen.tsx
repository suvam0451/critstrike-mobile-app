import React from "react";
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

interface IProps {
  navigation: any;
}

/** HomeScreenTabs. The first screen the user is greeted with. */
export function HomeScreenTabs() {
  let screenArray = [
    { name: "Home", component: HomeScreen },
    { name: "Details", component: DetailsScreen },
    { name: "Login", component: LoginScreen },
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
    </View>
  );
};

const DetailsScreen = (props: IProps) => {
  return (
    <View>
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
      <GitlabProgressCard projID={18627416} />
      <GitlabProgressCard projID={16273750} />
    </View>
  );
};
