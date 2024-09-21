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
    setUser(null);
    await AsyncStorage.removeItem("profileImage");
    await AsyncStorage.removeItem("themePreference");
    navigation.navigate("Login");
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
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={{ position: "relative" }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 15,
                }}
              />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: isDarkTheme ? "#333" : "#ccc",
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 36, color: isDarkTheme ? "#fff" : "#000" }}
                >
                  {name[0]}
                </Text>
              </View>
            )}
            <Ionicons
              name="add-circle"
              size={28}
              color="#480ca8"
              style={{ position: "absolute", bottom: 0, right: -10 }}
            />
          </TouchableOpacity>

          <TextInput
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: isDarkTheme ? "#fff" : "#000",
              marginBottom: 8,
              padding: 8,
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
              fontSize: 14,
              color: isDarkTheme ? "#ccc" : "#555",
              marginBottom: 15,
              padding: 8,
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
              padding: 10,
              backgroundColor: isDarkTheme ? "#333" : "#fff",
              color: isDarkTheme ? "#fff" : "#000",
              borderRadius: 8,
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

        <View style={{ marginBottom: 40, paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 15,
              color: isDarkTheme ? "#fff" : "#333",
              fontFamily: "Roboto-Bold", // Custom font
              borderBottomWidth: 1,
              borderBottomColor: isDarkTheme ? "#555" : "#ccc",
              paddingBottom: 10,
            }}
          >
            Activity & Stats
          </Text>

          <BarChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
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

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 18,
                color: isDarkTheme ? "#fff" : "#333",
                fontFamily: "Roboto-Regular",
                marginBottom: 8,
              }}
            >
              Total Flashcards Created: {totalFlashcards}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: isDarkTheme ? "#fff" : "#333",
                fontFamily: "Roboto-Regular",
                marginBottom: 8,
              }}
            >
              Categories Created: {categoriesCreated}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: isDarkTheme ? "#fff" : "#333",
                fontFamily: "Roboto-Regular",
                marginBottom: 8,
              }}
            >
              Quizzes Taken: {quizzesTaken}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: isDarkTheme ? "#fff" : "#333",
                fontFamily: "Roboto-Regular",
                marginBottom: 8,
              }}
            >
              Mastery Progress: {masteryProgress}%
            </Text>
          </View>
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

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#480ca8",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;
