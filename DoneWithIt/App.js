import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import FaceAuthenticationScreen from "./screens/FaceAuthenticationScreen";
import GSMAuthenticationScreen from "./screens/GSMAuthenticationScreen";
import LocationAuthenticationScreen from "./screens/LocationAuthenticationScreen";
import AllConfirmationsSuccessfulScreen from "./screens/AllConfirmationsSuccessfulScreen";
import MainScreen from "./screens/MainScreen";
import ProfileInformationScreen from "./screens/ProfileInformationScreen";
import NotificationScreen from "./screens/NotificationScreen";

import { GlobalStateProvider } from "./GlobalStateContext";

const Stack = createStackNavigator();

const App = () => {
  return (
    <GlobalStateProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="FaceAuthentication"
            component={FaceAuthenticationScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="GSMAuthentication"
            component={GSMAuthenticationScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="LocationAuthentication"
            component={LocationAuthenticationScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="AllConfirmationsSuccessful"
            component={AllConfirmationsSuccessfulScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="ProfileInformation"
            component={ProfileInformationScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="Notification"
            component={NotificationScreen}
            options={{
              title: "",
              headerLeft: null,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalStateProvider>
  );
};

export default App;
