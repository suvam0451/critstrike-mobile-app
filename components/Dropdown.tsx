import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  Modal,
  ScrollView,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

interface Props {}
interface State {
  pickerSelection: string;
  pickerVisible: boolean;
}

class Dropdown extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pickerSelection: "none",
      pickerVisible: false,
    };
  }

  /** */
  setPickerValue(newValue: string) {
    console.log("Yeet");

    this.setState({
      pickerSelection: newValue,
    });

    this.togglePickerVisibility();
  }

  togglePickerVisibility() {
    this.setState({
      pickerVisible: !this.state.pickerVisible,
    });
  }

  //   state = {};
  pickerValues = [
    {
      titles: "chicken",
      value: "chicken",
    },
    {
      titles: "itza",
      value: "itza",
    },
    {
      titles: "echelon",
      value: "echelon",
    },
  ];

  render() {
    return (
      <Modal
        visible={this.state.pickerVisible}
        transparent={true}
        onRequestClose={() => console.log("Close request")}
      >
        {/* <ScrollView> */}
        <View
          style={{
            margin: 20,
            padding: 20,
            backgroundColor: "#efefef",
            bottom: 20,
            left: 20,
            right: 20,
            alignItems: "center",
            position: "absolute",
          }}
        >
          <Text style={{ fontWeight: "bold", alignItems: "center" }}>
            Pick a value
          </Text>
          {this.pickerValues.map((value, index) => {
            return (
              <TouchableHighlight
                key={index}
                style={{
                  paddingTop: 4,
                  paddingBottom: 4,
                  alignItems: "center",
                }}
                onPress={() => this.setPickerValue(value.titles)}
              >
                <Text style={{ color: "#000" }}>{value.titles}</Text>
              </TouchableHighlight>
            );
          })}

          <TouchableHighlight onPress={() => this.togglePickerVisibility()}>
            <Text style={{ color: "#999" }}>Cancel</Text>
          </TouchableHighlight>
        </View>
        {/* </ScrollView> */}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  ScrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
export default Dropdown;
