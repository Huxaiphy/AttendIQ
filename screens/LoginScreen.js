import React from "react";
import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

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
                alert("Login Successfull");
                navigation.replace("Dashboard");
            } catch (error) {
                alert(error.massage);
            }
        }
    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
            <TextInput
                placeholder="Email"
                style={{ borderWidth: 1, padding: 10, marginBottom: 15, }}
                />
                <TextInput
                placeholder="Password"
                secureTextEntry
                style={{ borderWidth: 1, padding: 10, marginBottom: 20, }}
                />
                
                <Button
                title="Login"
                onPress={() => navigation.navigate("Dashboard")}
                />
        </View>  

    );
}