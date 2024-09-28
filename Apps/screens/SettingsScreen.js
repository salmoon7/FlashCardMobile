import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { UserContext } from "../../api/ContextApi";
import { ThemeContext } from "../../api/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";

const SettingsScreen = ({ navigation }) => {
  const { user, setUser, updateProfileImage } = useContext(UserContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const [name, setName] = useState(user.name || "John Doe");
  const [email, setEmail] = useState(user.email || "example@example.com");
  const [bio, setBio] = useState(user.bio || "Add a short bio...");

  const [loading, setLoading] = useState(false); // Loading state for logout

  const [totalFlashcards, setTotalFlashcards] = useState(25);
  const [categoriesCreated, setCategoriesCreated] = useState(5);
  const [quizzesTaken, setQuizzesTaken] = useState(10);
  const [masteryProgress, setMasteryProgress] = useState(80);

  useEffect(() => {
    const loadThemePreference = async () => {
      const storedTheme = await AsyncStorage.getItem("themePreference");
      if (storedTheme) {
        toggleTheme(storedTheme === "dark");
      }
    };
    loadThemePreference();
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImageUri = result.assets[0].uri;
      updateProfileImage(newImageUri);
      setUser({ ...user, profileImage: newImageUri });
      await AsyncStorage.setItem("profileImage", newImageUri);
    }
  };

  const handleSaveChanges = async () => {
    setUser({ ...user, name, email, bio });
    Alert.alert("Changes saved!");
  };

  const handleLogout = async () => {
    setLoading(true); // Start loading indicator
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        const response = await fetch(
          "https://flashcard-klqk.onrender.com/api/user/logout",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          Alert.alert("Success", result.message);
          await AsyncStorage.removeItem("userToken");
          navigation.navigate("Login");
        } else {
          Alert.alert("Error", "Failed to log out");
        }
      } else {
        Alert.alert("Error", "No token found");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "An error occurred while logging out");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const chartData = {
    labels: ["Flashcards", "Quizzes", "Categories"],
    datasets: [
      {
        data: [totalFlashcards, quizzesTaken, categoriesCreated],
      },
    ],
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDarkTheme ? "#1a1a2e" : "#f0f0f0" }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Profile Section */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={{ position: "relative" }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  marginBottom: 15,
                  borderWidth: 2,
                  borderColor: isDarkTheme ? "#fff" : "#333",
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: isDarkTheme ? "#333" : "#ccc",
                  borderRadius: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 40, color: isDarkTheme ? "#fff" : "#000" }}
                >
                  {name[0]}
                </Text>
              </View>
            )}
            <Ionicons
              name="add-circle"
              size={30}
              color="#480ca8"
              style={{ position: "absolute", bottom: 0, right: -10 }}
            />
          </TouchableOpacity>

          <TextInput
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              color: isDarkTheme ? "#fff" : "#000",
              marginBottom: 10,
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: isDarkTheme ? "#555" : "#ccc",
            }}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#888"
          />
          <TextInput
            style={{
              textAlign: "center",
              fontSize: 16,
              color: isDarkTheme ? "#ccc" : "#555",
              marginBottom: 10,
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: isDarkTheme ? "#555" : "#ccc",
            }}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#888"
          />
          <TextInput
            style={{
              padding: 12,
              backgroundColor: isDarkTheme ? "#333" : "#fff",
              color: isDarkTheme ? "#fff" : "#000",
              borderRadius: 12,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
            value={bio}
            onChangeText={setBio}
            placeholder="Short bio..."
            placeholderTextColor="#888"
            multiline
          />
        </View>

        {/* Centered Graph */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 15,
              color: isDarkTheme ? "#fff" : "#333",
              fontFamily: "Roboto-Bold",
            }}
          >
            Activity & Stats
          </Text>

          <BarChart
            data={chartData}
            width={Dimensions.get("window").width - 60}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#480ca8",
              backgroundGradientFrom: "#480ca8",
              backgroundGradientTo: "#5a67d8",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            verticalLabelRotation={30}
            style={{
              marginVertical: 10,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Dark Mode Switch */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text style={{ color: isDarkTheme ? "#fff" : "#000", fontSize: 16 }}>
            Dark Mode
          </Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} />
        </View>

        {/* Logout Button and Activity Indicator */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loading} // Disable button while loading
          style={{
            backgroundColor: loading ? "#ccc" : "#480ca8",
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" /> // Show spinner if loading
          ) : (
            <Text style={{ color: "#fff", fontSize: 18 }}>Log Out</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;
