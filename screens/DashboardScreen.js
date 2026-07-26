import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DashboardScreen() {
return (
    <View style={styles.menuContainer}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to the AttendIQ Dashboard</Text>

            <TouchableOpacity 
    style={styles.card}
    onPress={() => navigation.navigate("Register")}
    >
    <Text style={styles.cardText}>Register Student</Text>
    </TouchableOpacity>

        <TouchableOpacity 
    style={styles.card}
    onPress={() => navigation.navigate("Attendance")}
    >
    <Text style={styles.cardText}>Take Attendance</Text>
    </TouchableOpacity>

        <TouchableOpacity 
    style={styles.card}
    onPress={() => navigation.navigate("Records")}
    >
    <Text style={styles.cardText}>Attendance Records</Text>
    </TouchableOpacity>

        <TouchableOpacity 
        style={styles.logout}
        onPress={async () => {
        await signOut(auth);
        navigation.replace("Login");}}>
    <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    subtitle: {
        marginTop: 28,
        fontSize: 16,
        color: "#555555",
        textAlign: "center",
        paddingHorizontal: 20,
    },
});   
