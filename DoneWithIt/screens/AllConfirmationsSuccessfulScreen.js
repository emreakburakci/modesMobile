import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook
import { getUnreadNotificationsCount } from "../utils/NotificationUtils";
import { useEffect, useState } from "react";
const AllConfirmationsSuccessfulScreen = ({ navigation }) => {
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

    // Fetch every 5 seconds when the screen is focused
    const interval = setInterval(() => {
      if (isFocused) {
        fetchUnreadNotifications();
      }
    }, globalState.notificationInterval);

    // Clean up interval on component unmount or when the screen loses focus
    return () => clearInterval(interval);
  }, [isFocused]);

  const { globalState, setLanguage } = useGlobalState();
  let translations = getTranslationResource(globalState.language);
  const handleHomeButton = () => {
    navigation.navigate("Main");
  };
  const handlelogoutButton = () => {
    globalState.identityNumberGlobal = "";
    navigation.navigate("Login");
  };

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
      {globalState.isGSMConfirmed &&
        globalState.isFaceConfirmed &&
        globalState.isLocationConfirmed && (
          <View>
            <Text>{translations.allConfirmationsSuccessfulMessage}</Text>
          </View>
        )}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleHomeButton}
        >
          <Feather name="home" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton}>
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
        <TouchableOpacity style={styles.toolbarButton}>
          <Feather name="settings" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handlelogoutButton}
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
    justifyContent: "flex-start", // Change to flex-start
    alignItems: "center",
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
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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

export default AllConfirmationsSuccessfulScreen;
