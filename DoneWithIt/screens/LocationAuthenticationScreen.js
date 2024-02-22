import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { confirmLocation } from "../utils/LocationAuthenticationUtils";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";

const LocationAuthenticationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [addressResponse, setAddressResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { globalState, setLanguage } = useGlobalState();

  console.log(
    "LOCATION AUTHENTICATION SCREEN GLOBAL identityNumber:",
    globalState.identityNumberGlobal
  );

  //Component values shown to the user should be taken from translations object in all screens
  let translations = getTranslationResource(globalState.language);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(translations.locationPermissionDenined);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("LOCATION OBJ:", location);
      console.log("IS MOCKED:", location.mocked);
      if (location.mocked) {
        showMockedLocationAlert();
      }
      setLocation(location.coords);

      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setAddressResponse(addressResponse);
    })();
  }, []);

  const showMockedLocationAlert = () => {
    globalState.isLocationConfirmed = false;
    globalState.isGSMConfirmed = false;
    globalState.isFaceConfirmed = false;
    Alert.alert(
      translations.mockLocationTitle,
      translations.mockLocationMessage,
      [
        {
          text: translations.alertOK,
          onPress: () => {
            navigation.navigate("Main");
            return;
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleConfirmLocation = async () => {
    if (location) {
      let isLocationConfirmed = await confirmLocation(
        globalState.identityNumberGlobal,
        location,
        addressResponse
      );
      console.log("confirmLocation return value: ", isLocationConfirmed);
      if (isLocationConfirmed) {
        globalState.isLocationConfirmed = true;
        navigation.navigate("AllConfirmationsSuccessful");
      }
    } else {
      console.log("Location is not available");
    }
  };

  const handleLogout = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {translations.locationAuthenticationTitle}
      </Text>
      {addressResponse && (
        <Text style={styles.address}>
          {addressResponse[0].formattedAddress}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          color="#9383FF"
          title={translations.confirmLocationButtonText}
          onPress={handleConfirmLocation}
        />
        <View style={styles.logoutButton}>
          <Button
            title={translations.logout}
            onPress={handleLogout}
            color="#9383FF"
          />
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  address: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 10,
  },
});

export default LocationAuthenticationScreen;
