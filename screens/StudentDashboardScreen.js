import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function StudentDashboardScreen({ navigation }) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setStudentInfo(null);
        setAttendanceRecords([]);
        setLoading(false);
       return;
      }

      // Find the student record matching this logged-in user's email
      const studentsRef = collection(db, "students");
      const studentQuery = query(studentsRef, where("userId", "==", currentUser.uid));
      const studentSnap = await getDocs(studentQuery);

      if (studentSnap.empty) {
        setStudentInfo(null);
        setAttendanceRecords([]);
        setLoading(false);
        return;
      }

      const student = { id: studentSnap.docs[0].id, ...studentSnap.docs[0].data() };
      setStudentInfo(student);

      // Fetch this student's own attendance records
      const attendanceRef = collection(db, "attendance");
      const attendanceQuery = query(
        attendanceRef,
        where("matricNumber", "==", student.matricNumber)
      );
      const attendanceSnap = await getDocs(attendanceQuery);
      const records = attendanceSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      records.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceRecords(records);
    } catch (error) {
      console.log("Fetch student data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Dashboard</Text>

      {loading ? (
        <Text style={styles.empty}>Loading...</Text>
      ) : !studentInfo ? (
        <Text style={styles.empty}>
          No student record found linked to your account. Contact your lecturer to be enrolled.
        </Text>
      ) : (
        <>
          <View style={styles.profileCard}>
            {studentInfo.image && (
              <Image source={{ uri: studentInfo.image }} style={styles.avatar} />
            )}
            <Text style={styles.name}>{studentInfo.fullName}</Text>
            <Text style={styles.subtitle}>{studentInfo.matricNumber}</Text>
            <Text style={styles.subtitle}>{studentInfo.department} — {studentInfo.level}</Text>
          </View>

          <Text style={styles.sectionHeader}>My Attendance History</Text>
          <FlatList
            data={attendanceRecords}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>No attendance records yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.recordCard}>
                <Text style={styles.recordDate}>{item.date}</Text>
                <Text style={styles.recordDetail}>{item.time} — {item.status}</Text>
              </View>
            )}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.logout}
        onPress={async () => {
          await signOut(auth);
          navigation.replace("Login");
        }}
      >
        <Text style={styles.logoutText}>
          Logout <MaterialCommunityIcons name="logout" size={20} color="red" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#Eaf7FA", 
    paddingTop: 40, 
    paddingHorizontal: 15 
},
  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#0B6E99", 
    textAlign: "center", 
    marginBottom: 15 
},
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#0B6E99", 
    marginTop: 15, 
    marginBottom: 5 
},
  empty: { 
    color: "gray", 
    fontStyle: "italic", 
    textAlign: "center", 
    marginTop: 20, 
    paddingHorizontal: 10 
},
  profileCard: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 12, 
    alignItems: "center", 
    elevation: 3, 
    marginBottom: 10 
},
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginBottom: 10 
},
  name: { 
    fontSize: 18, 
    fontWeight: "bold" 
},
  subtitle: { 
    fontSize: 14, 
    color: "#555" 
},
  recordCard: { 
    backgroundColor: "#fff", 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 8, 
    elevation: 2 
},
  recordDate: { 
    fontWeight: "bold" 
},
  recordDetail: { 
    color: "#555" 
},
  logout: { 
    marginTop: 20, 
    alignItems: "center", 
    marginBottom: 30 
},
  logoutText: { 
    color: "red", 
    fontWeight: "bold", 
    fontSize: 16 
},
});