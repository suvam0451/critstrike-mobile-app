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
import { HomeScreenTabs } from "./NavigationScreen";
import _ from "lodash";

/** Screen with bottom google navigation. */
export function BottomTabScreen() {
  const Tab = createMaterialBottomTabNavigator();
  const NavScreens = [
    {
      name: "CI_Starred",
      label: "Starred",
      comp: HomeScreenTabs,
      icon: "star",
    },
    {
      name: "Home",
      label: "Home",
      comp: HomeScreenTabs,
      icon: "bell",
    },
    {
      name: "Details",
      label: "Details",
      comp: HomeScreenTabs,
      icon: "battlenet",
    },
  ];

  return (
    <Tab.Navigator
      // screenOptions={{
      //   tabBarIcon: ({ color }) => (
      //     <MaterialCommunityIcons name="bell" color={color} size={24} />
      //   ),
      // }}
      initialRouteName="Home"
      labeled={false}
      barStyle={{ backgroundColor: "#694fad" }}
    >
      {_.map(NavScreens, (ele) => {
        return (
          <Tab.Screen
            name={ele.name}
            component={HomeScreenTabs}
            key={ele.label}
            options={{
              tabBarLabel: ele.label,
              tabBarIcon: (props) => (
                <MaterialCommunityIcons
                  name={ele.icon}
                  color={props.color}
                  size={26}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}
