import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert } from "react-native";
import { db } from "../firebaseConfig";
import { recognizeFace } from "../utils/faceApi";
import { CameraView, useCameraPermissions } from "expo-camera";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

export default function AttendanceScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);

  const openCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowCamera(true);
  };

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(data);
      return data;
    } catch (error) {
      console.log("FETCH STUDENT ERROR:", error);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toLocaleDateString();
      const q = query(collection(db, "attendance"), where("date", "==", today));
      const snapshot = await getDocs(q);
      setTodayAttendance(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.log("FETCH TODAY ATTENDANCE ERROR:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, []);

  // Real face-recognition attendance flow
  const markAttendance = async (imageUri) => {
    try {
      const result = await recognizeFace(imageUri);
      console.log("Recognize result:", result);

      if (!result.matched) {
        return { status: "not_registered" };
      }

      const currentStudents = await 
      fetchStudent();

      console.log("Student from Firestore:", currentStudents);

      const matched = students.find(
        (s) => s.faceToken === result.matched_face_token
      );

      console.log("Matched student:", matched);

      if (!matched) {
        return { status: "not_registered" };
      }

      const today = new Date().toLocaleDateString();

      const q = query(
        collection(db, "attendance"),
        where("matricNumber", "==", matched.matricNumber),
        where("date", "==", today)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return { status: "already_marked", student: matched };
      }

      await addDoc(collection(db, "attendance"), {
        fullName: matched.fullName,
        matricNumber: matched.matricNumber,
        department: matched.department,
        status: "Present",
        date: today,
        time: new Date().toLocaleTimeString(),
      });

      fetchTodayAttendance();

      return { status: "success", student: matched };
    } catch (error) {
      console.log(error);
      return { status: "error" };
    }
  };

  const captureImage = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setShowCamera(false);

    const result = await markAttendance(photo.uri);

    if (result.status === "success") {
      Alert.alert("Attendance Marked", `${result.student.fullName} marked present.`);
    } else if (result.status === "already_marked") {
      Alert.alert("Already Marked", `${result.student.fullName} was already marked present today.`);
    } else if (result.status === "not_registered") {
      Alert.alert("Not Registered", "This face was not recognized.");
    } else {
      Alert.alert("Error", "No face detected — try again.");
    }
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />
        <View style={{ position: "absolute", bottom: 50, width: "100%", alignItems: "center" }}>
          <Button title="Capture" onPress={captureImage} />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <Text style={styles.subtitle}>Scan a student's face to mark attendance.</Text>
      <Button title="Scan Student Face" onPress={openCamera} />

      <FlatList
        data={todayAttendance}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.subtitle}>{item.matricNumber}</Text>
            <Text>{item.status} — {item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    backgroundColor: "#ffffff", 
    paddingTop: 40 
},
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#00f" 
},
  subtitle: { 
    marginTop: 10, 
    fontSize: 16, 
    color: "#00f", 
    textAlign: "center", 
    paddingHorizontal: 20 
},
  card: { 
    backgroundColor: "#f0f0f0", 
    width: "95%", padding: 15, 
    marginBottom: 15, 
    borderRadius: 15, 
    elevation: 5 },
  name: { 
    fontSize: 18, 
    fontWeight: "bold" 
},
});