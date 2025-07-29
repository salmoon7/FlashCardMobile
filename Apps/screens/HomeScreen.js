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
  const { user, profileImage, chartData, setChartData } = useContext(UserContext);
  const userId = user.id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleMenus, setVisibleMenus] = useState({});

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://flashcard-klqk.onrender.com/api/user/categories/${userId}`);
      const data = await response.json();
      setCategories(data.categories || []);
      setLoading(false);

      setChartData((prevData) => ({
        ...prevData,
        totalFlashcards: data.categories?.length || 0,
        quizzesTaken: 0,
        categoriesCreated: data.categories?.length || 0,
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
    setVisibleMenus((prev) => ({ ...prev, [index]: true }));
  };

  const closeMenu = (index) => {
    setVisibleMenus((prev) => ({ ...prev, [index]: false }));
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
      <View style={styles.topSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {name.split(" ")[0]} 👋</Text>
            <Text style={styles.subGreeting}>Ready to learn something new?</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>
                  {name
                    .split(" ")
                    .map((n) => n.charAt(0).toUpperCase())
                    .join("")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Create Flashcard")}>
            <Ionicons name="add-circle-outline" size={28} color="#480ca8" />
            <Text style={styles.cardText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Flashcards")}>
            <Ionicons name="list-circle-outline" size={28} color="#480ca8" />
            <Text style={styles.cardText}>My Sets</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.bottomSection} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.progressHeader}>Your Categories</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#480ca8" style={{ marginTop: 40 }} />
        ) : categories.length > 0 ? (
          categories.map((category, index) => (
            <View key={index} style={styles.progressCard}>
              <View style={styles.categoryRow}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => navigateToFlashCardScreen(category.categoryName)}
                >
                  <Text style={styles.textTitle}>{category.categoryName}</Text>
                </TouchableOpacity>

                <Menu
                  visible={visibleMenus[index]}
                  onDismiss={() => closeMenu(index)}
                  anchor={
                    <TouchableOpacity onPress={() => openMenu(index)}>
                      <Ionicons name="ellipsis-vertical" size={20} color="#555" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item onPress={() => handleUpdate(category.categoryName)} title="Update" />
                  <Menu.Item onPress={() => handleDelete(category.categoryName)} title="Delete" />
                  <Divider />
                  <Menu.Item onPress={() => navigateToQuizScreen(category.categoryName)} title="Take Quiz" />
                </Menu>
              </View>

              <ProgressBar
                progress={
                  category.savedProgress || parseFloat(category.progress) || 0
                }
                color="#6200ee"
              />
              <Text style={styles.progressText}>
                {category.savedProgress
                  ? `${category.savedProgress.toFixed(2)}% completed`
                  : `${category.progress || 0}% completed`}
              </Text>
            </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  subGreeting: {
    fontSize: 14,
    color: "#d6c9f3",
    marginTop: 4,
  },
  initialsContainer: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  initials: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#480ca8",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    elevation: 4,
  },
  cardText: {
    marginTop: 8,
    fontWeight: "600",
    color: "#480ca8",
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
});
