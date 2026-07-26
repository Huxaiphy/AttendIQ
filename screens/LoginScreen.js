import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function LoginScreen({ navigation }) {
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