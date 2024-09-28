import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Menu, Divider } from "react-native-paper";
import { UserContext } from "../../api/ContextApi";
import { Ionicons } from "@expo/vector-icons";

const FlashcardsScreen = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [visibleMenus, setVisibleMenus] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://flashcard-klqk.onrender.com/api/user/categories/${user.id}`
      );
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      } else {
        Alert.alert("Error", data.message || "Failed to load categories");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = categories.filter((category) =>
        category.categoryName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  };

  const openMenu = (index) => {
    setVisibleMenus((prevState) => ({
      ...prevState,
      [index]: true,
    }));
  };

  const closeMenu = (index) => {
    setVisibleMenus((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };

  const handleUpdateCategory = (category) => {
    navigation.navigate("UpdateCategory", { category });
    closeMenu(category.id);
  };

  const handleDeleteCategory = async (categoryId) => {
    // Handle delete logic here
    closeMenu(categoryId);
  };

  const handleCategoryPress = (category) => {
    navigation.navigate("Details", { category });
  };

  const navigateToQuizScreen = (category) => {
    navigation.navigate("Quiz", { category });
    closeMenu(category.id);
  };

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item)}
      style={styles.categoryItem}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.categoryName}</Text>
        <Text style={styles.categoryInfo}>{item.totalQuestions} Questions</Text>
        <Menu
          visible={visibleMenus[index]}
          onDismiss={() => closeMenu(index)}
          anchor={
            <TouchableOpacity onPress={() => openMenu(index)}>
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => handleUpdateCategory(item)}
            title="Update"
          />
          <Menu.Item
            onPress={() => handleDeleteCategory(item.id)}
            title="Delete"
          />
          <Divider />
          <Menu.Item
            onPress={() => navigateToQuizScreen(item)}
            title="Take Quiz"
          />
        </Menu>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Flashcard Categories</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search categories..."
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#480ca8" />
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCategory}
          ListEmptyComponent={
            <Text style={styles.noCategoriesText}>No categories found</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  categoryItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#480ca8",
  },
  categoryInfo: {
    fontSize: 14,
    color: "#333",
  },
  noCategoriesText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
    marginTop: 20,
  },
});

export default FlashcardsScreen;
