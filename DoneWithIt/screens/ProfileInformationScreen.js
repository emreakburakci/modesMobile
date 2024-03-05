import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useGlobalState } from "../GlobalStateContext";
import { getTranslationResource } from "../utils/LanguageUtils";
import Toolbar from "../components/Toolbar";

const ProfileInformationScreen = ({ navigation, route }) => {
  const { globalState, setLanguage } = useGlobalState();
  const { userInfo } = route.params;

  let translations = getTranslationResource(globalState.language);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {translations.profileInformations}
        </Text>
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={require("../assets/profile.png")}
          />
        </View>
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
      <Toolbar navigation={navigation} />
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
    backgroundColor: "#0d5989",
  },
  headerText: {
    color: "white",
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    backgroundColor: "#EEEDEB",
    borderRadius: 10,
    alignItems: "center", // Center vertically
    padding: 5,
    height: 40,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    marginLeft: 10,
  },
  profileImage: {
    aspectRatio: 0.15,
    resizeMode: "contain",
    marginBottom: -80,
    marginTop: -100,
  },
  profileImageContainer: {
    width: 120, // Adjust width and height according to your requirement
    height: 120,
    borderRadius: 60, // Half of width and height to make it a circle
    overflow: "hidden", // Clip content to the circular border
    marginBottom: 20,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
});
export default ProfileInformationScreen;
