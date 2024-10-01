import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../components/ProgressBar";
import { Menu, Divider } from "react-native-paper";
import { UserContext } from "../../api/ContextApi";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const HomeScreen = ({ route, navigation }) => {
  const { name } = route.params || { name: "User" };
  const { user, profileImage, chartData, setChartData } =
    useContext(UserContext);
  const userId = user.id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleMenus, setVisibleMenus] = useState({});

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://flashcard-klqk.onrender.com/api/user/categories/${userId}`
      );
      const data = await response.json();

      setCategories(data.categories || []);
      setLoading(false);

      setChartData((prevData) => ({
        ...prevData,
        totalFlashcards: data.categories ? data.categories.length : 0,
        quizzesTaken: 0,
        categoriesCreated: data.categories ? data.categories.length : 0,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [userId])
  );

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
    <View style={styles.container}>
      {/* Top section */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {name}!</Text>
          <TouchableOpacity
            style={styles.initialsContainer}
            onPress={() => navigation.navigate("Settings")}
          >
            {user.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>
                  {name
                    .split(" ")
                    .map((n) => n[0].toUpperCase())
                    .join("")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>Categories</Text>
          <Text style={styles.categorySubtitle}>Pick a set to practice</Text>
        </View>

        {/* Add and My Flashcards Buttons */}
        <View style={styles.buttonContainer}>
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
      <View style={styles.bottomSection}>
        <Text style={styles.progressHeader}>Progress</Text>
        <ScrollView showsVerticalScrollIndicator="false">
          {loading ? (
            <ActivityIndicator size="large" color="#480ca8" />
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.progressCard}
                onPress={() => navigateToFlashCardScreen(category.categoryName)}
              >
                <View style={styles.categoryRow}>
                  {/* Display the category name */}
                  <Text style={styles.textTitle}>{category.categoryName}</Text>

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

                <ProgressBar
                  progress={
                    category.savedProgress || parseFloat(category.progress) || 0
                  }
                  color="#6200ee"
                />
                <Text>
                  {category.savedProgress
                    ? `${category.savedProgress.toFixed(2)}`
                    : `${category.progress || 0}`}
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
              <Text style={styles.emptyText}>No flashcards yet</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topSection: {
    backgroundColor: "#480ca8",
    height: 350,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 16,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
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
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#333",
  },
  categoryHeader: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  categorySubtitle: {
    color: "#d4c0e4",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 24,
    width: "40%",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#480ca8",
  },
  bottomSection: {
    flex: 1,
    padding: 16,
  },
  progressHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: "gray",
  },
});
