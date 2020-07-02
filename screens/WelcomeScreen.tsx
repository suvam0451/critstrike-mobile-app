import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Image,
  View,
  SafeAreaView,
  Button,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

function hereToSayHello() {}

function StartCI() {}

// rfc
export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground
          style={styles.background}
          source={require("../assets/damn.jpg")}
        ></ImageBackground>
        <View></View>
        {/* App section */}
        <View>
          <Button title="Holler" onPress={hereToSayHello}>
            Title
          </Button>
          <Button title="Refresh" onPress={StartCI}>
            Title
          </Button>
          <Image
            style={styles.gitlablogo}
            source={require("../assets/gitlab.png")}
          ></Image>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// rnss

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gitlablogo: {
    width: 124,
    height: 114,
    position: "relative",
    top: 0,
    marginTop: 100,
  },
  container: {
    flex: 1, // takes entire screen
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});

// resizeMode="contain" to resize image accordingly
