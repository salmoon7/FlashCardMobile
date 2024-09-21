import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

const AddButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity style={styles.customButtonContainer} onPress={onPress}>
      <View style={styles.customButton}>{children}</View>
    </TouchableOpacity>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    borderWidth: 4,

    borderTopColor: "#480ca8",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
