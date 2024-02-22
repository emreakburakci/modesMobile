import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import { Feather } from "@expo/vector-icons";
const AllConfirmationsSuccessfulScreen = ({ navigation }) => {
  const { globalState, setLanguage } = useGlobalState();
  let translations = getTranslationResource(globalState.language);
  const handleHomeButton = () => {
    navigation.navigate("Main");
  };
  const handlelogoutButton = () => {
    globalState.identityNumberGlobal = "";
    navigation.navigate("Login");
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
        <TouchableOpacity style={styles.toolbarButton}>
          <Feather name="folder" size={24} style={styles.icon} />
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
});

export default AllConfirmationsSuccessfulScreen;
