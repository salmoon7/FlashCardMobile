import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/flash.png")}
        style={styles.image}
        resizeMode="contain"
      />

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "40%",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#480ca8",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
