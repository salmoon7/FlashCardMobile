import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "1", // Example user ID
    name: "User",
    profileImage: null, // Initially no profile image
  });

  // Function to update profile image
  const updateProfileImage = (imageUri) => {
    setUser((prevState) => ({
      ...prevState,
      profileImage: imageUri, // Update only the profileImage
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};
