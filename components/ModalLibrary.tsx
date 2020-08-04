import React, { useEffect, useState, useRef, useReducer, Reducer } from "react";
import { PickerModal } from "../components/PickerModal";
import {
  GetPrimaryGitlabToken,
  GetGitlabSavedTokens,
  SetPrimaryGitlabToken,
} from "../utils/appStorage";
import { Modal, StyleSheet, View, Text, Picker, Button } from "react-native";
import { ListProjects } from "../api/gitlab";
import AsyncStorage from "@react-native-community/async-storage";
import { IGitlabProject } from "../api/gitlab";
import {
  pipelineCardReducer,
  IPipelineCardAction,
  IPipelineCardState,
} from "../reducers/pipelineCardReducer";
import { IBuildCard } from "../types/app-types";

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
          showActivityIndicator={false}
        />
      ) : (
        <></>
      )}
    </>
  );
}

/** Modal for testing huge amount of entries. */
export function HundredValueModal({ isVisible, setIsVisible }: IModalBase) {
  const [ModalData, setModalData] = useState<string[]>([]);

  useEffect(() => {
    // Do not call these functions when the modal closes
    if (isVisible === true) {
      var foo: string[] = new Array(45); // create an empty array with length 45
      for (var i = 0; i < foo.length; i++) {
        foo[i] = "Number " + i.toString();
      }

      setModalData(foo);
    }
  }, [isVisible]);

  const onCloseCallback = () => setIsVisible(false);

  // Display modal, only if it should be visible
  return isVisible ? (
    <PickerModal
      visible={true}
      items={ModalData}
      title="Select profile to activate"
      onClose={onCloseCallback}
      onSelect={() => {}}
      showActivityIndicator={false}
    />
  ) : (
    <></>
  );
}

export function GitlabSelectProjectModal({
  isVisible,
  setIsVisible,
}: IModalBase) {
  const [ModalData, setModalData] = useState<string[]>([]);
  const [ShowLoadingScreen, setShowLoadingScreen] = useState(true);
  const [ProjectList, setProjectList] = useState<IGitlabProject[]>([]);
  const [state, dispatch] = useReducer<
    Reducer<IPipelineCardState, IPipelineCardAction>
  >(pipelineCardReducer, []);

  // <IPipelineCardState>

  useEffect(() => {
    // Do not call these functions when the modal closes
    if (isVisible === true) {
      console.log("Start...");

      setShowLoadingScreen(true);
      SetPrimaryGitlabToken({
        token: "-CUasfvMePjsZzEgBHw-",
        user_id: 3657483,
      });
      ListProjects().then(
        (res) => {
          setProjectList(res);
          // Sort objects by project slug
          res.sort((left, right) => (left.path > right.path ? 1 : -1));
          let data = res.map((elem) => elem.path);
          setModalData(data);
          setShowLoadingScreen(false);
        },
        (err) => {
          setShowLoadingScreen(false);
        }
      );
    }
  }, [isVisible]);

  // Called when the modal is dismissed
  const onCloseCallback = () => setIsVisible(false);

  // CAlled when the modal returns result
  const onSelectCallback = (selection: string) => {
    let match = ProjectList.find((ele) => ele.path === selection);
    if (match !== undefined) {
      console.log(match.path);
      dispatch({ type: "append", data: BuildCardGenerator_Gitlab(match) });
    }
  };

  // Display modal, only if it should be visible
  return isVisible ? (
    <PickerModal
      visible={true}
      items={ModalData}
      title="Select profile to activate"
      onClose={onCloseCallback}
      onSelect={onSelectCallback}
      showActivityIndicator={ShowLoadingScreen}
    />
  ) : (
    <></>
  );
}

/** Transforms /users/{userid}/projects enrty to build card format */
function BuildCardGenerator_Gitlab(data: IGitlabProject): IBuildCard {
  const { id, path } = data;
  console.log(data);

  return {
    provider: "gitlab",
    uid: 0,
    id: id,
    token: "-CUasfvMePjsZzEgBHw-",
    slug: path,
  };
}
