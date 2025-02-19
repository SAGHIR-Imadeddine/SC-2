import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export default function TabLayout() {
  const { logout, isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Auth middleware
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/');
    }
  }, [isAuthenticated, user]);


  const handleLogout = async () => {
    await logout();
    // console.log('logged out');
    router.push('/');
  };
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
          headerShadowVisible: true,
          headerTintColor: "#12435a",
          headerRight: () => (
            <>
              <TouchableOpacity 
                onPress={() => handleLogout()}
                style={{ marginRight: 15 }}
              >
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color="#12435a"
                />
              </TouchableOpacity>
            </>
          ),
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
          title: "WareHouse",
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
        name="metrics"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="scanner"
        options={{
          title: "scan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "scan-circle" : "scan-circle-outline"}
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
