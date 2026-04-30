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

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      fetch("http://127.0.0.1:8000/api/accounts/")
        .then((response) => response.json())
        .then((data) => {
          const match = data.find(
            (acc: any) =>
              acc.username === formData.username &&
              acc.password === formData.password
          );

          if (match) {
            router.push("/dashboard");
          } else {
            setErrors({ general: "Invalid username or password" });
          }
        })
        .catch((error) => {
          console.error(error);
          setErrors({ general: "Server error, please try again" });
        });
    } else {
      setErrors(newErrors);
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
          placeholder="Enter username"
          style={styles.input}
          placeholderTextColor={"black"}
          value={formData.username}
          onChangeText={(value) => handleInputChange("username", value)}
        />
        {errors.username && <Text style={styles.error}>{errors.username}</Text>}

        <TextInput
          placeholder="Enter password"
          style={styles.input}
          placeholderTextColor={"black"}
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {errors.general && <Text style={styles.error}>{errors.general}</Text>}
      </View>
    </ImageBackground>
  );
}
