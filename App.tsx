import { StatusBar } from "expo-status-bar";
import React, {
  useState,
  useMemo,
  useEffect,
  useReducer,
  Reducer,
} from "react";
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
import WelcomeScreen from "./screens/WelcomeScreen";
/** */
import { NavigationScreens } from "./screens/NavigationScreen";
import { BottomTabScreen } from "./screens/BottomTabScreen";
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import MyDrawer from "./components/DrawerComponent";

import { AuthContext } from "./components/Context";

interface IAppProps {
  navigation: any;
}

// Theme switching
const CustomDefaultTheme = {
  // Spread themes
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    background: "#ffffff",
    text: "#333333",
  },
};

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
  },
  background: "#333333",
  text: "#ffffff",
};

interface ILoginState {
  isLoading: boolean;
  userName: string | null;
  userToken: string | null;
}

// type guards for union types
type loginAction =
  | { type: "RETRIEVE_TOKEN"; token: string }
  | { type: "LOGIN"; id: string; token: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER" };

type LoginReducer<S, A> = (prevState: S, action: A) => S;

export default function App(props: IAppProps) {
  const loginReducer = (prevState: ILoginState, action: loginAction) => {
    switch (action.type) {
      // First time
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,

          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return { ...prevState, isLoading: false };
    }
  };

  // Reducer states
  const initialLoginState: ILoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const isLoadingComplete = useCachedResources();
  const [loginState, loginStateDispatch] = useReducer<
    Reducer<ILoginState, loginAction>,
    any
  >(loginReducer, initialLoginState, (arg: loginAction) => {
    return {
      isLoading: false,
      userToken: null,
      userName: null,
    };
  });

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
  const colorScheme = useColorScheme();

  const HomeStack = createStackNavigator();
  const DetailsStack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const authContext = useMemo(
    () => ({
      signIn: (userName: string, password: string) => {
        let userToken = "reality";
        setUserToken("fgk");
        setIsLoading(false);

        loginStateDispatch({
          type: "LOGIN",
          id: "suvam0451",
          token: userToken,
        });
      },
      signOut: () => {
        setUserToken(null);
        setIsLoading(false);
      },
      signUp: () => {
        setUserToken("fgk");
        setIsLoading(false);
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      // cleanup
    };
  }, []);

  interface INavigator {
    navigation: any;
  }
  function HomeStackScreen(props: INavigator) {
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
                onPress={() => props.navigation.openDrawer()}
              ></Icon.Button>
            ),
          }}
        ></HomeStack.Screen>
      </HomeStack.Navigator>
    );
  }

  function DetailsStackScreen(props: INavigator) {
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
                onPress={() => props.navigation.openDrawer()}
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
      // same theme has to be provided for both contetxs
      // <AuthContext.Provider value=>

      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {/* Different page depending on userToken */}
          {userToken !== null ? true : true}
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="Home" component={NavigationScreens} />
            <Drawer.Screen name="Welcome" component={WelcomeScreen} />
            <Drawer.Screen name="Others" component={TabOneScreen} />
            <Drawer.Screen name="Laila2" component={HomeStackScreen} />
            <Drawer.Screen name="Laila" component={BottomTabScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
      // </AuthContext>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
