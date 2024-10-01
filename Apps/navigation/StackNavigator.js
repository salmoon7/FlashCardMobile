import { Text } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoardingScreen from "../../Apps/screens/OnBoardingScreen";
import LoginScreen from "../Apps/../screens/LoginScreen";
import RegisterScreen from "../../Apps/screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import CategoryDetailScreen from "../screens/CategoryDetailScreen";
import TabNavigators from "./TabNavigators";
import QuizScreen from "../screens/QuizScreen";

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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="Details"
        component={CategoryDetailScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigators}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          headerShown: true,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: "#480ca8",
          },
          headerBackTitleVisible: false,
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
