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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
  const [showBadgeModal, setShowBadgeModal] = useState(false); // For badge achievements

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
      } else {
        setProgress(0);
      }
    } catch (error) {
      console.error("Error loading quiz progress", error);
    }
  };

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

    if (!userAnswer) {
      Alert.alert("Input Error", "Answer cannot be empty.");
      return;
    }

    const correctAnswer = currentQuestion.answerText.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);

      const newProgress = (newCorrectAnswers / questions.length) * 100;
      setProgress(newProgress);

      setShowCorrectModal(true);

      if (newProgress >= 50 && newProgress < 75) {
        setShowBadgeModal(true); // Show badge at 50% progress
      }

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
    navigation.navigate("Details", { category: category });
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.categoryTitle}>{category.categoryName}</Text>
      <ProgressBar
        progress={progress / 100}
        color="#6200ee"
        style={styles.progressBar}
      />
      <View style={styles.circularDecoration} />

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : quizCompleted ? (
        <View style={styles.resultContainer}>
          {/* <LottieView
            source={badgeAnimation}
            autoPlay
            loop={false}
            style={styles.lottie}
          /> */}
          <Text style={styles.resultText}>Quiz Completed!</Text>
          <Text style={styles.resultText}>
            You got {correctAnswers}/{questions.length} correct.
          </Text>
          <Button title="Restart Quiz" onPress={handleQuizReset} />
          <Button
            title="Go back to Home"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {currentQuestion.questionText}
            </Text>
          </View>

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

      <Modal visible={showWrongModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <LottieView
            source={wrongAnimation}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
          <Text style={styles.modalText}>Oops! You made a mistake.</Text>

          <Button title="Review Flashcards" onPress={handleReviewFlashcards} />
          <Button title="Try Again" onPress={handleTryAgain} />
        </View>
      </Modal>

      <Modal visible={showBadgeModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Icon name="medal" size={50} color="#ffd700" />
          <Text style={styles.modalText}>
            Great! You've reached 50% progress!
          </Text>
          <Button title="Continue" onPress={() => setShowBadgeModal(false)} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#480ca8",
    position: "relative",
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "white",
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
  questionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 30,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
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
    color: "#000",
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
  curvedCircle: {
    position: "absolute",
    top: 20,
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "gold",
    zIndex: 999,
    elevation: 10,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
});

export default QuizScreen;
