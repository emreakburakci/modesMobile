import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import Toolbar from "../components/Toolbar";

const SettingsScreen = ({ navigation }) => {
  const { globalState, setLanguage } = useGlobalState();
  let translations = getTranslationResource(globalState.language);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{translations.settingsHeader}</Text>
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsText}>Ayarlar</Text>
      </View>

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

  settingsContent: {
    height: 100,
    justifyContent: "center",
    width: "100%",

    marginTop: 100,
  },
  settingsText: {
    fontSize: 20,
    color: "#333", // Adjust color according to your design
    fontFamily: "Roboto", // Use an appropriate font family
    lineHeight: 24, // Adjust line height for better readability
    textAlign: "center", // Align text as per your design
    // Add more styling properties such as letterSpacing, fontWeight, etc. for further customization
    marginRight: 10,
    marginLeft: 10,
  },
});

export default SettingsScreen;
