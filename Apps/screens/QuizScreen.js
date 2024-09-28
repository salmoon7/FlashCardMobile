import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "../components/ProgressBar";

// Replace with the actual userId and quizId
const userId = "66e487bec13be6a254ec27ff";
const quizId = "66ee8090bb069dfecfc660f0";
const category = "Backend";

const QuizScreen = () => {
  const navigation = useNavigation();

  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Fetch quiz questions when the component loads
  useEffect(() => {
    fetchQuizQuestion();
  }, []);

  const fetchQuizQuestion = async () => {
    try {
      const response = await fetch(
        `https://flashcard-klqk.onrender.com/api/user/quiz-question/${userId}/${category}`
      );
      const data = await response.json();
      if (response.ok) {
        setQuizData(data.questions); // Set the fetched questions
        setTotalQuestions(data.totalQuestions);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch questions");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching the quiz.");
    }
  };

  const handleSubmitAnswer = async () => {
    const currentQuestion = quizData[currentQuestionIndex].questionText;
    try {
      const response = await fetch(
        `https://flashcard-klqk.onrender.com/api/user/quiz-answer/${userId}/${quizId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userAnswer }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        // Handle if the answer is correct or wrong
        if (data.isCorrect) {
          setCorrectCount(correctCount + 1);
          setShowCorrectAnimation(true);

          setTimeout(() => {
            setShowCorrectAnimation(false);
            if (currentQuestionIndex < quizData.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
          }, 2000);
        } else {
          setShowWrongModal(true);
        }

        // Update progress
        setProgress(data.progress);
      } else {
        Alert.alert("Error", data.message || "Failed to submit answer");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the answer.");
    }

    setUserAnswer("");
  };

  const handleGoBackToStudy = () => {
    setShowWrongModal(false);
    navigation.navigate("Home");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Correct Answer Animation */}
        {showCorrectAnimation && (
          <Modal
            visible={showCorrectAnimation}
            transparent
            animationType="slide"
          >
            <View style={styles.lottieModalContainer}>
              <LottieView
                source={require("../../util/correct.json")}
                autoPlay
                loop={false}
                style={styles.lottieAnimation}
              />
            </View>
          </Modal>
        )}

        {/* Wrong Answer Modal */}
        <Modal
          visible={showWrongModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <LottieView
                source={require("../../util/wrong.json")}
                autoPlay
                loop={false}
                style={styles.lottieModalAnimation}
              />
              <Text style={styles.modalText}>
                Incorrect! Go back to flashcards to study more.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleGoBackToStudy}
              >
                <Text style={styles.modalButtonText}>Go Back to Study</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Question Section */}
        {quizData.length > 0 && (
          <View style={styles.questionContainer}>
            <Text style={styles.categoryText}>{category}</Text>
            <Text style={styles.questionText}>
              {quizData[currentQuestionIndex].questionText}
            </Text>
          </View>
        )}

        {/* Answer Input */}
        <TextInput
          style={styles.input}
          placeholder="Type your answer..."
          value={userAnswer}
          onChangeText={setUserAnswer}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitAnswer}
        >
          <Text style={styles.submitButtonText}>Submit Answer</Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Correct Count */}
        <Text style={styles.correctCountText}>
          Correct: {correctCount}/{totalQuestions}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  questionContainer: {
    backgroundColor: "#480ca8",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: Dimensions.get("window").width - 40,
  },
  categoryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    width: Dimensions.get("window").width - 40,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#5a67d8",
    padding: 15,
    borderRadius: 10,
    width: Dimensions.get("window").width - 40,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  correctCountText: {
    fontSize: 18,
    color: "#333",
    marginTop: 20,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  lottieModalAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#5a67d8",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  lottieModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default QuizScreen;
