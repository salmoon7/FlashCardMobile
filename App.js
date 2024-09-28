import React from "react";
import { ThemeProvider } from "./api/ThemeContext";
import { Provider as PaperProvider } from "react-native-paper";
import StackNavigator from "./Apps/navigation/StackNavigator";
import { UserProvider } from "./api/ContextApi";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
