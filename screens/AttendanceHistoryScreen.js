import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
    
export default function AttendanceHistoryScreen() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const fetchAttendance = async () => {
        try{
            const querySnapshot = await getDocs(
                collection(db, "attendance")
            );
            
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAttendanceRecords(data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchAttendance();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance History</Text>
            <FlatList
            data={attendanceRecords}
            keyExtractor={(item) => 
                item.id
            }
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text> Name: {item.fullName}</Text>
                    <Text> Matric: {item.matricNumber}</Text>
                    <Text> Department: {item.department}</Text>
                    <Text> Status: {item.status}</Text>
                    <Text> Date: {item.date}</Text>
                    <Text> Time: {item.time}</Text>
                </View>
            )}
            />
        </View>
    );
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
     card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 3,
     },
});