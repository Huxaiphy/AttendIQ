import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DashboardScreen({navigation}) {
return (
    <View style={styles.menuContainer}>
    <View style={styles.cons}>
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
    style={styles.card}
    onPress={() => navigation.navigate("AttendanceHistory")}
    >
    <Text style={styles.cardText}>Attendance History</Text>
    </TouchableOpacity>
    </View>

        <TouchableOpacity 
        style={styles.logout}
        onPress={async () => {
        await signOut(auth);
        navigation.replace("Login");}}>
    <Text style={styles.logoutText}>Logout <MaterialCommunityIcons name="logout" size={24} color="red"></MaterialCommunityIcons></Text>
    </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#Eaf7FA",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0B6E99",
    },
    subtitle: {
        marginTop: 2,
        fontSize: 16,
        color: "#0B6E99",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    cardText: {
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 10,
        margin: 10,
        height: 50,
        fontSize: 15,
        fontWeight: "bold",
        borderWidth: 0.5,
        borderColor: "gray",    
    },
    cons: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    logoutText: {
        color: "red",
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 41,
        
    }

});   
