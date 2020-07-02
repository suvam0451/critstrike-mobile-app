import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Button,
  Image,
  TouchableWithoutFeedback,
  Picker,
  Dimensions,
  ScrollView,
} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import Dropdown from "../components/Dropdown";
// import { StartCI } from "../api/gitlab";
import FormData from "form-data";
import fetch from "node-fetch";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Feather } from "@expo/vector-icons";

import {
  useDimensions,
  useDeviceOrientation,
} from "@react-native-community/hooks";

export default function TabOneScreen() {
  const [selectedWebsite, setSelectedWebsite] = useState("");
  let GITLAB_SECRET = "9d49e7571551ed40058b3dcfec135c";

  function StartCI() {
    console.log("So it begins...");

    let formData = new FormData();
    formData.append("token", GITLAB_SECRET);
    formData.append("ref", "master");
    fetch("https://gitlab.com/api/v4/projects/18627416/trigger/pipeline", {
      method: "POST",
      body: formData,
    }).then((res: any) => {
      return res.json();
    });
  }

  function hereToSayHello() {
    console.log("Hello!");
  }
  function hereToSayGoodbye() {
    console.log("Bye bye :)");
    let bb = StartCI();
    console.log(bb);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Tab One</Text>
        <TextInput>The filename is TabOneScreen</TextInput>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <TouchableWithoutFeedback onPress={() => console.log("Image tapped")}>
          <Image
            fadeDuration={200}
            source={{
              height: 300,
              width: 200,
              uri: "https://picsum.photos/200/300",
            }}
          />
        </TouchableWithoutFeedback>
        <Picker
          selectedValue={selectedWebsite}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedWebsite(itemValue)
          }
        >
          <Picker.Item label="XVideos" value="xvideos" />
          <Picker.Item label="JavBangers" value="javbangers" />
        </Picker>
        <Button title="Holler" onPress={hereToSayHello}>
          Title
        </Button>
        <Button title="Refresh" onPress={StartCI}>
          Title
        </Button>
        <Dropdown />
        <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // takes entire screen
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
