import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker";
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
        if (!fullName || !matricNumber || !department || level) {
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
                level,
                image,
                createdAt: new Date(),
            });
            alert("Student saved successfully!");
            setFullName("");
            setMatricNumber("");
            setDepartment("");
            setLevel("");
            setImage(null);
        } catch (error) {
            console.log(error);
            alert("Error saving student");
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
        {/*<TextInput
        placeholder="Department"
        placeholderTextColor="gray"
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
        />*/}

        <TextInput
        placeholder="Level"
        placeholderTextColor="gray"
        style={styles.input}
        value={level}
        onChangeText={setLevel}
        />

        
        <Text style={styles.label}>Department</Text>
        <View style={styles.pickerContainer}>
            <Picker selectedValue={department} onValueChange={(itemValue) => setDepartment(itemValue)}>
                <Picker.Item label="Select Department" value=""/>
                <Picker.Item label="Software Engineering" value="Software Engineering"/>
                <Picker.Item label="200L" value="Cyber Security"/>
                <Picker.Item label="Information Technology" value="Information Technology"/>
                <Picker.Item label="Computer Science" value="Computer Science"/>
                <Picker.Item label="Promt Engineering" value="Promt Engineering"/>
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