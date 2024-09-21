import React from "react";
import { View } from "react-native";

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFiller, { width: `${progress}%` }]} />
    </View>
  );
};

const styles = {
  progressBarContainer: {
    backgroundColor: "#E5E7EB",
    borderRadius: 9999,
    width: "100%",
    height: 12,
    overflow: "hidden",
  },
  progressBarFiller: {
    backgroundColor: "#6B46C1",
    height: "100%",
  },
};

export default ProgressBar;
