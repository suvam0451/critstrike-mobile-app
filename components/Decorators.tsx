import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet } from "react-native";
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

interface IValueFieldProps {
  maxwidth: number;
  label: string;
  value: string | number;
}

export function ValueField(props: IValueFieldProps) {
  return (
    <View style={{ maxWidth: props.maxwidth }}>
      <View style={styles.valueField}>
        <Text accessibilityStates={[]} style={{ flex: 1, fontWeight: "bold" }}>
          {props.label}:{" "}
        </Text>
        <Text accessibilityStates={[]} style={{ flex: 1 }}>
          {props.value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  valueField: {
    display: "flex",
    height: 20,
    flexDirection: "row",
  },
});
