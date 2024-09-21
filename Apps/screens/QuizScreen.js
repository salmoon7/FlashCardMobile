import React, { useState } from "react";
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
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "../components/ProgressBar";

const QuizScreen = () => {
  const navigation = useNavigation();

  // Dummy data
  const dummyQuizData = {
    questions: [
      {
        _id: "1",
        question: "What is JSON?",
        category: "Backend",
        answers: ["JavaScript Object Notation"],
      },
      {
        _id: "2",
        question: "What is Django?",
        category: "Backend",
        answers: ["Python framework"],
      },
      {
        _id: "3",
        question: "What is Java?",
        category: "Backend",
        answers: ["Programming language"],
      },
    ],
  };

  const [quizData, setQuizData] = useState(dummyQuizData.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showWrongModal, setShowWrongModal] = useState(false);

  const handleSubmitAnswer = () => {
    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = currentQuestion.answers.includes(userAnswer);

    if (isCorrect) {
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

    setUserAnswer("");
  };

  const handleGoBackToStudy = () => {
    setShowWrongModal(false);
    navigation.navigate("Home");
  };

  const progress = ((currentQuestionIndex / quizData.length) * 100).toFixed(2);

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
                source={require("../../correct.json")}
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
                source={require("../../wrong.json")}
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
        <View style={styles.questionContainer}>
          <Text style={styles.categoryText}>
            {quizData[currentQuestionIndex].category}
          </Text>
          <Text style={styles.questionText}>
            {quizData[currentQuestionIndex].question}
          </Text>
        </View>

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
          Correct: {correctCount}/{quizData.length}
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
