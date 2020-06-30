import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View, Button } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import TabOneScreen from "./screens/TabOneScreen";

// Drawer
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabTwoScreen from "./screens/TabTwoScreen";
import DrawerContent from "./components/DrawerComponent";

import MyDrawer from "./components/DrawerComponent";

interface IAppProps {
  navigation: any;
}
export default function App(props: IAppProps) {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const HomeStack = createStackNavigator();
  const DetailsStack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  function HomeStackScreen({ navigation }) {
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <HomeStack.Screen
          name="Home"
          component={TabOneScreen}
          options={{
            title: "Overview",
            headerLeft: () => (
              <Icon.Button
                name="ios-menu"
                size={25}
                backgroundColor="#009387"
                onPress={() => navigation.openDrawer()}
              ></Icon.Button>
            ),
          }}
        ></HomeStack.Screen>
      </HomeStack.Navigator>
    );
  }

  function DetailsStackScreen({ navigation }) {
    return (
      <DetailsStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#009387",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <DetailsStack.Screen
          name="Tab1"
          component={TabOneScreen}
          options={{
            title: "Details Screen",
            headerLeft: () => (
              <Icon.Button
                name="ios-menu"
                size={25}
                backgroundColor="#009387"
                onPress={() => navigation.openDrawer()}
              ></Icon.Button>
            ),
          }}
        ></DetailsStack.Screen>
        <DetailsStack.Screen
          name="Tab2"
          component={TabTwoScreen}
          options={{ title: "Go to tab 2" }}
        ></DetailsStack.Screen>
      </DetailsStack.Navigator>
    );
  }

  // Main return
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      // <MyDrawer />
      // <NavigationContainer>
      //   <Drawer.Navigator initialRouteName="Home">
      //     <Drawer.Screen name="Home" component={HomeStackScreen} />
      //     <Drawer.Screen name="First" component={TabOneScreen} />
      //     <Drawer.Screen name="Second" component={TabTwoScreen} />
      //     <Drawer.Screen name="Details Screen" component={DetailsStackScreen} />
      //   </Drawer.Navigator>
      //   {/* <SafeAreaProvider>
      //     <Navigation colorScheme={colorScheme} />
      //     <StatusBar />
      //   </SafeAreaProvider> */}
      // </NavigationContainer>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name="Home" component={TabOneScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
