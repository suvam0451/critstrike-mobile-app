import { StatusBar } from "expo-status-bar";
import React, {
  useState,
  useMemo,
  useEffect,
  useReducer,
  Reducer,
} from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, View, Button, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import TabOneScreen from "./screens/TabOneScreen";

// Drawer
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabTwoScreen from "./screens/TabTwoScreen";
import DrawerContent from "./components/DrawerComponent";
import WelcomeScreen from "./screens/WelcomeScreen";
/** */
import { HomeScreenTabs } from "./screens/NavigationScreen";
import { BottomTabScreen } from "./screens/BottomTabScreen";
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
  Provider,
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
  | { type: "REGISTER"; token: string };

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

  const keystoreUpdateRequest = () => {};

  /** useMemo makes sure the objects (and not the function itself),
   *  is saved from reference equality failure
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const authContext = useMemo(
    () => ({
      signIn: async (userName: string, password: string) => {
        let userToken = "reality";
        setUserToken("-CUasfvMePjsZzEgBHw-");
        setIsLoading(false);

        // try id/pass. Save if match.
        if (userName == "suvam0451" && password == "-CUasfvMePjsZzEgBHw-") {
          try {
            userToken = "-CUasfvMePjsZzEgBHw-";
            await AsyncStorage.setItem("userToken", userToken);
          } catch (e) {
            console.log(e);
          }
        }
        // Dispatch login action
        loginStateDispatch({
          type: "LOGIN",
          id: userName,
          token: userToken,
        });
      },
      signOut: async () => {
        setUserToken(null);
        setIsLoading(false);

        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
      },
      signUp: () => {
        setUserToken("-CUasfvMePjsZzEgBHw-");
        setIsLoading(false);
      },
      // Add API key
      addAPIKey: () => {
        console.log("AddAPIKey called...");
      },
      getAPIKey: () => {
        console.log("GetAPIKey called...");
      },
    }),
    []
  );

  async function retrieval() {
    let username = await AsyncStorage.getItem("username");
    let userid = await AsyncStorage.getItem("userid");
  }
  useEffect(() => {
    // After 1s, try acquiring token
    setTimeout(() => {
      // Retrieve token will set isLoading false on completion
      let keyStoreState = [
        {
          provider: "gitlab",
          type: "admin",
          profile: "gitlabmain",
          apikey: "-CUasfvMePjsZzEgBHw-",
        },
        {
          provider: "gitlab",
          type: "ci",
          profile: "gitlabCI",
          apikey: "-CUasfvMePjsZzEgBHw-",
        },
      ];
      // Bypass login. Straight to home screen
      loginStateDispatch({ type: "REGISTER", token: "-CUasfvMePjsZzEgBHw-" });
      setIsLoading(false);
    }, 1000);
    return () => {
      // cleanup
    };
  }, []);

  // Main return
  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      // same theme has to be provided for both contetxs
      <AuthContext.Provider value={authContext}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
            {/* Different page depending on userToken */}
            {userToken !== null ? true : true}
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
            >
              <Drawer.Screen name="Home" component={BottomTabScreen} />
              <Drawer.Screen name="Laila" component={BottomTabScreen} />
              <Drawer.Screen name="Welcome" component={WelcomeScreen} />
              <Drawer.Screen name="Others" component={TabOneScreen} />
            </Drawer.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
