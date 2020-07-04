import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  Button,
  StatusBar,
  TextInput,
  Platform,
} from "react-native";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import TabOneScreen from "../screens/TabOneScreen";
import {
  useTheme, // Also available from other package
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  TouchableRipple,
  Text,
  IconButton,
  Switch,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper";
import { Status } from "../api/core";
import { getPipelineJobs } from "../api/jobs_gitlab";
// import Icon from "react-native-vector-icons/Ionicons";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import {
  getProjectPipelines,
  getPipeline,
  IPipelinesResponse,
  IPipeline,
} from "../api/pipelines_gitlab";
import { AuthContext } from "../components/Context";
// import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";

// Icons
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { log } from "react-native-reanimated";
import Navigation from "../navigation";
import Colors from "../constants/Colors";

interface ILoginScreenProps {
  navigation: any;
}
export default function LoginScreen(props: ILoginScreenProps) {
  const [SiteProvider, setSiteProvider] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const [data, setData] = React.useState({
    profileName: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const { signIn } = React.useContext(AuthContext);

  function loginHandle(id: string, pass: string) {
    console.log("Handling login...");
    signIn(id, pass);
  }

  function HandleUsernameChange(val: string) {
    console.log("Username is", val);

    if (val.length !== 0) {
      setData({
        ...data,
        profileName: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        profileName: val,
        check_textInputChange: false,
      });
    }
  }

  function HandlePasswordChange(val: string) {
    setData({
      ...data,
      password: val,
    });
  }

  function updateSecureTextEntry() {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  }
  return (
    <View style={styles.loginContainer}>
      {/* Check little space above app to see what changed... */}
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.sectionA}>
        <Text style={styles.text_header} accessibilityStates={[]}>
          Welcome, Debashish Patra !
        </Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={{ ...styles.footer, backgroundColor: "#fff" }}
      >
        <Text accessibilityStates={[]} style={styles.text_footer}>
          Provider
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="#05375a" />
          <TextInput
            placeholder="Select the provider (gitlab)"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => {
              HandleUsernameChange(val);
            }}
            onEndEditing={(e) => /* e.nativeEvent.text */ {}}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        <Text accessibilityStates={[]} style={styles.text_footer}>
          Email
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="#05375a" />
          <TextInput
            placeholder="Name of this profile / email"
            style={styles.textInput}
            autoCapitalize="none"
            onChange={(val) => {
              HandleUsernameChange(val.nativeEvent.text);
            }}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        <Text
          accessibilityStates={[]}
          style={[
            styles.text_footer,
            {
              marginTop: 24,
            },
          ]}
        >
          API Key
        </Text>
        <View style={styles.action}>
          <FontAwesome name="lock" size={20} color="#05375a" />
          <TextInput
            placeholder="API key (read notes about CI access)"
            style={styles.textInput}
            secureTextEntry={data.secureTextEntry ? true : false}
            autoCapitalize="none"
            onChange={(val) => {
              HandlePasswordChange(val.nativeEvent.text);
            }}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("SignUpScreen")}
          style={[
            styles.signIn,
            {
              borderColor: "#009387",
              borderWidth: 1,
              marginTop: 15,
            },
          ]}
        >
          <Text accessibilityStates={[]}>Sign In</Text>
        </TouchableOpacity>
      </Animatable.View>
      <Button
        title="Go to Details screen... again"
        onPress={() => {
          loginHandle("suvam0451", "sex");
        }}
      />
      <TouchableOpacity
        onPress={() => {
          loginHandle(data.profileName, data.password);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#009387",
    height: 164,
  },
  signIn: {},
  sectionA: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    height: 40,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
});
