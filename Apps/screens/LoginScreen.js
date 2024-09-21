import React, { useState, useRef, useContext } from "react";
import { UserContext } from "../../api/ContextApi";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import LottieView from "lottie-react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const animation = useRef(null);
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://flashcard-klqk.onrender.com/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Check if `user` and `user.name` exist
        if (data.user && data.user.name) {
          setUser(data.user);
          const { name } = data.user;
          console.log("Username:", name);
          setLoading(false);

          navigation.navigate("HomeTabs", { screen: "Home", params: { name } });
        } else {
          console.error("User object or name property is missing.");
          Alert.alert("Login Failed", "User data is missing.");
          setLoading(false);
        }
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      console.error("Login error", error);

      Alert.alert("Error", "An error occurred during login.");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>
        Dive Back In and Continue Your Learning Journey!
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border-b-2 border-primary p-2 w-full"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        className="border-b-2 border-primary p-2 w-full"
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.switchText}>
            Don't have an account?{" "}
            <Text style={styles.switchTextBold}>Join Now</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <LottieView
          ref={animation}
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      )}
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
    color: "#480ca8",
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
    margin: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerLinks: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotPasswordText: {
    color: "#480ca8",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  switchText: {
    color: "#7f8c8d",
    fontSize: 14,
    textAlign: "center",
  },
  switchTextBold: {
    color: "#480ca8",
    fontWeight: "bold",
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
});

export default LoginScreen;
