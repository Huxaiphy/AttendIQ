import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DashboardScreen() {
return (
    <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to the AttendIQ Dashboard</Text>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
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
