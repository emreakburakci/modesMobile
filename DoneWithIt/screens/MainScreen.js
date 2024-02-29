import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import { getUserInformation } from "../utils/ProfileInfromationUtils";
import { getUnreadNotificationsCount } from "../utils/NotificationUtils";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook

const MainScreen = ({ navigation }) => {
  const { globalState } = useGlobalState();

  let translations = getTranslationResource(globalState.language);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const isFocused = useIsFocused(); // Check if the screen is focused

  useEffect(() => {
    // Fetch unread notification count when the screen is focused
    const fetchUnreadNotifications = async () => {
      const data = await getUnreadNotificationsCount(
        globalState.identityNumberGlobal
      );
      setUnreadNotificationsCount(data.count);
    };
    if (isFocused) {
      fetchUnreadNotifications();
    }
  }, [isFocused]);

  const startConfirmation = () => {
    navigation.navigate("FaceAuthentication");
  };

  const openProfileInformation = async () => {
    const user = await getUserInformation(globalState.identityNumberGlobal);
    navigation.navigate("ProfileInformation", { userInfo: user });
  };

  const handleHomeButton = () => {};
  const handlePowerButton = () => {
    globalState.identityNumberGlobal = "";
    navigation.navigate("Login");
  };
  const handleSettingsButton = () => {};
  const handleHelpButton = () => {};

  const handleNotificationButton = async () => {
    console.log("Handle Notification Button");

    navigation.navigate("Notification");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.modesLogo}
          source={require("../assets/modesText.png")}
        />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={startConfirmation}>
          <Text style={styles.buttonText}>
            {translations.startConfirmation}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={openProfileInformation}
        >
          <Text style={styles.buttonText}>
            {translations.profileInformations}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Button 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Button 4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Button 5</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleHomeButton}
        >
          <Feather name="home" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleHelpButton}
        >
          <Feather name="help-circle" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleNotificationButton}
        >
          <View style={styles.iconWithBadge}>
            <Feather name="bell" size={24} style={styles.icon} />
          </View>
          {unreadNotificationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleSettingsButton}
        >
          <Feather name="settings" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handlePowerButton}
        >
          <Feather name="power" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -100,
  },
  button: {
    backgroundColor: "#836FFF",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff", // Background color of the toolbar
    borderTopWidth: 1,
    borderTopColor: "#ccc", // Border color
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  toolbarButton: {
    flex: 1,
    alignItems: "center",
  },
  icon: {
    color: "#836FFF",
  },
  modesLogo: {
    width: "60%",
    aspectRatio: 1,
    resizeMode: "contain",
    marginTop: 20,
  },
  iconWithBadge: {
    position: "relative",
    width: 24,
    height: 24,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: 4,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
export default MainScreen;
