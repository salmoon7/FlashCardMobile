import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Switch,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { UserContext } from "../../api/ContextApi";
import { ThemeContext } from "../../api/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsScreen = ({ navigation }) => {
  const { user, setUser, updateProfileImage, chartData, logout, token } =
    useContext(UserContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const [name, setName] = useState(user.name || "John Doe");
  const [email, setEmail] = useState(user.email || "example@example.com");
  const [bio, setBio] = useState(user.bio || "Add a short bio...");
  const [loading, setLoading] = useState(false);

  // Load bio and profileImage from AsyncStorage (in case updated)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedProfileImage = await AsyncStorage.getItem("profileImage");
        const storedBio = await AsyncStorage.getItem("bio");

        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
          updateProfileImage(storedProfileImage);
          setUser((prev) => ({ ...prev, profileImage: storedProfileImage }));
        }

        if (storedBio) setBio(storedBio);
      } catch (e) {
        console.warn("Failed to load user data from storage:", e);
      }
    };
    loadUserData();
  }, []);

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newImageUri = result.assets[0].uri;
        updateProfileImage(newImageUri);
        setUser((prev) => ({ ...prev, profileImage: newImageUri }));
        setProfileImage(newImageUri);
        await AsyncStorage.setItem("profileImage", newImageUri);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to pick image.");
      console.error(e);
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Validation", "Name and Email cannot be empty");
      return;
    }

    setUser((prev) => ({ ...prev, name: name.trim(), email: email.trim(), bio }));
    try {
      await AsyncStorage.setItem("bio", bio);
      await AsyncStorage.setItem("userData", JSON.stringify({ ...user, name: name.trim(), email: email.trim(), bio }));
      Alert.alert("Success", "Changes saved!");
    } catch (e) {
      Alert.alert("Error", "Failed to save changes.");
      console.error(e);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (!token) {
        Alert.alert("Error", "No user logged in");
        setLoading(false);
        return;
      }

      // Call API logout
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
        await logout(); // Clear context and AsyncStorage
        navigation.replace("Login"); // Reset navigation stack
      } else {
        Alert.alert("Error", result.message || "Failed to logout");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during logout.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const backgroundColor = isDarkTheme ? "#121212" : "#f9f9f9";
  const textColor = isDarkTheme ? "#fff" : "#222";
  const inputBackground = isDarkTheme ? "#1f1f1f" : "#fff";
  const borderColor = isDarkTheme ? "#444" : "#ccc";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor, paddingTop: insets.top }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Profile Image */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Pressable
            onPress={handlePickImage}
            style={{ position: "relative", marginBottom: 20 }}
            android_ripple={{ color: "#888" }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 65,
                  borderWidth: 2,
                  borderColor: isDarkTheme ? "#bb86fc" : "#6200ee",
                }}
              />
            ) : (
              <View
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 65,
                  backgroundColor: isDarkTheme ? "#333" : "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 48, color: textColor }}>
                  {name[0] || "U"}
                </Text>
              </View>
            )}

            <Ionicons
              name="camera"
              size={32}
              color={isDarkTheme ? "#bb86fc" : "#6200ee"}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: backgroundColor,
                borderRadius: 20,
                padding: 2,
              }}
            />
          </Pressable>

          {/* Inputs */}
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            style={{
              width: "100%",
              fontSize: 22,
              fontWeight: "600",
              color: textColor,
              borderBottomWidth: 2,
              borderBottomColor: borderColor,
              marginBottom: 15,
              paddingVertical: 8,
              backgroundColor: inputBackground,
              borderRadius: 6,
            }}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: "100%",
              fontSize: 18,
              color: textColor,
              borderBottomWidth: 2,
              borderBottomColor: borderColor,
              marginBottom: 15,
              paddingVertical: 8,
              backgroundColor: inputBackground,
              borderRadius: 6,
            }}
          />

          <TextInput
            placeholder="Short bio..."
            placeholderTextColor="#888"
            value={bio}
            onChangeText={setBio}
            multiline
            style={{
              width: "100%",
              fontSize: 16,
              color: textColor,
              padding: 12,
              backgroundColor: inputBackground,
              borderRadius: 12,
              marginBottom: 25,
              minHeight: 80,
              textAlignVertical: "top",
            }}
          />

          <Pressable
            onPress={handleSaveChanges}
            style={({ pressed }) => ({
              backgroundColor: "#6200ee",
              paddingVertical: 14,
              paddingHorizontal: 30,
              borderRadius: 12,
              opacity: pressed ? 0.8 : 1,
              alignItems: "center",
              marginBottom: 30,
            })}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
              Save Changes
            </Text>
          </Pressable>
        </View>

        {/* Chart */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: textColor,
              marginBottom: 15,
            }}
          >
            Activity & Stats
          </Text>
          <BarChart
            data={{
              labels: ["Flashcards", "Categories"],
              datasets: [{ data: [chartData.totalFlashcards, chartData.categoriesCreated] }],
            }}
            width={Dimensions.get("window").width - 40}
            height={260}
            chartConfig={{
              backgroundGradientFrom: isDarkTheme ? "#121212" : "#fff",
              backgroundGradientTo: isDarkTheme ? "#1f1f1f" : "#eee",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              labelColor: (opacity = 1) => (isDarkTheme ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`),
              style: { borderRadius: 16 },
            }}
            style={{ borderRadius: 16, elevation: 3, shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 } }}
            verticalLabelRotation={30}
            fromZero
          />
        </View>

        {/* Dark Mode Toggle */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
            paddingHorizontal: 5,
          }}
        >
          <Text style={{ color: textColor, fontSize: 18, fontWeight: "600" }}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#6200ee" }}
            thumbColor={isDarkTheme ? "#bb86fc" : "#f4f3f4"}
          />
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: loading ? "#aaa" : "#6200ee",
            paddingVertical: 15,
            borderRadius: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            opacity: pressed ? 0.9 : 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            marginBottom: insets.bottom || 20,
          })}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
              Log Out
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;
