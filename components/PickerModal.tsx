import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, View, Text, Picker, Button } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";

interface IProps {
  visible: boolean;
  items: string[];
  title: string;
  onClose: () => void;
  onSelect: (value: string) => void;
  value?: string;
}

export function PickerModal(props: IProps) {
  let { visible, items, title, onClose, onSelect, value } = props;
  const [PickerValue, setPickerValue] = useState(items[0]);

  // Set initial value, if provided
  useEffect(() => {
    if (value) {
      setPickerValue(value);
    }
  }, [value]);

  const ICON_SIZE = 22;

  return (
    <Modal animated transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.extraSpace} onPress={onClose}>
          <View>
            <Text>Hello world</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.pickerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <AntIcon name="close" size={ICON_SIZE} color="red" />
            </TouchableOpacity>
            <Text style={styles.titleText}>{title || "Placeholder"}</Text>
            <AntIcon
              name="check"
              onPress={() => onSelect(PickerValue)}
              size={ICON_SIZE}
            />
          </View>

          <Picker
            selectedValue={PickerValue}
            onValueChange={(e) => {
              onClose();
              setPickerValue(e);
            }}
          >
            {items.map((elem) => (
              <Picker.Item value={elem} label={elem} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  //Taking full space and pushing to bottom
  extraSpace: {
    flexGrow: 1,
    width: "100%",
  },
  extraSpaceLittle: {
    height: "100%",
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    height: 200,
    width: "100%",
    backgroundColor: "white",
    flexGrow: 0,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  titleText: {
    fontSize: 18,
  },
});
