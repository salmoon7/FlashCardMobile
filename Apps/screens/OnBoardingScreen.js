import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const OnboardingScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/hero.png")} // Use an image as the background
      style={styles.container}
      resizeMode="cover" // Cover the whole screen
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Elevate Your Learning with Quizio!</Text>
        <Text style={styles.subtitle}>
          Create Flashcards, Take Quizzes, and Watch Your Knowledge Grow
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // Align items at the bottom
    padding: 20,
  },
  contentContainer: {
    marginBottom: 30, // Space from the bottom
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#6A0DC1", // Changed to white for better contrast
    textAlign: "left",
    fontFamily: "Arial", // Specify your desired font family
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6A0DC1", // Changed to white for better contrast
    textAlign: "left",
    marginBottom: 30,
    fontWeight: "bold",
    fontFamily: "Arial", // Specify your desired font family
  },
  button: {
    backgroundColor: "#480ca8",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  buttonText: {
    color: "#f5f5f5",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Arial", // Specify your desired font family
  },
});

export default OnboardingScreen;
