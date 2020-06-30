import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface ISidebarProps {}
interface ISidebarState {}

export default function Sidebar<ISidebarProps, ISidebarState>(
  props: ISidebarProps,
  state: ISidebarState
) {
  return (
    <ScrollView>
      {/* <Image /> */}
      <Text>Remote deployment</Text>
      <View style={{ flexDirection: "row" }}>
        <Text>Hustler</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  logo: {
    color: "#FFF",
    fontSize: 20,
  },
});
