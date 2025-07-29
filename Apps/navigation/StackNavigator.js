import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoardingScreen from "../../Apps/screens/OnBoardingScreen";
import LoginScreen from "../../Apps/screens/LoginScreen";
import RegisterScreen from "../../Apps/screens/RegisterScreen";
import ForgotPasswordScreen from "../../Apps/screens/ForgotPasswordScreen";
import CategoryDetailScreen from "../../Apps/screens/CategoryDetailScreen";
import TabNavigators from "./TabNavigators";
import QuizScreen from "../../Apps/screens/QuizScreen";
import { UserContext } from "../../api/ContextApi";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { token, isLoading } = useContext(UserContext);
  const [initialRoute, setInitialRoute] = useState("OnBoarding");

  useEffect(() => {
    if (!isLoading) {
      setInitialRoute(token ? "HomeTabs" : "OnBoarding");
    }
  }, [token, isLoading]);

  if (isLoading) {
    // Show loading spinner while checking AsyncStorage token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#480ca8" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      {!token ? (
        <>
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={TabNavigators}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Details"
            component={CategoryDetailScreen}
            options={{
              headerShown: true,
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{
              headerShown: true,
              gestureEnabled: false,
              headerStyle: { backgroundColor: "#480ca8" },
              headerBackTitleVisible: false,
              headerTintColor: "#fff",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
