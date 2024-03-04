import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import * as Clipboard from "expo-clipboard";
import { authenticateGSM, clearGSMCode } from "../utils/GSMAuthenticationUtils";
import { Properties } from "../utils/Properties";

const GSMAuthenticationScreen = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { globalState, setLanguage } = useGlobalState();

  //Component values shown to the user should be taken from translations object in all screens
  let translations = getTranslationResource(globalState.language);

  useEffect(() => {
    if (generatedCode !== "") {
      console.log("Sending SMS with code:", generatedCode);
    }
  }, [generatedCode]);

  const handleSendSMS = async () => {
    const response = await fetch(
      "http://" +
        Properties.restSocket +
        "/requestGSMCode?identityNumber=" +
        globalState.identityNumberGlobal,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();

    setGeneratedCode(data.success);
    console.log("CODE FROM API: " + data.success);

    Alert.alert(
      translations.yourConfirmationCode,
      `${data.success}\n${translations.enterConfirmationCode}`,
      [
        {
          text: translations.alertCopy,
          onPress: () => {
            Clipboard.setStringAsync(data.success + "");
            // You can add a message to inform the user that the code has been copied if needed
            setIsCodeSent(true);
          },
        },
        {
          text: translations.alertOK,
          onPress: () => {
            setIsCodeSent(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleConfirmCode = async () => {
    console.log("HandleConfirmCode runned");
    let isGSMConfirmed = await authenticateGSM(
      globalState.identityNumberGlobal,
      code
    );
    console.log("IS GSM CONFIRMED", isGSMConfirmed);
    if (isGSMConfirmed.success) {
      globalState.isGSMConfirmed = true;
      Alert.alert(
        translations.GSMAuthenticationSuccessfulTitle,
        translations.GSMAuthenticationMessage,
        [
          {
            text: translations.alertOK,
            onPress: () => {
              clearGSMCode(globalState.identityNumberGlobal),
                navigation.navigate("LocationAuthentication");
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        translations.SMSNotConfirmedTitle,
        translations.SMSNotConfirmedMessage,
        [
          {
            text: translations.alertOK,
            onPress: () => navigation.navigate("GSMAuthentication"),
          },
        ],
        { cancelable: false }
      );
      setCode("");
      clearGSMCode(globalState.identityNumberGlobal);
      setIsCodeSent(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isCodeSent ? (
        <Button
          color="#0d5989"
          title={translations.GSMSendCodeButtonText}
          onPress={handleSendSMS}
          style={styles.button}
        />
      ) : (
        <>
          <Text style={styles.text}>{translations.GSMCodeSentMessage}</Text>
          <TextInput
            style={styles.input}
            placeholder={translations.enterCodePlaceholder}
            keyboardType="numeric"
            value={code}
            onChangeText={(text) => setCode(text)}
          />
          <View>
            <Button
              color="#0d5989"
              title={translations.confirmGSMCodeButtonText}
              onPress={handleConfirmCode}
              style={styles.button}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  button: {
    marginBottom: 10,
    width: "100%",
  },
});

export default GSMAuthenticationScreen;
