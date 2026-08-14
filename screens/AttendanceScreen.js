import React, {useState, useEffect, useRef} from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { db } from "../firebaseConfig";
import { recognizePerson } from "../utils/faceApi";
import { CameraView, useCameraPermissions } from "expo-camera"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

export default function AttendanceScreen() {
    const [showCamera, setShowCamera] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const openCamera = async () => {
        if(!permission?.granted) {
            await requestPermission();
        }
        setShowCamera(true);
    };
    
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
    }, []);

    const markAttendance = async (student) => {
        try { 
            const today = new Date().toLocaleDateString();

            const q = query(
                collection(
                    db,
                    "attendance"
                ),

                where(
                    "matricNumber","==",student.matricNumber
                ),
                where(
                    "date","==",today
                )
            );

            const snapshot = await getDocs(q);

            if (
                !snapshot.empty
            ) {
                alert("Attendance already marked for today!");
                return;
            }
            await addDoc(
                collection(db, "attendance"), {
                fullName: student.fullName,
                matricNumber: student.matricNumber,
                department: student.department,
                status: "Present",    
                date: today,
                time: new Date().toLocaleTimeString(),
            }
            );
            alert("Attendance marked successfully!");
        } catch (error) {
            console.log(error);
            alert("Error marking attendance");
        }
    };

    const markAbsent = async (student) => {
      try {
        await addDoc(collection(db, "attendance"), {
                fullName: student.fullName,
                matricNumber: student.matricNumber,
                department: student.department,
                status: "Absent",
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            });
            alert("Absent saved!");
        } catch (error) {
            console.log(error);
            alert("Error saving absent attendance")
        }
    };

    const captureImage = async () => {
        if (!cameraRef.current) return;
        
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7,});
        console.log("Captured:",photo);

        const recognitionResult = await recognizePerson(photo.uri);
        console.log("Luxand Result:", recognitionResult);
    };

    if (showCamera) {
        return (
            <View style={{ flex: 1 }}>
                <CameraView ref={cameraRef} style={{ flex: 1}} facing="front"/>
                <View style={{
                    position: "absolute",
                    bottom: 50,
                    width: "100%",
                    alignItems: "center",
                }}>
                    <Button title="Capture" onPress={captureImage}/>
                </View>
            </View>
            
        );
    }
    
    return ( 
        <View style={styles.container}>
             <Button title="Scan Student Face" onPress={openCamera}/>
            <FlatList
            data={students}
            keyExtractor={(item) => item.id
            }
            renderItem={({ item }) => (
                <View>
                    <Text style={styles.title}>Attendance</Text>
                    <Text style={styles.subtitle}>Scan a student's face to make attendance.</Text>
                   <View style={styles.card}>
                    <Text style={styles.name}>
                        {item.fullName}
                    </Text>
                    <Text style={styles.subtitle}>
                        {item.matricNumber}
                    </Text>
                    <Text>
                        {item.department}
                    </Text>
                   </View>
                    <Button style={styles.button}
                    title="Present"
                    onPress={()=>
                        markAttendance(item)
                    }
                    />
                    <Button style={styles.button}
                    title="Absent"
                    onPress={() => 
                        markAbsent(item)
                    }
                    />
                    </View>
            )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#00f",
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        color: "#00f",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: "#f0f0f0",
        width: "95%",
        padding: 15,
        marginBottom: 15,
        borderRadius: 15,
        elevation: 5,
    },
    button: {
        marginTop: 10,
        width: "10%",
        padding: 10,
        backgroundColor: "rgb(90, 90, 128)",
        borderRadius: 5,
        alignItems: "center",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    }

})