import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
} from "react-native-reanimated";
import Cards from "../components/Cards"; // Import your Cards component
import { SystemBars } from "react-native-bars";

const FlashcardsScreen = () => {
  const [newData, setNewData] = useState([]); // Store questions and answers here
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const animatedValue = useSharedValue(0);
  const MAX = 3;

  // Fetch data from API with error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://flashcard-klqk.onrender.com/api/user/QA/66e487bec13be6a254ec27ff/Banking"
        );
        const data = await response.json();
        setNewData(data.questions);
      } catch (error) {
        console.error("Error fetching data:", error);

        alert("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    if (animatedValue.value > currentIndex + 0.5) {
      runOnJS(setActivityIndex)(currentIndex + 1);
    } else {
      runOnJS(setActivityIndex)(currentIndex);
    }
    const opacity = interpolate(
      animatedValue.value,
      [currentIndex, currentIndex + 0.3, currentIndex + 0.8, currentIndex + 1],
      [1, 0, 0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacity,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <SystemBars animated={true} barStyle={"light-content"} />
        <View style={styles.cardContainer}>
          {newData.map((item, index) => {
            if (index > currentIndex + MAX || index < currentIndex) {
              return null;
            }
            return (
              <Cards
                newData={newData}
                setNewData={setNewData}
                maxVisibleItems={MAX}
                item={item}
                index={index}
                dataLength={newData.length}
                animatedValue={animatedValue}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                key={index}
              />
            );
          })}
        </View>
        <Text style={styles.text}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={[{ width: "100%" }, animatedStyle]}
          >
            {newData[activityIndex]?.answers.map((item, index) => (
              <Text key={index} style={styles.text}>
                {item.answerText}
              </Text>
            ))}
          </Animated.ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default FlashcardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContainer: {
    flex: 3 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    position: "relative",
    paddingHorizontal: 16,
  },
});
