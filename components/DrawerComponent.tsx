import React from "react";
import { View, StyleSheet } from "react-native";
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
  Switch,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper";
// import Icon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const _Drawer = createDrawerNavigator();

interface IDrawerProps {
  navigation: any;
}

// export default App;

// Sidebar content
export default function DrawerContent(props: IDrawerProps) {
  // Used to check theme
  const paperTheme = useTheme();

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  // const { signOut } = React.useContext(AuthContext);

  // Toggles light/dark theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <View style={styles.drawerContent}>
            {/* User icon and stuff */}
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Avatar.Image
                  source={{
                    uri:
                      "https://stikka.io/31-large_default/gitlab-logo-sticker.jpg",
                  }}
                  size={50}
                  accessibilityStates={[]}
                />
                <View style={{ marginLeft: 8 }}>
                  <Title style={styles.title}>Debashish Patra</Title>
                  <Caption style={styles.caption}>@suvam0451</Caption>
                </View>
              </View>
            </View>
            {/* Followers and following */}
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
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
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
              label="Laila"
              onPress={() => {
                props.navigation.navigate("Laila");
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
              label="Welcome"
              onPress={() => {
                props.navigation.navigate("Welcome");
              }}
            />
            <DrawerItem
              icon={(_props) => (
                <Icon
                  name="account-check-outline"
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
          {/* Dark theme */}
          <Drawer.Section title="Preferences" accessibilityStates={[]}>
            <TouchableRipple
              accessibilityStates={[]}
              onPress={() => toggleTheme()}
            >
              <View style={styles.preference}>
                <Text accessibilityStates={[]}>Dark theme</Text>
                <View pointerEvents="none">
                  <Switch accessibilityStates={[]} value={paperTheme.dark} />
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
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  caption: {
    fontSize: 14,
    lineHeight: 16,
  },
  drawerContent: {
    flex: 1,
  },
  drawerSection: {
    marginTop: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  row: {
    marginTop: 20,
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    marginTop: 0,
    marginBottom: -4,
    fontWeight: "bold",
  },
  userInfoSection: {
    paddingLeft: 20,
  },
});
