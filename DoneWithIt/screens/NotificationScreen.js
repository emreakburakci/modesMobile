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
import { getUnreadNotificationsCount } from "../utils/NotificationUtils";
import Toolbar from "../components/Toolbar";

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
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [isReadTab, setIsReadTab] = useState(false); // Initialize isReadTab state
  const [activeTab, setActiveTab] = useState("unread"); // Initialize activeTab state to 'unread'

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

  //NOTIFICATIONS SHOULD BE FETCHED IN THESE FUNCTIONS TO KEEP IT UP TO DATE
  const handleUnreadNotificationButton = async () => {
    setActiveTab("unread"); // Update activeTab state to 'unread'

    setIsReadTab(false); // Update isReadTab state to false
    fetchUnreadNotifications(); // Fetch notifications when the button is pressed
    const data = await getUnreadNotificationsCount(
      globalState.identityNumberGlobal
    );
    setUnreadNotificationsCount(data.count);
  };

  const handleReadNotificationButton = () => {
    setActiveTab("read"); // Update activeTab state to 'read'

    setIsReadTab(true); // Update isReadTab state to true
    fetchReadNotifications();
  };
  const bookIconColor = activeTab === "unread" ? "#0d5989" : "black";
  const bookOpenIconColor = activeTab === "read" ? "#0d5989" : "black";
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
        <Text style={styles.headerText}>{translations.notifications}</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleUnreadNotificationButton}
        >
          <Feather
            name="book"
            size={24}
            style={[styles.icon, { color: bookIconColor }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleReadNotificationButton}
        >
          <Feather
            name="book-open"
            size={24}
            style={[styles.icon, { color: bookOpenIconColor }]}
          />
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
      <Toolbar navigation={navigation} />
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
    marginTop: 100,
  },

  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#0d5989",
    position: "absolute",
    top: 0,
  },
  headerText: {
    color: "white",
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
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
    marginBottom: 10,
  },
  unreadTabTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default NotificationScreen;
