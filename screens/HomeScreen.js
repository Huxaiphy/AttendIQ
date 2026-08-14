import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native"; 

export default function HomeScreen({ navigation }) {
    return(
        <LinearGradient
            colors={["#E8f5c9", "#9FA5D5", "#E8f5c9"]}
            start={{ x: 0, y: 0}}
            end={{ x: 0.5, y: 1}}
            style={styles.container}
        >
            <Text style={styles.title}>Welcome to AttendIQ</Text>
            <Text style={styles.subtitle}>A Mobile-Base Smart Attendance System Using Face Recognition</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dashboard")}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#cdf0f5",
    },
    button: {
        width: "75%",
        backgroundColor: "#256",
        color: "#fff",
        padding: 15,
        fontFamily: "Arial",
        borderRadius: 20,
        marginVertical: 10,
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1.25,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 29,
        color: "#256",
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#256",
        marginBottom: 20,
        textAlign: "center",
        paddingHorizontal: 20,
    },
}
)
