import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, Picker, TextInput } from "react-native";
import { color } from "react-native-reanimated";

import IonIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Divider } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import { IBuildCard, IVariable } from "../types/app-types";
import _ from "lodash";

interface Props {
  CardIdx: number;
  paramIdx: number;
}

const KeyValuePairField = ({ CardIdx, paramIdx }: Props) => {
  const [VariableName, setVariableName] = useState<string | undefined>();
  const [VariableValue, setVariableValue] = useState<string | undefined>();
  const valueRef = useRef<TextInput>(null);
  const [VariableNameValid, setVariableNameValid] = useState("red");
  const [LocalState, setLocalState] = useState<IVariable>({
    label: "",
    value: "",
    IEnum: [],
  });

  const ex = /^[A-Z0-9_]+$/;

  useEffect(() => {
    AsyncStorage.getItem("buildcards").then((res) => {
      if (res != null) {
        const yeet: IBuildCard[] = JSON.parse(res!);

        const target = _.find(yeet, (ele) => ele.uid == CardIdx);

        if (target && target.vars) {
          const { label, value } = target.vars[paramIdx];

          setLocalState(target.vars[paramIdx]);
          setVariableName(label);
          setVariableValue(value);
        }
      }
    });
    if (VariableName) {
      ex.test(VariableName)
        ? setVariableNameValid("green")
        : setVariableNameValid("red");
    }
    return () => {};
  }, []);

  function variableNameChanged(params: any) {
    const text = params.nativeEvent.text;

    console.log(ex.test(text));
    ex.test(text) ? setVariableNameValid("green") : setVariableNameValid("red");
  }
  function variableNameSubmitted(params: any) {
    console.log("Submitted...", params.nativeEvent.text);
  }
  function pickerValueChange(value: string, i: number) {
    console.log(valueRef.current);
  }
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.rowflex,
          {
            width: "100%",
            height: 48,
          },
        ]}
      >
        <View
          style={[
            styles.rowflex,
            {
              flexGrow: 1,
              marginVertical: 8,
            },
          ]}
        >
          <View
            style={[
              styles.rowflex,
              {
                paddingHorizontal: 0,
                flex: 4,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: VariableNameValid,
              },
            ]}
          >
            <IonIcon.Button
              name="md-key"
              style={{ width: 46, marginTop: -3 }}
              size={20}
              disabled={true}
              backgroundColor="transparent"
              color="green"
              onPress={() => {}}
            />
            <TextInput
              style={{ fontSize: 16, marginLeft: -12 }}
              autoCapitalize="characters"
              onChange={variableNameChanged}
              onEndEditing={variableNameSubmitted}
            >
              {VariableName}
            </TextInput>
          </View>
          <View
            style={[
              styles.rowflex,
              {
                paddingHorizontal: 6,
                flex: 5,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: VariableNameValid,
                marginLeft: 4,
              },
            ]}
          >
            <AntIcon.Button
              name="form"
              style={{ width: 46, marginTop: -3, marginLeft: -8 }}
              size={20}
              disabled={true}
              backgroundColor="transparent"
              color="green"
              onPress={() => {}}
            />
            <TextInput style={{ marginLeft: -8 }} ref={valueRef}>
              {VariableValue ? VariableValue : "NO VALUE"}
            </TextInput>
            {/* form */}
          </View>
        </View>
        <View>
          <Picker
            style={{ width: 40, height: 50 }}
            selectedValue={LocalState.IEnum ? LocalState.IEnum[0] : null}
            onValueChange={pickerValueChange}
            enabled={LocalState.IEnum ? true : false}
          >
            {LocalState.IEnum?.map((ele) => (
              <Picker.Item label={ele} value={ele} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 42,
  },

  rowflex: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 2,
  },
});
export default KeyValuePairField;
