import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Regular expression for password validation
const validationPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to validate password against the regex
  const validatePassword = (password) => validationPassword.test(password);

  const handleRegistration = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://flashcard-klqk.onrender.com/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();
      console.log("Full response data:", data);

      if (response.ok) {
        Alert.alert("Registration Successful", "You can now log in");

        const { token, username } = data;
        console.log("Token:", token);
        console.log("Username:", username);

        setUsername({ username });
        navigation.navigate("Login", { username });
      } else {
        Alert.alert("Registration Failed", data.message);
      }
    } catch (error) {
      console.error("Registration error", error);
      Alert.alert("Error", "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Start Mastering Concepts with Quizio!</Text>
      <Text style={styles.subtitle}>
        Create, Quiz, and Track Your Learning Progress
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        onChangeText={setUsername}
        value={username}
        className="border-b-2 border-primary p-2 w-full"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        className="border-b-2 border-primary p-2 w-full"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        className="border-b-2 border-primary p-2 w-full"
      />

      <View style={styles.passwordRequirements}>
        <Text
          style={[
            styles.requirement,
            { color: validatePassword(password) ? "green" : "red" },
          ]}
        >
          At least 8 characters
        </Text>
        <Text
          style={[
            styles.requirement,
            { color: /[a-z]/.test(password) ? "green" : "red" },
          ]}
        >
          Contains lowercase letter
        </Text>
        <Text
          style={[
            styles.requirement,
            { color: /[A-Z]/.test(password) ? "green" : "red" },
          ]}
        >
          Contains uppercase letter
        </Text>
        <Text
          style={[
            styles.requirement,
            { color: /\d/.test(password) ? "green" : "red" },
          ]}
        >
          Contains digit
        </Text>
        <Text
          style={[
            styles.requirement,
            { color: /[@$!%*?&]/.test(password) ? "green" : "red" },
          ]}
        >
          Contains special character
        </Text>
      </View>

      {/* Show Lottie animation when loading is true */}
      {loading ? (
        <ActivityIndicator size="large" color="#480ca8" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegistration}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text style={styles.switchTextBold}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    elevation: 2,
  },
  button: {
    backgroundColor: "#480ca8",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    color: "#7f8c8d",
    fontSize: 14,
    textAlign: "center",
  },
  switchTextBold: {
    color: "#3498db",
    fontWeight: "bold",
  },
  passwordRequirements: {
    marginBottom: 20,
  },
  requirement: {
    fontSize: 14,
    marginBottom: 5,
  },
  loadingAnimation: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default RegisterScreen;
