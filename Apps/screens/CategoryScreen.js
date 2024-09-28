import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../api/ContextApi";
import ProgressBar from "../components/ProgressBar";

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setChartData } = useContext(UserContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://flashcard-klqk.onrender.com/api/user/categories/${user.id}`
      );
      const data = await response.json();
      if (response.ok) {
        await Promise.all(
          data.categories.map(async (category) => {
            const savedProgress = await AsyncStorage.getItem(
              `quiz-progress-${category.categoryName}`
            );
            if (savedProgress) {
              const { progress } = JSON.parse(savedProgress);
              category.savedProgress = progress;
            }
          })
        );
        setCategories(data.categories);

        const totalFlashcardsCount = data.categories.reduce(
          (acc, category) => acc + category.flashcard.length,
          0
        );
        const quizzesTaken = data.categories.reduce(
          (acc, category) => acc + (category.quizzesTaken || 0),
          0
        );

        setChartData({
          totalFlashcards: totalFlashcardsCount,
          quizzesTaken: quizzesTaken,
          categoriesCreated: data,
        });
      } else {
        Alert.alert("Error", data.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate("Quiz", { category: item })}
    >
      <Text style={styles.categoryText}>{item.categoryName}</Text>
      <Text style={styles.categoryProgress}>
        <ProgressBar progress={item.savedProgress || 0} />
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.categoryName}
          ListHeaderComponent={
            <Text style={styles.headerText}>
              Select a category and take the quiz!
            </Text>
          }
          renderItem={renderCategory}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  categoryItem: {
    padding: 20,
    backgroundColor: "#6200ee",
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6200ee",
  },
  categoryText: {
    fontSize: 18,
    color: "#fff",
  },
  categoryProgress: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
});

export default CategoryScreen;
