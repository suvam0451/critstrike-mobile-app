import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import TabOneScreen from "../screens/TabOneScreen";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  TouchableRipple,
  Text,
  Switch,
} from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const _Drawer = createDrawerNavigator();

interface IDrawerProps {
  navigation: any;
}

const App = () => {
  return (
    <NavigationContainer>
      <_Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <_Drawer.Screen name="Home" component={TabOneScreen} />
      </_Drawer.Navigator>
    </NavigationContainer>
  );
};

// export default App;

// Sidebar content
export default function DrawerContent(props: IDrawerProps) {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <View>
            <View>
              <Text accessibilityStates={[]}>This is a test</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Following</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Following</Caption>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection} accessibilityStates={[]}>
            <DrawerItem
              icon={(_props) => (
                <Icon
                  name="home-outline"
                  color={_props.color}
                  size={_props.size}
                />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={(_props) => (
                <Icon
                  name="home-outline"
                  color={_props.color}
                  size={_props.size}
                />
              )}
              label="Manage Pipelines"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={(_props) => (
                <Icon
                  name="home-outline"
                  color={_props.color}
                  size={_props.size}
                />
              )}
              label="History"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={(_props) => (
                <Icon
                  name="home-outline"
                  color={_props.color}
                  size={_props.size}
                />
              )}
              label="Manage API Keys"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
          </Drawer.Section>
          {/*  */}
          <Drawer.Section title="Preferences" accessibilityStates={[]}>
            <TouchableRipple
              accessibilityStates={[]}
              onPress={() => toggleTheme()}
            >
              <View style={styles.preference}>
                <Text accessibilityStates={[]}>Dark theme</Text>
                <View pointerEvents="none">
                  <Switch accessibilityStates={[]} value={isDarkTheme} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section
        style={styles.bottomDrawerSection}
        accessibilityStates={[]}
      >
        <DrawerItem
          icon={(_props) => (
            <Icon name="exit-to-app" color={_props.color} size={_props.size} />
          )}
          label="Sign Out"
          onPress={() => {}}
        />
      </Drawer.Section>
    </View>
  );
}

// Thanks for open-source styling from Mr. Pradip (Youtube -- Pradip Debnath)
const styles = StyleSheet.create({
  caption: {
    fontSize: 14,
    lineHeight: 16,
  },
  drawerContent: {
    flex: 1,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
});
