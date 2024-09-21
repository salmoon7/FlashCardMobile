import React, { useState, useContext } from "react";
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
import { UserContext } from "../../api/ContextApi";

const CreateFlashcardScreen = ({ navigation }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const handleCreateFlashcard = async () => {
    if (!question || !answer || !category) {
      Alert.alert("Error", "Please enter all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://flashcard-klqk.onrender.com/api/user/createflashcard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionText: question,
            answerText: answer,
            category,
            userId: user.id,
          }),
        }
      );

      const data = await response.json();
      console.log("Full response", data);

      if (response.ok) {
        Alert.alert("Success", "Flashcard created successfully!");

        setCategory("");
        setAnswer("");
        setQuestion("");

        navigation.navigate("HomeTabs", {
          screen: "MyFlashcards",
          params: { newFlashcard: data.question },
        });
      } else {
        Alert.alert("Creation Failed", data.message);
      }
    } catch (error) {
      console.error("Creation error", error);
      Alert.alert("Error", "An error occurred while creating the flashcard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Create Your Flashcard</Text>
      <Text style={styles.subtitle}>
        Add new questions and answers to your collection.
      </Text>

      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholderTextColor="#aaa"
        style={styles.input}
        placeholder="Enter Category"
      />

      <TextInput
        style={styles.input}
        placeholder="Question"
        placeholderTextColor="#aaa"
        onChangeText={setQuestion}
        value={question}
      />

      <TextInput
        style={styles.input}
        placeholder="Answer"
        placeholderTextColor="#aaa"
        onChangeText={setAnswer}
        value={answer}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateFlashcard}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Flashcard"}
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
    backgroundColor: "#f0f4ff",
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
    color: "#34495e",
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
    borderBottomWidth: 2,
    borderBottomColor: "#480ca8",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#480ca8",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    margin: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateFlashcardScreen;
