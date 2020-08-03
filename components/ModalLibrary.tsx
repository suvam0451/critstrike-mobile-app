import React, { useEffect, useState, useRef } from "react";
import { PickerModal } from "../components/PickerModal";
import {
  GetPrimaryGitlabToken,
  GetGitlabSavedTokens,
} from "../utils/appStorage";
import { Modal, StyleSheet, View, Text, Picker, Button } from "react-native";

interface IModalBase {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

/** Modal for selecting gitlab profile. */
export function GitlabActiveProfileModal({
  isVisible,
  setIsVisible,
}: IModalBase) {
  const [ModalData, setModalData] = useState<string[]>([]);

  useEffect(() => {
    // Do not call these functions when the modal closes
    if (isVisible === true) {
      GetGitlabSavedTokens().then(
        (res) => {
          setModalData(res);
        },
        () => {
          setModalData([]);
        }
      );
    }
  }, [isVisible]);

  function onCloseCallback() {
    setIsVisible(false);
  }
  return (
    <>
      {isVisible ? (
        <PickerModal
          visible={true}
          items={ModalData}
          title="Select profile to activate"
          onClose={onCloseCallback}
          onSelect={() => {}}
        />
      ) : (
        <></>
      )}
    </>
  );
}
