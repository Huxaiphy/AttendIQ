import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, } from "react-native"
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function RecordsScreen() {
    const [students, setStudents] = useState([]);
    const fetchStudents = async () => {
        try {
            const querySnapshot = await getDocs(
                collection(db, "students")
            );

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setStudents(data);
        } catch (error) {
            console.log(error);
        
        }
    };
    useEffect(() => {
        fetchStudents();
    },[]);

    const deleteStudent = async (id) => {
        try {
            await deleteDoc(doc(db, "students", id));
            
            alert("Student deleted successfully!");
            
            fetchStudents();
        } catch (error) {
            console.log(error);
            alert("Error deleting student");
            
        };
        
    }
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <FlatList data={students}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text>Name: {item.fullName}</Text>
                    <Text>Matric: {item.matricNumber}</Text>
                    <Text>Department: {item.department}</Text>

                    <TouchableOpacity
                    style={{ backgroundColor: "#e74c3c", padding: 8, borderRadius: 6, marginTop: 8, alignSelf: "flex-start"}}
                    onPress={() => deleteStudent(item.id)}
                    >
                    <Text style={{ color:"#fff"}}>Delete</Text>
                    </TouchableOpacity>
                </View>
                )}
            />                
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
});