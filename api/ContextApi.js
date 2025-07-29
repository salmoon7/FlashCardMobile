// api/ContextApi.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initial user state with default values (can be overridden after loading)
  const [user, setUserState] = useState({
    id: "1",
    name: "User",
    profileImage: null,
    email: null,
    bio: null,
    // add other user fields here as needed
  });

  const [token, setToken] = useState(null);
  const [chartData, setChartData] = useState({
    totalFlashcards: 0,
    quizzesTaken: 0,
    categoriesCreated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user, token, profileImage, bio, chartData from AsyncStorage on app start
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedUser = await AsyncStorage.getItem("userData");
        const storedProfileImage = await AsyncStorage.getItem("profileImage");
        const storedBio = await AsyncStorage.getItem("bio");
        const storedChartData = await AsyncStorage.getItem("chartData");

        if (storedToken) setToken(storedToken);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserState((prevUser) => ({
            ...prevUser,
            ...parsedUser,
          }));
        }

        if (storedProfileImage) {
          setUserState((prevUser) => ({
            ...prevUser,
            profileImage: storedProfileImage,
          }));
        }

        if (storedBio) {
          setUserState((prevUser) => ({
            ...prevUser,
            bio: storedBio,
          }));
        }

        if (storedChartData) {
          setChartData(JSON.parse(storedChartData));
        }
      } catch (e) {
        console.error("Failed to load stored user data", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Save user and token to AsyncStorage on login or update
  const setUser = async (newUser) => {
    setUserState(newUser);

    try {
      if (newUser) {
        await AsyncStorage.setItem("userData", JSON.stringify(newUser));
      }

      if (newUser?.profileImage) {
        await AsyncStorage.setItem("profileImage", newUser.profileImage);
      }

      if (newUser?.bio) {
        await AsyncStorage.setItem("bio", newUser.bio);
      }
    } catch (e) {
      console.error("Error saving user data", e);
    }
  };

  // Login: set user and token, persist them
  const login = async (userData, authToken) => {
    setUserState(userData);
    setToken(authToken);

    try {
      if (userData) {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
      }
      if (authToken != null) {
        await AsyncStorage.setItem("userToken", authToken);
      }
      if (userData?.profileImage) {
        await AsyncStorage.setItem("profileImage", userData.profileImage);
      }
      if (userData?.bio) {
        await AsyncStorage.setItem("bio", userData.bio);
      }
    } catch (e) {
      console.error("Error saving login data", e);
    }
  };

  // Logout: clear all stored data and reset states
  const logout = async () => {
    setUserState({
      id: "1",
      name: "User",
      profileImage: null,
      email: null,
      bio: null,
    });
    setToken(null);
    setChartData({
      totalFlashcards: 0,
      quizzesTaken: 0,
      categoriesCreated: 0,
    });

    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("profileImage");
      await AsyncStorage.removeItem("bio");
      await AsyncStorage.removeItem("chartData");
    } catch (e) {
      console.error("Error clearing AsyncStorage on logout", e);
    }
  };

  // Update only profile image (called e.g. from Settings screen)
  const updateProfileImage = async (newImageUri) => {
    setUserState((prevUser) => {
      const updatedUser = { ...prevUser, profileImage: newImageUri };
      AsyncStorage.setItem("profileImage", newImageUri).catch((e) =>
        console.error("Failed to save profileImage", e)
      );
      AsyncStorage.setItem("userData", JSON.stringify(updatedUser)).catch((e) =>
        console.error("Failed to update userData with new profileImage", e)
      );
      return updatedUser;
    });
  };

  // Optionally: update chartData and persist it
  const updateChartData = async (newChartData) => {
    setChartData(newChartData);
    try {
      if (newChartData != null) {
        await AsyncStorage.setItem("chartData", JSON.stringify(newChartData));
      }
    } catch (e) {
      console.error("Failed to save chartData", e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        updateProfileImage,
        chartData,
        setChartData: updateChartData,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
