import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import FlashcardsScreen from "../screens/FlashcardsScreen";
import QuizScreen from "../screens/QuizScreen";
import CreateFlashCardScreen from "../screens/CreateFlashCardScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import AddButton from "../components/AddButton";

const Tab = createBottomTabNavigator();
const color = "#480ca8";
r;
const TabNavigators = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Flashcards") {
            iconName = "list-outline";
          } else if (route.name === "Create Flashcard") {
            iconName = "add-outline";
          } else if (route.name === "Quiz") {
            iconName = "help-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          marginBottom: 2,
          paddingBottom: 5,
          backgroundColor: "white",
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
        },
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
              <Ionicons name="add" size={28} color="#480ca8" />
            </AddButton>
          ),
        }}
      />
      <Tab.Screen name="Quiz" component={QuizScreen} />

      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigators;
