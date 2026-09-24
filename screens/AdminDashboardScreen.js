import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, } from "react-native";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, query, where, } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminDashboardScreen({ navigation }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");

      const pendingQuery = query(usersRef, where("status", "==", "pending"));
      const pendingSnap = await getDocs(pendingQuery);
      setPendingUsers(pendingSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const activeQuery = query(usersRef, where("status", "==", "active"));
      const activeSnap = await getDocs(activeQuery);
      setActiveUsers(activeSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.log("Fetch users error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const approveUser = async (userId, role) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: role,
        status: "active",
      });
      Alert.alert("Approved", `User set as ${role} and activated.`);
      fetchUsers();
    } catch (error) {
      console.log("Approve error:", error);
      Alert.alert("Error", "Could not approve user.");
    }
  };

  const rejectUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        status: "rejected",
      });
      Alert.alert("Rejected", "User account marked as rejected.");
      fetchUsers();
    } catch (error) {
      console.log("Reject error:", error);
      Alert.alert("Error", "Could not reject user.");
    }
  };

  return (
  <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
    <Text style={styles.title}>Admin Dashboard</Text>

    <Text style={styles.sectionHeader}>Pending Approvals</Text>
    {pendingUsers.length === 0 ? (
      <Text style={styles.empty}>No pending accounts.</Text>
    ) : (
      pendingUsers.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.subtitle}>{item.email}</Text>
          <Text style={styles.subtitle}>Requested role: {item.role}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => approveUser(item.id, "lecturer")}
            >
              <Text style={styles.actionText}>Approve as Lecturer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => approveUser(item.id, "student")}
            >
              <Text style={styles.actionText}>Approve as Student</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => rejectUser(item.id)}
          >
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      ))
    )}

    <Text style={styles.sectionHeader}>Active Users</Text>
    {activeUsers.length === 0 ? (
      <Text style={styles.empty}>No active users yet.</Text>
    ) : (
      activeUsers.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.subtitle}>{item.email}</Text>
          <Text style={styles.subtitle}>Role: {item.role}</Text>
        </View>
      ))
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
  </ScrollView>
);
}

const styles = StyleSheet.create(
    {
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
    marginBottom: 10 
},
  card: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    elevation: 3 
},
  name: { 
    fontSize: 16, 
    fontWeight: "bold" 
},
  subtitle: { 
    fontSize: 14, 
    color: "#555" },
  actionRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10 
},
  actionButton: { 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginHorizontal: 3, 
    alignItems: "center" 
},
  approveButton: { 
    backgroundColor: "#0B6E99" 
},
  rejectButton: { 
    backgroundColor: "#cc3333", 
    marginTop: 8 
},
  actionText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 13 
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