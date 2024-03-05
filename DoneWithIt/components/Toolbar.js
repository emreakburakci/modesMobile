import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useGlobalState } from "../GlobalStateContext";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook
import { getUnreadNotificationsCount } from "../utils/NotificationUtils";
import { useEffect, useState } from "react";

const Toolbar = ({ navigation }) => {
  const { globalState, setLanguage } = useGlobalState();
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
  const handleHomeButton = () => {
    navigation.navigate("Main");
  };
  const handlePowerButton = () => {
    globalState.identityNumberGlobal = "";
    globalState.isGSMConfirmedGlobal = false;
    globalState.isFaceConfirmedGlobal = false;
    globalState.isLocationConfirmedGlobal = false;
    navigation.navigate("Login");
  };

  const handleHelpButton = () => {
    navigation.navigate("Help");
  };

  const handleNotificationButton = () => {
    navigation.navigate("Notification");
  };
  const handleSettingsButton = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity style={styles.toolbarButton} onPress={handleHomeButton}>
        <Feather name="home" size={24} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.toolbarButton} onPress={handleHelpButton}>
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
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#0d5989",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
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
    color: "#fff",
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
    backgroundColor: "#FBA834",
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

export default Toolbar;
