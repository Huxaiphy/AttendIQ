import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function StudentSearchScreen() {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      Alert.alert("Enter a search", "Type a name or matric number to search.");
      return;
    }

    setLoading(true);
    setStudent(null);
    setAttendanceHistory([]);

    try {
      // Try matching by matric number first (exact match)
      const matricQuery = query(
        collection(db, "students"),
        where("matricNumber", "==", searchInput.trim())
      );
      let snapshot = await getDocs(matricQuery);

      // If no match by matric number, fall back to searching all students by name
      let foundStudent = null;
      if (!snapshot.empty) {
        foundStudent = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      } else {
        const allStudentsSnap = await getDocs(collection(db, "students"));
        const allStudents = allStudentsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        foundStudent = allStudents.find((s) =>
          s.fullName?.toLowerCase().includes(searchInput.trim().toLowerCase())
        );
      }

      if (!foundStudent) {
        Alert.alert("Not found", "No student matched that name or matric number.");
        setLoading(false);
        return;
      }

      setStudent(foundStudent);

      // Fetch this student's full attendance history
      const attendanceQuery = query(
        collection(db, "attendance"),
        where("matricNumber", "==", foundStudent.matricNumber)
      );
      const attendanceSnap = await getDocs(attendanceQuery);
      const records = attendanceSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort newest first (best-effort — depends on your date string format)
      records.sort((a, b) => (a.date < b.date ? 1 : -1));

      setAttendanceHistory(records);
      setPresentCount(
        records.filter((r) => r.status?.toLowerCase() === "present").length
      );
      setAbsentCount(
        records.filter((r) => r.status?.toLowerCase() === "absent").length
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Student</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or matric number"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {student && !loading && (
        <>
          <View style={styles.profileCard}>
            {student.photoUrl ? (
              <Image source={{ uri: student.photoUrl }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>No Photo</Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <Text style={styles.name}>{student.fullName}</Text>
              <Text style={styles.detail}>Matric: {student.matricNumber}</Text>
              <Text style={styles.detail}>Department: {student.department}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.presentStat]}>
              <Text style={styles.statNumber}>{presentCount}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            <View style={[styles.statCard, styles.absentStat]}>
              <Text style={styles.statNumber}>{absentCount}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
            <View style={[styles.statCard, styles.totalStat]}>
              <Text style={styles.statNumber}>{attendanceHistory.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>

          <Text style={styles.historyTitle}>Attendance History</Text>
          {attendanceHistory.length === 0 ? (
            <Text style={styles.emptyText}>No attendance records found.</Text>
          ) : (
            <FlatList
              data={attendanceHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.historyRow}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                  <Text
                    style={[
                      styles.historyStatus,
                      item.status?.toLowerCase() === "present"
                        ? styles.statusPresent
                        : styles.statusAbsent,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
},
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 16 
},
  searchRow: { 
    flexDirection: "row", 
    marginBottom: 16 
},
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  searchButtonText: { 
    color: "#fff", 
    fontWeight: "600" 
},
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  photo: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginRight: 14 
},
  photoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  photoPlaceholderText: { 
    fontSize: 10, 
    color: "#555" 
},
  profileInfo: { 
    flex: 1 
},
  name: { 
    fontSize: 18, 
    fontWeight: "bold" 
},
  detail: { 
    fontSize: 14, 
    color: "#555", 
    marginTop: 2 
},
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 20 
},
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  presentStat: { backgroundColor: "#dcfce7" },
  absentStat: { backgroundColor: "#fee2e2" },
  totalStat: { backgroundColor: "#e0e7ff" },
  statNumber: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#555", marginTop: 2 },
  historyTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  emptyText: { color: "#888", textAlign: "center", marginTop: 10 },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  historyDate: { flex: 1, fontSize: 13 },
  historyTime: { flex: 1, fontSize: 13, textAlign: "center" },
  historyStatus: { flex: 1, fontSize: 13, textAlign: "right", fontWeight: "600" },
  statusPresent: { color: "#16a34a" },
  statusAbsent: { color: "#dc2626" },
});