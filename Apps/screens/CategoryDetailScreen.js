import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const CategoryDetailScreen = ({ route }) => {
  const { category } = route.params;
  const [flippedIndex, setFlippedIndex] = useState(null);
  const handleFlip = (index) => {
    setFlippedIndex(index === flippedIndex ? null : index);
  };

  const renderFlashcard = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleFlip(index)}>
      <View style={styles.card}>
        {flippedIndex === index ? (
          <View style={styles.answerContainer}>
            <FontAwesome name="lightbulb-o" size={24} color="#FFD700" />
            <Text style={styles.answerText}>
              {item.answerText || "Answer not available"}
            </Text>
          </View>
        ) : (
          <View style={styles.questionContainer}>
            <FontAwesome name="question" size={24} color="#00BFFF" />
            <Text style={styles.questionText}>
              {item.questionText || "Question not available"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.categoryName} Flashcards</Text>
      <FlatList
        data={category.questions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFlashcard}
        ListEmptyComponent={
          <Text style={styles.noQuestionsText}>No questions found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  questionText: {
    fontSize: 18,
    color: "#480ca8",
    marginLeft: 10,
  },
  answerText: {
    fontSize: 18,
    color: "#2ecc71",
    marginLeft: 10,
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  answerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  noQuestionsText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
    marginTop: 20,
  },
});

export default CategoryDetailScreen;
