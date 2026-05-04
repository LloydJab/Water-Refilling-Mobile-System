import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "./styles/loginStyles";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setErrors({ general: "All fields are required" });
      return;
    }

    try {
      const response = await fetch("http://172.20.10.3:8000/api/token/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Passing the token via router params (similar to web auth flow)
        router.push({
          pathname: "/dashboard",
          params: { token: data.access } 
        });
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.detail || "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ general: "Network error. Check server IP." });
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/loginpcbackground.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.loginBox}>
        <Text style={styles.title}>User Login</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          placeholderTextColor="black"
          onChangeText={(v) => handleInputChange("username", v)}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          placeholderTextColor="black"
          secureTextEntry
          onChangeText={(v) => handleInputChange("password", v)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {errors.general && <Text style={styles.error}>{errors.general}</Text>}
      </View>
    </ImageBackground>
  );
}