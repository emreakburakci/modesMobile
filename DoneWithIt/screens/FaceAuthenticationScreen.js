import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
  Vibration,
} from "react-native";
import { Camera } from "expo-camera";
import { authenticateFace } from "../utils/FaceAuthenticationUtils";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";

const FaceAuthenticationScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true); // State to control camera activation
  const { globalState, setLanguage } = useGlobalState();
  const [message, setMessage] = useState("");
  const [isGreen, setIsGreen] = useState(false);
  const [isConfirmationStarted, setIsConfirmationStarted] = useState(false);

  const PHOTO_TAKE_INTERVAL = 4000;

  console.log(
    "FACE AUTHENTICATION SCREEN GLOBAL identityNumber:",
    globalState.identityNumberGlobal
  );

  //Component values shown to the user should be taken from translations object in all screens
  let translations = getTranslationResource(globalState.language);
  // Request camera permissions on component mount

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      setHasPermission(status === "granted");
      setMessage(translations.lookFront);
      setIsConfirmationStarted(false);
    })();
  }, []);
  let photoArray = [];
  const handleTakeFrontPicture = async () => {
    setIsConfirmationStarted(true);
    if (cameraRef) {
      await new Promise((resolve) => setTimeout(resolve, PHOTO_TAKE_INTERVAL));

      const photo = await cameraRef.takePictureAsync();
      photoArray[0] = photo;
      console.log(photo);
      Vibration.vibrate(); // Vibrate the device
      setMessage(translations.lookLeft);
      handleTakeLeftPicture();
    }
  };
  const handleTakeLeftPicture = async () => {
    if (cameraRef) {
      await new Promise((resolve) => setTimeout(resolve, PHOTO_TAKE_INTERVAL));

      const photo = await cameraRef.takePictureAsync();
      photoArray[1] = photo;

      console.log(photo);
      setMessage(translations.lookRight);

      Vibration.vibrate(); // Vibrate the device
      handleTakeRightPicture();
    }
  };
  const handleTakeRightPicture = async () => {
    if (cameraRef) {
      await new Promise((resolve) => setTimeout(resolve, PHOTO_TAKE_INTERVAL));

      const photo = await cameraRef.takePictureAsync();
      photoArray[2] = photo;

      console.log(photo);
      Vibration.vibrate(); // Vibrate the device
      setIsGreen(true);
      setMessage(translations.waitForFaceConfirmation);
      handleConfirmPhotos(photoArray);
    }
  };

  const handleConfirmPhotos = async (photoArray) => {
    //authenticateFace should send photo to the external face recognition service
    //if service confirms photo, app navigates to the GSMAuthentication screen

    console.log("handleConfirmPhotos runned");
    const isAuthenticated = await authenticateFace(
      globalState.identityNumberGlobal,
      photoArray
    );

    if (isAuthenticated) {
      globalState.isFaceConfirmed = true;
      Alert.alert(
        translations.faceAuthenticationSuccessfulTitle,
        translations.faceAuthenticationSuccessfulMessage,
        [
          {
            text: translations.alertOK,
            onPress: () => navigation.navigate("GSMAuthentication"),
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        translations.faceAuthenticationFailedTitle,
        translations.faceAuthenticationFailedMessage,
        [
          {
            text: translations.alertOK,
            onPress: handleBack,
          },
        ],
        { cancelable: false }
      );
    }
  };
  const handleBack = () => {
    setIsCameraActive(true);
    photoArray = [];
    setMessage(translations.lookFront);
    setIsConfirmationStarted(false);
    setIsGreen(false);
  };
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>{translations.noAccessToCamera}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>

      {isCameraActive ? (
        <View
          style={
            isGreen ? styles.cameraContainerGreen : styles.cameraContainerYellow
          }
        >
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.front}
            ref={(ref) => setCameraRef(ref)}
            playSoundOnCapture={false}
          />
        </View>
      ) : (
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo.uri }}
              style={styles.takenPhoto}
            />
          ))}
        </View>
      )}
      {!isCameraActive && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPhotos}
        >
          <Text style={styles.confirmButtonText}>
            {translations.confirmPhotos}
          </Text>
        </TouchableOpacity>
      )}
      {!isCameraActive && (
        <Button title={translations.backButton} onPress={handleBack} />
      )}
      {isCameraActive && !isConfirmationStarted && (
        <TouchableOpacity
          style={styles.startConfirmationButton}
          onPress={handleTakeFrontPicture}
        >
          <Text style={styles.startConfirmationButtonText}>
            {translations.startConfirmationButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainerYellow: {
    width: 350, // Adjust as needed
    height: 350, // Adjust as needed
    borderRadius: 175, // Half of the width or height makes it circular
    overflow: "hidden", // Clip content outside the border radius
    marginBottom: 0, // Height of the toolbar
    borderWidth: 6, // Border width
    borderColor: "#FFD154", // Border color
  },
  cameraContainerGreen: {
    width: 350, // Adjust as needed
    height: 350, // Adjust as needed
    borderRadius: 175, // Half of the width or height makes it circular
    overflow: "hidden", // Clip content outside the border radius
    marginBottom: 0, // Height of the toolbar
    borderWidth: 6, // Border width
    borderColor: "#95ED38", // Border color
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  startConfirmationButton: {
    backgroundColor: "#0d5989",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    position: "absolute",
    bottom: 60, // Adjust as needed
    alignSelf: "center",
  },
  startConfirmationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  takenPhoto: {
    width: 100,
    height: 100,
    margin: 5,
  },
  confirmButton: {
    backgroundColor: "#836FFF",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    backgroundColorcolor: "#836FFF",
  },
  message: {
    fontSize: 20,
    color: "#333", // Adjust color according to your design
    fontFamily: "Roboto", // Use an appropriate font family
    lineHeight: 24, // Adjust line height for better readability
    textAlign: "center", // Align text as per your design
    // Add more styling properties such as letterSpacing, fontWeight, etc. for further customization
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  messageContainer: {
    height: 90, // Adjust the height as needed
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: -60,
  },
});
export default FaceAuthenticationScreen;
