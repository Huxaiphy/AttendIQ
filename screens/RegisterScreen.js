import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { Image, TouchableOpacity } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function RegisterScreen() {

    const [fullName, setFullName] = useState("");
    const [matricNumber, setMatricNumber] = useState("");
    const [department, setDepartment] = useState("");
    const registerStudent = async () => {
        if (!fullName || !matricNumber || !department) {
            alert("Please fill all the fields !");
        return;
    } try {
        await addDoc (collection(db, "students"),
         {
            fullName,
            matricNumber,
            department,
        }
        );
         alert ("Student registered!");
    } catch (error) {
        console.log("error")
        alert ("Error registering student");
    }
};

    /*const saveStudents = async () => {
        try {
            await addDoc(collection(db, "students"),{
                fullName,
                matricNumber,
                department,
                Image,
                createdAt: new Date(),
            });

            alert("Student saved successfully!");

            setFullName("");
            setMatricNumber("");
            setDepartment("");
        }
        catch (error) {
            console.log(error);
            alert("Error saving student");
        }
        
    };*/

    const [image, setImage] = useState(null);

    const pikerImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    }

    const saveStudents = async () => {
        console.log("Saving student:", fullName, matricNumber, department, image);
        try {
            await addDoc(collection(db, "students"), {
                fullName,
                matricNumber,
                department,
                image,
                createdAt: new Date(),
            });
            alert("Student saved successfully!");
            setFullName("");
            setMatricNumber("");
            setDepartment("");
            setImage(null);
        } catch (error) {
            console.log(error);
            alert("Error saving student");
        }
    };

    return(
        
    <View style={styles.container}>
       {/* <MaterialCommunityIcons name="clipboard-account" size={100} color="#256" style={{ marginVertical: 20 }}/>*/}
        <Text style={styles.title}>Register Student</Text>
        <TouchableOpacity onPress={pikerImage}>
            {image ? (
                <Image
                 source={{ uri: image }}
                  style={{
                     width: 200,
                      height: 200,
                       borderRadius: 100,
                        marginBottom: 20 }}
                        />
                  ) : (
                    <MaterialCommunityIcons
                    style={styles.logo}
                     name="account-circle"
                      size={50}
                       color="#256"
                        style={{ marginBottom: 20 }}
                    />
                  )}
                  <Image source={require("../assets/student.png")}
                  style={styles.photo}
                  />
        </TouchableOpacity>
        <TextInput
        placeholder="Full Name"
        placeholderTextColor="gray"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        />
        <TextInput
        placeholder="Matric Number"
        placeholderTextColor="gray"
        style={styles.input}
        value={matricNumber}
        onChangeText={setMatricNumber}
        />
        <TextInput
        placeholder="Department"
        placeholderTextColor="gray"
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
        />
       {/* <Button 
        title="Save Student"
        onPress={() => {
            saveStudents();
            console.log(fullName);
            console.log(matricNumber);
            console.log(department);
            alert(`Name: ${fullName}\nMatric: ${matricNumber}\nDepartment: ${department}`);
        }}
        />*/}
        <TouchableOpacity style={styles.button} onPress={saveStudents}>
            <Text style={styles.buttonText}>Save Student</Text>
        </TouchableOpacity>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            ></ScrollView>
        </KeyboardAvoidingView>
    </View>
    );
} 

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#Eaf7FA",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 40,
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
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderColor: "#D9D9D9",
        backgroundColor: "#fff"
    },
    button: {
        width: "100%",
        backgroundColor: "#0B6E99",
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 10,
        elevation: 3,
        alignItems: "center",
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginVertical: 15,
    },
    logo: {
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    
}
)