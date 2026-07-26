import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";



export default function LoginScreen({ navigation }) {
    
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const login = async () => {
            if (!email || !password) {
                alert("Please enter email and password");
                return;
            }
            try{
                await signInWithEmailAndPassword(auth,email,password);
                alert("Login Successful");
                navigation.replace("Dashboard");
            } catch (error) {
                alert(error.message);
            }
        }
        return (
            <KeyboardAvoidingView
            style={{flex: 1}} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.container}>
                    <MaterialCommunityIcons name="account-circle" size={100} color="#0B6E99"/>
                    <TextInput
                     placeholder="Email" 
                     placeholderTextColor="gray"
                     style={styles.input}
                     value={email}
                     onChangeText={setEmail}
                     keyboardType="email-address"
                     autoCapitalize="none"
                     />
                     <TextInput
                     placeholder="Password"
                     placeholderTextColor="gray"
                     style={styles.input}
                     value={password}
                     onChangeText={setPassword}
                     secureTextEntry
                     />
                     <TouchableOpacity style={styles.button} onPress={login}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                    style={{ marginTop: 20 }}>
                        <Text style={{color: "#0B6E99",textAlign: "center",fontSize: 16,}}>Don't have an account? Create Account</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>  
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EAF7FA",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0B6E99",
        marginBottom: 25,
    },
    input: {
        width: "100%",
        height: 55,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#CCC",
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonText: {
        width: "100%",
        backgroundColor: "#0B6E99",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#073861",
        fontSize: 18,
        fontWeight: "bold"
    },
});