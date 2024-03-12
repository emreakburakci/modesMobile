import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  error,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { authenticateCredentials } from "../utils/LoginUtils";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";

import { getTranslationResource } from "../utils/LanguageUtils";
import { useGlobalState } from "../GlobalStateContext";

const LoginScreen = ({ navigation }) => {
  const [identityNumber, setIdentityNumber] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Turkish");
  const { globalState, setLanguage, setGlobalIdentityNumber } =
    useGlobalState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  globalState.language = selectedLanguage;
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //Component values shown to the user should be taken from translations object in all screens
  let translations = getTranslationResource(globalState.language);
  useEffect(() => {
    // Update validation errors when language changes
    const updatedErrors = {
      identityNumber: !identityNumber
        ? translations.errorIdentityNumberRequired
        : errors.identityNumber,
      password: !password
        ? translations.errorPasswordRequired
        : password.length < 6
        ? translations.errorPasswordLength
        : errors.password,
    };

    setErrors(updatedErrors);
  }, [selectedLanguage]);

  useEffect(() => {
    // Trigger form validation when changes occures
    validateForm();
  }, [identityNumber, password]);

  useEffect(() => {
    // Clear inputs when the component mounts
    const unsubscribe = navigation.addListener("focus", () => {
      setIdentityNumber("");
      setPassword("");
    });

    return unsubscribe;
  }, [navigation]);

  const validateForm = () => {
    let errors = {};

    // Validate name field
    if (!identityNumber) {
      errors.identityNumber = translations.errorIdentityNumberRequired;
    }

    if (identityNumber) {
      if (!identityNumber.match("^[1-9]{1}[0-9]{9}[02468]{1}$")) {
        errors.identityNumber = translations.errorIdentityNumberInvalid;
      }
    }

    // Validate password field
    if (!password) {
      errors.password = translations.errorPasswordRequired;
    } else if (password.length < 6) {
      errors.password = translations.errorPasswordLength;
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleLogin = async () => {
    if (isFormValid) {
      const isAuthenticated = await authenticateCredentials(
        identityNumber,
        password
      );
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        Alert.alert(
          translations.loginSuccesfulTitle,
          "", //translations.loginSuccesfulMessage
          [
            {
              text: translations.alertOK,
              onPress: () => {
                globalState.identityNumberGlobal = identityNumber;
                navigation.navigate("Main");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // Handle invalid credentials
        Alert.alert(
          translations.invalidCredentialsTitle,
          translations.invalidCredentialsMessage,
          [{ text: translations.alertOK }]
        );
      }
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);

    console.log("Selected language:", language);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/adLogo.png")} />
      <Text style={styles.heading}>{translations.AppName}</Text>
      {/*  <Text style={styles.heading}>{translations.login}</Text> */}

      <TextInput
        style={[
          styles.input,
          selectedLanguage === "Arabic" && { textAlign: "right" },
        ]}
        placeholder={translations.identityNumber}
        value={identityNumber}
        onChangeText={setIdentityNumber}
        keyboardType="numeric"
      />

      {/* <TextInput
        style={[
          styles.input,
          selectedLanguage === "Arabic" && { textAlign: "right" },
        ]}
        placeholder={translations.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      /> */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[
            {
              flex: 1,
              height: 50,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              paddingHorizontal: 10,
              marginBottom: 10,
            },
            selectedLanguage === "Arabic" && { textAlign: "right" },
          ]}
          placeholder={translations.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={toggleShowPassword}
          style={
            selectedLanguage === "Arabic"
              ? {
                  position: "absolute",
                  left: 10,
                  top: 10,
                  zIndex: 1, // Ensure the icon is above the text input
                }
              : {
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1, // Ensure the icon is above the text input
                }

            /*  {
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 1, // Ensure the icon is above the text input
          } */
          }
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#333"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      {Object.values(errors).map((error, index) => (
        <Text key={index} style={styles.error}>
          {error}
        </Text>
      ))}

      {Object.keys(errors).length === 0 && (
        <View style={styles.loginButton}>
          <Button
            color={globalState.buttonColor}
            title={translations.loginButton}
            onPress={handleLogin}
          />
        </View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.pickerLabel}>{translations.languagePickerLabel}</Text>

      <RNPickerSelect
        onValueChange={(value) => handleLanguageChange(value)}
        items={[
          { label: translations.Turkish, value: "Turkish" },
          { label: translations.English, value: "English" },
          { label: translations.Arabic, value: "Arabic" },
        ]}
        style={pickerSelectStyles}
        value={selectedLanguage}
      />
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
  header: {
    width: "100%",
    height: 60,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  heading: {
    fontSize: 24,
    marginTop: -70,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  pickerLabel: {
    marginTop: 10,
  },
  logo: {
    aspectRatio: 0.5,
    resizeMode: "contain",
  },
  loginButton: {
    marginTop: 15,
    width: "100%",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 10,
  },
});

export default LoginScreen;
