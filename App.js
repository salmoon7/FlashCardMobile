import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import StackNavigator from "./Apps/navigation/StackNavigator";
import { UserProvider } from "./api/ContextApi";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { ThemeProvider } from "./api/ThemeContext";

export default function App() {
  return (
    <PaperProvider>
      <UserProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </UserProvider>
    </PaperProvider>
  );
}
