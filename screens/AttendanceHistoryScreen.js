import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function AttendanceHistoryScreen() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    const fetchAttendance = async () => {
        try {
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const getTodayString = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
        // If your "date" field is stored differently (e.g. "21/09/2026"),
        // adjust this to match that format.
    };

    const exportTodayToPDF = async () => {
        const todayStr = getTodayString();
        const todaysRecords = attendanceRecords.filter(item => item.date === todayStr);

        if (todaysRecords.length === 0) {
            Alert.alert("No records", "No attendance records found for today.");
            return;
        }

        setExporting(true);
        try {
            const rowsHtml = todaysRecords.map(item =>`
                <tr>
                    <td>${item.fullName ?? ""}</td>
                    <td>${item.matricNumber ?? ""}</td>
                    <td>${item.department ?? ""}</td>
                    <td>${item.status ?? ""}</td>
                    <td>${item.time ?? ""}</td>
                </tr>
            `).join("");

            const html = `
                <html>
                    <head>
                        <style>
                            body { font-family: Helvetica, Arial, sans-serif; padding: 20px; }
                            h1 { font-size: 20px; margin-bottom: 4px; }
                            p { color: #555; margin-top: 0; margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }
                            th { background-color: #2563eb; color: #fff; }
                        </style>
                    </head>
                    <body>
                        <h1>AttendIQ — Attendance Record</h1>
                        <p>Date: ${todayStr}</p>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Matric No.</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                            ${rowsHtml}
                        </table>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });

            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, {
                    mimeType: "application/pdf",
                    dialogTitle: "Today's Attendance Record",
                });
            } else {
                Alert.alert("Saved", `PDF saved at: ${uri}`);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Export failed", "Something went wrong while generating the PDF.");
        } finally {
            setExporting(false);
        }
    };
    
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Attendance History</Text>
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={exportTodayToPDF}
                    disabled={exporting}
                >
                    <Text style={styles.exportButtonText}>
                        {exporting ? "Exporting..." : "Export Today (PDF)"}
                    </Text>
                </TouchableOpacity>
            </View>

            {attendanceRecords.length === 0 ? (
                <Text style={styles.emptyText}>No attendance records found.</Text>
            ) : (
                <FlatList
                    data={attendanceRecords}
                    keyExtractor={(item) => item.id}
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
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: "bold" },
    exportButton: {
        backgroundColor: "#2563eb",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    exportButtonText: { color: "#fff", fontWeight: "600", width: 50 },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 3,
    },
    emptyText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
});