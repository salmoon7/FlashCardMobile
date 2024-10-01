import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { UserContext } from "../../api/ContextApi";
import { TextInput as TextField } from "react-native-paper";

const CreateFlashcardScreen = ({ navigation }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(UserContext);

  const handleCreateFlashcard = async () => {
    if (!question.trim() || !answer.trim() || !category.trim()) {
      Alert.alert(
        "Input Error",
        "Question, Answer, and Category fields cannot be empty."
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://flashcard-klqk.onrender.com/api/user/createflashcard/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionText: question,
            answerText: answer,
            category,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setCategory("");
          setAnswer("");
          setQuestion("");
          setSuccess(false);

          // Navigate back to home and pass the new category
          navigation.navigate("HomeTabs", {
            screen: "Home",
            // params: { newCategory: category },
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Creation error", error);
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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require("../../util/done.json")}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
            <Text style={styles.successText}>
              Flashcard Created Successfully!
            </Text>
          </View>
        </View>
      </Modal>

      {!modalVisible && (
        <>
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

          <TextField
            mode="outlined"
            label="Answer"
            placeholder="Type your answer"
            value={answer}
            onChangeText={setAnswer}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateFlashcard}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Flashcard</Text>
            )}
          </TouchableOpacity>
        </>
      )}
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
  lottie: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 10,
    textAlign: "center",
  },
});

export default CreateFlashcardScreen;
