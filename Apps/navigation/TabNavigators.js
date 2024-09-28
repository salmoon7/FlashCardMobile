import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import FlashcardsScreen from "../screens/FlashcardsScreen";
import QuizScreen from "../screens/QuizScreen";
import CreateFlashCardScreen from "../screens/CreateFlashCardScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import AddButton from "../components/AddButton";
import CategoryScreen from "../screens/CategoryScreen";

const Tab = createBottomTabNavigator();
const focusedColor = "#480ca8";
const defaultColor = "#b3b3cc";

const TabNavigators = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          // Assign appropriate icons to each tab
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Flashcards") {
            iconName = "list-outline";
          } else if (route.name === "Create Flashcard") {
            iconName = "add-outline";
          } else if (route.name === "QuizCategory") {
            iconName = "help-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          }

          // Return the icon with conditional color based on focus state
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? focusedColor : defaultColor}
            />
          );
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
        },
        tabBarActiveTintColor: focusedColor,
        tabBarInactiveTintColor: defaultColor,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Flashcards" component={FlashcardsScreen} />
      <Tab.Screen
        name="Create Flashcard"
        component={CreateFlashCardScreen}
        options={{
          tabBarButton: (props) => (
            <AddButton {...props}>
              <Ionicons name="add" size={28} color={focusedColor} />
            </AddButton>
          ),
        }}
      />
      <Tab.Screen name="QuizCategory" component={CategoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigators;
