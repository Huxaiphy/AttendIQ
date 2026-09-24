{/*import React, { useState, useEffect, useRef } from "react";
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
      fetchStudents();

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
});*/}

import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert, TouchableOpacity } from "react-native";
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
  const [lastResult, setLastResult] = useState(null);

  const openCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setLastResult(null);
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

  const markAttendance = async (imageUri) => {
    try {
      const result = await recognizeFace(imageUri);
      console.log("Recognize result:", result);

      if (!result.matched) {
        return { status: "not_registered" };
      }

      const currentStudents = await fetchStudents();

      const matched = currentStudents.find(
        (s) => s.faceToken === result.matched_face_token
      );

      if (!matched) {
        return { status: "not_registered" };
      }

      const today = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();

      const q = query(
        collection(db, "attendance"),
        where("matricNumber", "==", matched.matricNumber),
        where("date", "==", today)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existing = snapshot.docs[0].data();
        return { status: "already_marked", student: matched, record: existing };
      }

      const record = {
        fullName: matched.fullName,
        matricNumber: matched.matricNumber,
        department: matched.department,
        status: "Present",
        date: today,
        time: time,
      };

      await addDoc(collection(db, "attendance"), record);

      fetchTodayAttendance();

      return { status: "success", student: matched, record };
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
      setLastResult({ type: "success", ...result.record });
    } else if (result.status === "already_marked") {
      setLastResult({ type: "already_marked", ...result.record });
    } else if (result.status === "not_registered") {
      setLastResult(null);
      Alert.alert("Not Registered", "This face was not recognized.");
    } else {
      setLastResult(null);
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

      {lastResult && (
        <View
          style={[
            styles.infoCard,
            lastResult.type === "already_marked" && styles.infoCardWarning,
          ]}
        >
          <Text style={styles.infoTitle}>
            {lastResult.type === "success" ? "Attendance Marked" : "Already Marked Today"}
          </Text>
          <Text style={styles.infoLine}>Name: {lastResult.fullName}</Text>
          <Text style={styles.infoLine}>Matric No: {lastResult.matricNumber}</Text>
          <Text style={styles.infoLine}>Department: {lastResult.department}</Text>
          <Text style={styles.infoLine}>Status: {lastResult.status}</Text>
          <Text style={styles.infoLine}>Date: {lastResult.date}</Text>
          <Text style={styles.infoLine}>Time: {lastResult.time}</Text>

          <TouchableOpacity onPress={() => setLastResult(null)} style={styles.dismissButton}>
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

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
  infoCard: {
    backgroundColor: "#dcfce7",
    width: "90%",
    padding: 18,
    marginTop: 20,
    borderRadius: 15,
    elevation: 4,
  },
  infoCardWarning: {
    backgroundColor: "#fef9c3",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111",
  },
  infoLine: {
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  dismissButton: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  dismissButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f0f0f0",
    width: "95%", padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5
  },
  name: {
    fontSize: 18,
    fontWeight: "bold"
  },
});