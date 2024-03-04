import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
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
    // Fetch every 5 seconds when the screen is focused
    const interval = setInterval(() => {
      if (isFocused) {
        fetchUnreadNotifications();
      }
    }, globalState.notificationInterval);

    // Clean up interval on component unmount or when the screen loses focus
    return () => clearInterval(interval);
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
        <Text style={styles.headerText}>ADLİ KONTROL SİSTEMİ</Text>
        {/* <Image
          style={styles.modesLogo}
          source={require("../assets/modesText.png")}
        /> */}
      </View>

      {/* <View style={styles.content}>
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
      </View> */}
      <Image
        style={styles.bannerImage}
        source={require("../assets/lawyer.jpg")}
      ></Image>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={startConfirmation}>
            <Feather style={styles.buttonIcon} name="play"></Feather>

            <Text style={styles.buttonText}>
              {translations.startConfirmation}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={openProfileInformation}
          >
            <Feather style={styles.buttonIcon} name="info"></Feather>

            <Text style={styles.buttonText}>
              {translations.profileInformations}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 4</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 8</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}></View>
      </ScrollView>

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
  footer: {
    height: 0,
  },
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
    backgroundColor: "#0d5989",
  },
  headerText: {
    color: "white",
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 55, // Add paddingBottom to ensure space for the bottom toolbar
  },

  /* button: {
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
  }, */

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#EEEDEB",
    padding: 10,
    borderRadius: 10, // To make buttons square, set borderRadius to half of the desired width
    width: 150, // Set width for each button
    height: 170,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },

  buttonText: {
    color: "#3C3633",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
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
    backgroundColor: "#0d5989", // Background color of the toolbar
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
    color: "#fff",
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
  bannerImage: {
    aspectRatio: 0.5,
    resizeMode: "contain",
    height: "100%",
    marginBottom: -300,
    marginTop: -310,
  },
  buttonIcon: {
    fontSize: 70,
    color: "#B67352",
  },
});
export default MainScreen;
