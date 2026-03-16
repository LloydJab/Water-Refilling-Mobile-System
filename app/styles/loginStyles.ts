// app/loginStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  loginBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "black",
    
    
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});