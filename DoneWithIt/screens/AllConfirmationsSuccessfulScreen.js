import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { saveConfirmationInfo } from "../utils/AllConfirmationsSuccessfulUtils";
import Toolbar from "../components/Toolbar";

const AllConfirmationsSuccessfulScreen = ({ navigation }) => {
  const { globalState, setLanguage } = useGlobalState();
  let translations = getTranslationResource(globalState.language);

  useEffect(() => {
    // Fetch unread notification count when the screen is focused
    const saveConfirmationData = async () => {
      const response = await saveConfirmationInfo(
        globalState.identityNumberGlobal
      );
      console.log("ALL CONFIRMATINS SUCCESSFULL", response);
    };
    if (isFocused) {
      saveConfirmationData();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{translations.AppName}</Text>
      </View>
      <View style={styles.contentContainer}>
        {globalState.isGSMConfirmed &&
          globalState.isFaceConfirmed &&
          globalState.isLocationConfirmed && (
            <View>
              <Text style={styles.allConfirmationsSuccessfulText}>
                {translations.allConfirmationsSuccessfulMessage}
              </Text>
              <Feather name="check-square" style={styles.checkIcon}></Feather>
            </View>
          )}
      </View>
      <Toolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Change to flex-start
    alignItems: "center",
  },

  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#0d5989",
  },
  headerText: {
    color: "white",
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  modesLogo: {
    width: "60%",
    aspectRatio: 1,
    resizeMode: "contain",
    marginTop: 20,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20, // Add some horizontal padding
  },
  confirmationsContainer: {
    alignItems: "center",
  },
  allConfirmationsSuccessfulText: {
    fontSize: 20,
    textAlign: "center", // Center the text horizontally
  },
  checkIcon: {
    fontSize: 60,
    color: "#87A922",
    marginTop: 10, // Add some space between text and icon
    textAlign: "center",
  },
});

export default AllConfirmationsSuccessfulScreen;
