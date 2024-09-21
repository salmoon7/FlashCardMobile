import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const Cards = ({
  item,
  index,
  currentIndex,
  setCurrentIndex,
  animatedValue,
  newData,
}) => {
  const onGestureEvent = (event) => {
    animatedValue.value = event.nativeEvent.translationX;
  };

  const handleSwipe = (event) => {
    const { velocity } = event.nativeEvent;

    if (velocity.x > 500) {
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + 1, newData.length - 1)
      );
    } else if (velocity.x < -500) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }

    animatedValue.value = withSpring(0);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value }],
  }));

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={handleSwipe}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.questionText}>{item.questionText}</Text>
          <View style={styles.answersContainer}>
            {item.answers.map((answer, answerIndex) => (
              <TouchableOpacity key={answerIndex} style={styles.answerButton}>
                <Text style={styles.answerText}>{answer.answerText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Cards;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  answersContainer: {
    marginBottom: 20,
  },
  answerButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginVertical: 5,
  },
  answerText: {
    color: "#fff",
  },
});
