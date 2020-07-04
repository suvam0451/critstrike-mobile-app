import { StatusBar } from "expo-status-bar";
import React, {
  useState,
  useMemo,
  useEffect,
  useReducer,
  Reducer,
} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/** Screens */
import { NavigationScreens } from "./NavigationScreen";

/** Bottom yeet */
export function BottomTabScreen() {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabel: "Great",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={24} />
        ),
      }}
      initialRouteName="Home"
      labeled={false}
      barStyle={{ backgroundColor: "#694fad" }}
    >
      <Tab.Screen
        name="Home"
        component={NavigationScreens}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={NavigationScreens}
        options={{
          tabBarLabel: "Details",
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              name="battlenet"
              color={props.color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
