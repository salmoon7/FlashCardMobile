import { StyleSheet } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoardingScreen from "../../Apps/screens/OnBoardingScreen";
import LoginScreen from "../Apps/../screens/LoginScreen";
import RegisterScreen from "../../Apps/screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import TabNavigators from "./TabNavigators";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnBoarding"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="OnBoarding"
        component={OnBoardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="HomeTabs" component={TabNavigators} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
