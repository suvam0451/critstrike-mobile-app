import React from "react";
// import Screen from "./Screen";
import {
  StackActionHelpers,
  NavigationContainer,
} from "@react-navigation/native";
import { View, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { GitlabProgressCard } from "../components/PipelineCards";

interface IProps {
  navigation: any;
}

const HomeScreen = (props: IProps) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details screen"
        onPress={() => {
          props.navigation.navigate("Details");
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

/** StackNavigation */
export function NavigationScreens() {
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
      <Stack.Screen
        name="Homey"
        component={HomeScreen}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerStyle: {
            backgroundColor: "#009387",
          },
        }}
      />
    </Stack.Navigator>
  );
}
