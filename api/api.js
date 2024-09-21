// api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://flashcard-klqk.onrender.com/api/user", // Replace with your backend URL
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    console.log("Retrieved token for request:", token); // Debugging line

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default api;
