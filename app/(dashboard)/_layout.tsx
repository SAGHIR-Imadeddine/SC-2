import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";


export default function TabLayout() {
  return (
    <>
    <StatusBar style="dark"/>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#12435a",
        tabBarInactiveTintColor: "#888",
        headerStyle: {
          backgroundColor: "#f4f4f4",
        },
        headerShadowVisible: false,
        headerTintColor: "#12435a",
        tabBarStyle: {
          backgroundColor: "#f4f4f4",
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="body-metrics"
        options={{
          title: "Mesures",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "body" : "body-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />      
    </Tabs>
    </>
  );
}
