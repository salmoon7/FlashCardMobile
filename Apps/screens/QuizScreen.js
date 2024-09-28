import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

import correctAnimation from "../../util/correct.json";
import wrongAnimation from "../../util/wrong.json";

const QuizScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);

  const questions = category.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    loadQuizProgress();
  }, []);

  const loadQuizProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(
        `quiz-progress-${category.categoryName}`
      );
      if (savedProgress !== null) {
        const { currentQuestionIndex, correctAnswers, progress } =
          JSON.parse(savedProgress);
        setCurrentQuestionIndex(currentQuestionIndex);
        setCorrectAnswers(correctAnswers);
        setProgress(progress);
      }
    } catch (error) {
      console.error("Error loading quiz progress", error);
    }
  };

  // Function to save quiz progress to AsyncStorage
  const saveQuizProgress = async () => {
    try {
      const progressData = {
        currentQuestionIndex,
        correctAnswers,
        progress,
      };
      await AsyncStorage.setItem(
        `quiz-progress-${category.categoryName}`,
        JSON.stringify(progressData)
      );
    } catch (error) {
      console.error("Error saving quiz progress", error);
    }
  };

  const handleAnswerSubmission = () => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = currentQuestion.answerText.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);

      const newProgress = ((correctAnswers + 1) / questions.length) * 100;
      setProgress(newProgress);
      setShowCorrectModal(true);
      if (currentQuestionIndex + 1 === questions.length) {
        setQuizCompleted(true);
        setShowCorrectModal(false);
      } else {
        setTimeout(() => {
          setShowCorrectModal(false);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswer("");
          saveQuizProgress();
        }, 1500);
      }
    } else {
      setShowWrongModal(true);
    }
  };

  const handleReviewFlashcards = () => {
    setShowWrongModal(false);
    navigation.navigate("Flashcards");
  };

  const handleTryAgain = () => {
    setShowWrongModal(false);
  };
  const handleQuizReset = async () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setProgress(0);
    await AsyncStorage.removeItem(`quiz-progress-${category.categoryName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category.categoryName}</Text>
      <ProgressBar
        progress={progress / 100}
        color="#6200ee"
        style={styles.progressBar}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : quizCompleted ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Quiz Completed!</Text>
          <Text style={styles.resultText}>
            You got {correctAnswers}/{questions.length} correct.
          </Text>
          <Button title="Restart Quiz" onPress={handleQuizReset} />
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.questionText}>
            {currentQuestion.questionText}
          </Text>

          <TextInput
            style={styles.answerInput}
            placeholder="Type your answer"
            value={answer}
            onChangeText={setAnswer}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAnswerSubmission}
          >
            <Text style={styles.buttonText}>Submit Answer</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Correct Answer Modal */}
      <Modal visible={showCorrectModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <LottieView
            source={correctAnimation}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
          <Text style={styles.modalText}>Correct!</Text>
        </View>
      </Modal>

      {/* Wrong Answer Modal */}
      <Modal visible={showWrongModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <LottieView
            source={wrongAnimation}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
          <Text style={styles.modalText}>Oops! You made a mistake.</Text>

          {/* Buttons for Reviewing Flashcards or Trying Again */}
          <Button title="Review Flashcards" onPress={handleReviewFlashcards} />
          <Button title="Try Again" onPress={handleTryAgain} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    marginVertical: 20,
  },
  quizContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#480ca8",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  answerInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    width: "80%",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Slightly transparent background
  },
  lottie: {
    width: 150,
    height: 150,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
});

export default QuizScreen;
