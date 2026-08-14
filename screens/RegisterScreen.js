import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../utils/cloudinary";
//import { FaceApi } from "../utils/faceApi";
import { enrollPerson } from "../utils/faceApi";
import { Image, TouchableOpacity } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function RegisterScreen() {

    const [fullName, setFullName] = useState("");
    const [matricNumber, setMatricNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("");
    const registerStudent = async () => {
        if (!fullName || !matricNumber || !department || !level || !image) {
            alert("Please fill all the fields !");
        return;
    } try {
        await addDoc (collection(db, "students"),
         {
            fullName,
            matricNumber,
            department,
            level,
        }
        );
         alert ("Student registered!");
    } catch (error) {
        console.log("error")
        alert ("Error registering student");
    }
};

    const [image, setImage] = useState(null);

    const pikerImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }
const saveStudents = async () => {
    // 1. Check required fields
    if (!fullName || !matricNumber || !department || !level || !image) {
        alert("Please fill all fields and select a photo.");
        return;
    }

    try {
        // 2. Upload image to Cloudinary
        console.log("Uploading image to Cloudinary...");

        const cloudinaryUrl = await uploadImageToCloudinary(image);

        if (!cloudinaryUrl) {
            alert("Image upload failed.");
            return;
        }

        console.log("Image uploaded:", cloudinaryUrl);

        console.log("Enrolling person in Luxand...");
        const luxandData = await enrollPerson(fullName, image);
        if (!luxandData) {
            alert("Failed to enroll person face in Luxand.");
            return;
        }

        // 3. Save student information + Cloudinary URL to Firestore
        await addDoc(collection(db, "students"), {
            fullName: fullName,
            matricNumber: matricNumber,
            department: department,
            level: level,
            image: cloudinaryUrl,
            createdAt: new Date(),
        });

        // 4. Success
        alert("Student saved successfully!");

        // 5. Clear the form
        setFullName("");
        setMatricNumber("");
        setDepartment("");
        setLevel("");
        setImage(null);

    } catch (error) {
        console.log("SAVE STUDENT ERROR:", error);
        alert("Error saving student: " + error.message);
    }
};

    return(
    <View style={styles.container}>
        <Text style={styles.title}>Register Student</Text>
        <TouchableOpacity onPress={pikerImage}>
            {image ? (
                <Image
                        source={{ uri: image }}
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: 50,
                            marginBottom: 10 }}
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
        <Text style={styles.label}>Department</Text>
        <View style={styles.pickerContainer}>
            <Picker selectedValue={department} onValueChange={(itemValue) => setDepartment(itemValue)}>
                <Picker.Item label="Select Department" value=""/>
                <Picker.Item label="Software Engineering" value="Software Engineering"/>
                <Picker.Item label="Cyber Security" value="Cyber Security"/>
                <Picker.Item label="Information Technology" value="Information Technology"/>
                <Picker.Item label="Computer Science" value="Computer Science"/>
                <Picker.Item label="Prompt Engineering" value="Prompt Engineering"/>
                <Picker.Item label="Artificial Intelligence" value="Artificial Intelligence"/>
                <Picker.Item label="Computer Engineering" value="Computer Engineering"/>
            </Picker>
        </View>
        
        <Text style={styles.label}>Level</Text>
        <View style={styles.pickerContainer}>
            <Picker selectedValue={level} onValueChange={(itemValue) => setLevel(itemValue)}>
                <Picker.Item label="Select Level" value=""/>
                <Picker.Item label="100L" value="100L"/>
                <Picker.Item label="200L" value="200L"/>
                <Picker.Item label="300L" value="300L"/>
                <Picker.Item label="400L" value="400L"/>
                </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={saveStudents}>
            <Text style={styles.buttonText}>Save Student</Text>
        </TouchableOpacity>
        
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">

        </ScrollView>
        
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
        width: 40,
        height: 40,
        borderRadius: 60,
        marginVertical: 15,
        justifyContent: "center", 
    },
    logo: {
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    pickerContainer: {
        width: "100%",
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderColor: "#D9D9D9",
        backgroundColor: "#fff"
    },
    label: {
        alignSelf: "flex-start",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    }
    
}
)