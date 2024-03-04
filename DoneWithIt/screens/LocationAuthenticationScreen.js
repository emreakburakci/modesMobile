import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import {
  confirmLocation,
  getLocationFromIP,
} from "../utils/LocationAuthenticationUtils";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import axios from "axios";
import publicIP from "react-native-public-ip";

const LocationAuthenticationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [addressResponse, setAddressResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cellTowerLocation, setCellTowerLocation] = useState(null);
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
      // Location from GPS, Wi-Fi or cellular according to best accuracy among them.
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
  useEffect(() => {
    (async () => {
      let ipAddress = null;

      await publicIP()
        .then((ip) => {
          console.log("Public IP:", ip);
          ipAddress = ip;
        })
        .catch((error) => {
          console.log(error);
          // 'Unable to get IP address.'
        });

      // Your code here...
      axios
        .get(`http://ip-api.com/json/${ipAddress}`)
        .then(async (response) => {
          let address = await Location.reverseGeocodeAsync({
            latitude: response.data.lat,
            longitude: response.data.lon,
          });
          console.log("lat, lon:", response.data.lat, response.data.lon);
          console.log("ADDRESS:", address[0]);
          setCellTowerLocation(address[0].formattedAddress);
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
        });
      // Your code here...
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
      } else {
        Alert.alert(
          translations.locationAuthFailedTitle,
          translations.locationAuthFailedMessage,
          [
            {
              text: translations.alertOK,
              onPress: () => {
                navigation.navigate("Main");
              },
            },
          ],
          { cancelable: false }
        );
      }
    } else {
      console.log("Location is not available");
    }
  };

  const handleLogout = () => {
    globalState.identityNumberGlobal = null;
    globalState.isFaceConfirmed = false;
    globalState.isGSMConfirmed = false;
    globalState.isLocationConfirmed = false;
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
      <Text style={styles.title}>{translations.cellTowerLocation}</Text>
      <Text style={styles.address}>{cellTowerLocation}</Text>
      <View style={styles.buttonContainer}>
        <Button
          color="#0d5989"
          title={translations.confirmLocationButtonText}
          onPress={handleConfirmLocation}
        />
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
