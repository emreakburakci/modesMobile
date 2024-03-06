import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";

const IntroScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 2000);

    return () => clearTimeout(timer); // Clear the timeout if the component unmounts before the timeout completes
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0d5989" />

      <Image style={styles.logo} source={require("../assets/adLogo.png")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#0d5989",
  },

  logo: {
    aspectRatio: 0.5,
    resizeMode: "contain",
  },
});
export default IntroScreen;
