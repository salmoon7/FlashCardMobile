import React, { createContext, useState } from "react";

export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "1",
    name: "User",
    profileImage: null,
  });
  const [chartData, setChartData] = useState({
    totalFlashcards: 0,
    quizzesTaken: 0,
    categoriesCreated: 0,
  });

  const updateProfileImage = (newImageUri) => {
    setUser((prevUser) => ({
      ...prevUser,
      profileImage: newImageUri,
    }));
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, updateProfileImage, chartData, setChartData }}
    >
      {children}
    </UserContext.Provider>
  );
};
