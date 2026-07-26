import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import DashboardScreen from "../screens/DashboardScreen";
import RecordsScreen from "../screens/RecordsScreen";
import LoginScreen from "../screens/LoginScreen";
import AttendanceHistoryScreen from "../screens/AttendanceHistoryScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Attendance" component={AttendanceScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="Records" component={RecordsScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    
}

