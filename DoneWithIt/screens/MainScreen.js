import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import { getUserInformation } from "../utils/ProfileInfromationUtils";
import { Feather } from "@expo/vector-icons";
import Toolbar from "../components/Toolbar";

const MainScreen = ({ navigation }) => {
  const { globalState } = useGlobalState();

  let translations = getTranslationResource(globalState.language);

  const startConfirmation = () => {
    navigation.navigate("FaceAuthentication");
  };

  const openProfileInformation = async () => {
    const user = await getUserInformation(globalState.identityNumberGlobal);
    navigation.navigate("ProfileInformation", { userInfo: user });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d5989" />

      <View style={styles.header}>
        <Text style={styles.headerText}>{translations.AppName}</Text>
      </View>
      <Image
        style={styles.banner}
        source={require("../assets/law.png")}
      ></Image>
      {/* <View style={{ marginTop: 100 }}></View> */}
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
            <Feather style={styles.buttonIcon} name="box"></Feather>

            <Text style={styles.buttonText}>Button 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Feather style={styles.buttonIcon} name="box"></Feather>

            <Text style={styles.buttonText}>Button 4</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Feather style={styles.buttonIcon} name="box"></Feather>

            <Text style={styles.buttonText}>Button 5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Feather style={styles.buttonIcon} name="box"></Feather>

            <Text style={styles.buttonText}>Button 6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Feather style={styles.buttonIcon} name="box"></Feather>

            <Text style={styles.buttonText}>Button 7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Feather style={styles.buttonIcon} name="box"></Feather>

            <Text style={styles.buttonText}>Button 8</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}></View>
      </ScrollView>
      <Toolbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  banner: {
    height: "14%",
    width: "100%",
    marginTop: 100,
  },
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
    position: "absolute",
    top: 0,
  },
  headerText: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 55, // Add paddingBottom to ensure space for the bottom toolbar
  },

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

  buttonIcon: {
    fontSize: 70,
    color: "#735f39",
  },
});
export default MainScreen;
