import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../components/ProgressBar";
import { Menu, Divider } from "react-native-paper";
import { UserContext } from "../../api/ContextApi"; // Import the UserContext
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const HomeScreen = ({ route, navigation }) => {
  const { name } = route.params || { name: "User" };
  const { user, profileImage, chartData, setChartData } =
    useContext(UserContext); // Get chartData from UserContext
  const userId = user.id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleMenus, setVisibleMenus] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://flashcard-klqk.onrender.com/api/user/categories/${userId}`
        );
        const data = await response.json();

        // Store categories and progress into state
        setCategories(data.categories);
        setLoading(false);

        // Optionally, update chartData based on backend if needed
        setChartData((prevData) => ({
          ...prevData,
          totalFlashcards: data.categories.length,
          quizzesTaken: 0, // Update this based on your logic
          categoriesCreated: data.categories.length,
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [userId, setChartData]);

  const openMenu = (index) => {
    setVisibleMenus((prevState) => ({
      ...prevState,
      [index]: true,
    }));
  };

  const closeMenu = (index) => {
    setVisibleMenus((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };

  const handleUpdate = (category) => {
    console.log("Update category", category);
  };

  const handleDelete = (category) => {
    console.log("Delete category", category);
  };

  const navigateToFlashCardScreen = (category) => {
    navigation.navigate("HomeTabs", {
      screen: "Flashcards",
      params: { category, userId },
    });
  };

  const navigateToQuizScreen = (category) => {
    navigation.navigate("HomeTabs", {
      screen: "Quiz",
      params: { category, userId },
    });
  };

  return (
    <View className="flex-1 bg-white flex">
      {/* Top section */}
      <View className="bg-primary h-[350px] w-full rounded-b-xl p-4 flex-col justify-between">
        <View className="flex flex-row justify-between items-center p-2">
          <Text style={styles.greeting}>Hi, {name}!</Text>
          <View style={styles.initialsContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>{name[0]}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Categories */}
        <View className="flex flex-col justify-center p-2">
          <Text className="text-white font-bold text-[24px] font-mono">
            Categories
          </Text>
          <Text className="text-purple-300 font-serif font-semibold">
            Pick a set to practice
          </Text>
        </View>

        {/* Add and My Flashcards Buttons */}
        <View className="flex flex-row m-auto space-x-8">
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Create Flashcard")}
          >
            <Ionicons name="add-circle-outline" size={32} color="#480ca8" />
            <Text style={styles.cardText}>Add Flashcard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Flashcards")}
          >
            <Ionicons name="list-circle-outline" size={32} color="#480ca8" />
            <Text style={styles.cardText}>My Flashcards</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom section to display categories */}
      <View className="flex-1 p-4">
        <Text className="text-xl font-bold mb-4">Progress</Text>
        <ScrollView className="space-y-4" showsVerticalScrollIndicator="false">
          {loading ? (
            <ActivityIndicator size="large" color="#480ca8" />
          ) : categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.progressCard}
                onPress={() => navigateToFlashCardScreen(category.categoryName)}
              >
                <View className="flex-row justify-between items-center">
                  {/* Display the category name */}
                  <Text style={styles.categoryTitle}>
                    {category.categoryName}
                  </Text>

                  {/* 3 Dots Menu */}
                  <Menu
                    visible={visibleMenus[index]}
                    onDismiss={() => closeMenu(index)}
                    anchor={
                      <TouchableOpacity onPress={() => openMenu(index)}>
                        <Ionicons
                          name="ellipsis-vertical"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item
                      onPress={() => handleUpdate(category.categoryName)}
                      title="Update"
                    />
                    <Menu.Item
                      onPress={() => handleDelete(category.categoryName)}
                      title="Delete"
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() =>
                        navigateToQuizScreen(category.categoryName)
                      }
                      title="Take Quiz"
                    />
                  </Menu>
                </View>

                {/* Display the correct progress */}
                <ProgressBar
                  progress={
                    category.savedProgress || parseFloat(category.progress)
                  }
                  color="#6200ee"
                />
                <Text>
                  {category.savedProgress
                    ? `${category.savedProgress.toFixed(2)}%`
                    : `${category.progress}%`}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <LottieView
                source={require("../../util/create.json")}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
              <Text style={styles.emptyText}>No flashcard yet</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  initials: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#480ca8",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    color: "white",
  },
  initialsContainer: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    width: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cardText: {
    marginTop: 5,
    fontWeight: "bold",
    color: "#480ca8",
  },
  progressCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  categoryTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
  },
});
