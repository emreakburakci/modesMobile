import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused hook
import { getUnreadNotificationsCount } from "../utils/NotificationUtils";

import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  getUnreadNotifications,
  getReadNotifications,
  setNotificationRead,
} from "../utils/NotificationUtils";
import { Dimensions } from "react-native";
const NotificationScreen = ({ navigation }) => {
  const { globalState, setLanguage } = useGlobalState();
  let translations = getTranslationResource(globalState.language);
  //const { notifications } = route.params;
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isReadTab, setIsReadTab] = useState(false); // Initialize isReadTab state

  useEffect(() => {
    fetchUnreadNotifications();
  }, [globalState.identityNumberGlobal]);

  const fetchUnreadNotifications = async () => {
    console.log("fetchUnreadNotifications runned");
    try {
      const identityNumber = globalState.identityNumberGlobal;
      const fetchedNotifications = await getUnreadNotifications(identityNumber);
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Handle error if needed
    }
  };
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
  useEffect(() => {
    fetchReadNotifications();
  }, [globalState.identityNumberGlobal]);

  const fetchReadNotifications = async () => {
    try {
      const identityNumber = globalState.identityNumberGlobal;
      const fetchedNotifications = await getReadNotifications(identityNumber);
      setReadNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Handle error if needed
    }
  };
  const handleHomeButton = () => {
    console.log("Navigate home from NotificationScreen");
    navigation.navigate("Main");
  };
  const handlelogoutButton = () => {
    globalState.identityNumberGlobal = "";
    navigation.navigate("Login");
  };

  //NOTIFICATIONS SHOULD BE FETCHED IN THESE FUNCTIONS TO KEEP IT UP TO DATE
  const handleUnreadNotificationButton = async () => {
    setIsReadTab(false); // Update isReadTab state to false
    fetchUnreadNotifications(); // Fetch notifications when the button is pressed
    const data = await getUnreadNotificationsCount(
      globalState.identityNumberGlobal
    );
    setUnreadNotificationsCount(data.count);
  };

  const handleReadNotificationButton = () => {
    setIsReadTab(true); // Update isReadTab state to true
    fetchReadNotifications();
  };

  const notificationPressed = (id) => {
    console.log("NOT. PRESSED", id);
  };
  const screenWidth = Dimensions.get("window").width;

  const handleAlertOKButton = async () => {
    const data = await getUnreadNotificationsCount(
      globalState.identityNumberGlobal
    );
    setUnreadNotificationsCount(data.count);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.modesLogo}
          source={require("../assets/modesText.png")}
        />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleUnreadNotificationButton}
        >
          <Feather name="book" size={24} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleReadNotificationButton}
        >
          <Feather name="book-open" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {isReadTab ? (
        <View style={[styles.tab2, { width: screenWidth }]}>
          <View style={styles.readTitle}>
            <Text style={styles.readTabTitle}>
              {translations.readNotifications}
            </Text>
          </View>

          {readNotifications.map((notification, index) => (
            <TouchableOpacity
              key={index}
              style={styles.notificationContainer}
              onPress={() => {
                console.log("Notification Pressed:", notification);
                Alert.alert(
                  notification.title,
                  notification.content,
                  [
                    {
                      text: translations.alertOK,
                      onPress: () => {
                        console.log(
                          "UserIdentity:",
                          globalState.identityNumberGlobal,
                          "not. Id:",
                          notification.notificationId
                        );
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text style={styles.notificationText}>{notification.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[styles.tab2, { width: screenWidth }]}>
          <Text style={styles.unreadTabTitle}>
            {translations.unreadNotifications}
          </Text>

          {notifications.map((notification, index) => (
            <TouchableOpacity
              key={index}
              style={styles.notificationContainer}
              onPress={() => {
                console.log("Notification Pressed:", notification);
                Alert.alert(
                  notification.title,
                  notification.content,
                  [
                    {
                      text: translations.alertOK,
                      onPress: async () => {
                        console.log(
                          "UserIdentity:",
                          globalState.identityNumberGlobal,
                          "not. Id:",
                          notification.notificationId
                        );

                        setNotificationRead(
                          globalState.identityNumberGlobal,
                          notification.notificationId
                        );

                        // Set notification as read if it's in the unread tab
                        if (!isReadTab) {
                          await setNotificationRead(
                            globalState.identityNumberGlobal,
                            notification.notificationId
                          );
                        }

                        // Refetch notifications based on the current tab
                        if (isReadTab) {
                          fetchReadNotifications();
                        } else {
                          fetchUnreadNotifications();
                        }

                        handleAlertOKButton();
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text style={styles.notificationText}>{notification.title}</Text>
            </TouchableOpacity>
          ))}
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
        <TouchableOpacity style={styles.toolbarButton}>
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
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    marginTop: -20,
  },

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
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
  notificationContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  readTabTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  unreadTabTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
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

export default NotificationScreen;
