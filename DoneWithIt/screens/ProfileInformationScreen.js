import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { getUnreadNotificationsCount } from "../utils/NotificationUtils";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook

import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import { getUserInformation } from "../utils/ProfileInfromationUtils";
import { Feather } from "@expo/vector-icons";

const ProfileInformationScreen = ({ navigation, route }) => {
  const { globalState, setLanguage } = useGlobalState();
  const { userInfo } = route.params;
  console.log("USER INFO:", userInfo);
  console.log("COUNTRY:", userInfo.country);
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
  const fetchData = () => {
    const user = getUserInformation(globalState.identityNumberGlobal);
    console.log(user);
  };
  const handleHomeButton = () => {
    navigation.navigate("Main");
  };
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
      <View style={styles.userInfoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.firstName}:</Text>
          <Text style={styles.value}>{userInfo.firstName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.lastName}:</Text>
          <Text style={styles.value}>{userInfo.lastName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.phoneNumber}:</Text>
          <Text style={styles.value}>{userInfo.phoneNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.email}:</Text>
          <Text style={styles.value}>{userInfo.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.country}:</Text>
          <Text style={styles.value}>{userInfo.country}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.region}:</Text>
          <Text style={styles.value}>{userInfo.region}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.subregion}:</Text>
          <Text style={styles.value}>{userInfo.subregion}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{translations.district}:</Text>
          <Text style={styles.value}>{userInfo.district}</Text>
        </View>
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
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 10,
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
  },
  toolbarButton: {
    flex: 1,
    alignItems: "center",
  },
  icon: {
    color: "#836FFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    backgroundColor: "#98ABEE",
    borderRadius: 10,
    padding: 5,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    marginLeft: 10,
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
export default ProfileInformationScreen;
