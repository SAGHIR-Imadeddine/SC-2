import { router, useRouter } from "expo-router";
import { Text, View, StyleSheet, ImageBackground, SafeAreaView, TextInput, Alert, Keyboard, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import MyButton from "../components/MyButton";
import { useEffect, useState } from "react";

import { useAuth } from '../hooks/useAuth';

const bg = require('../assets/images/warehouseBG.webp');

export default function Home() {
  const [secret, setSecret] = useState('AH90907J');
  const { loading, error, handleLogin, isAuthenticated, user } = useAuth();

if (loading) {
  return (
    <View style={style.bg}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
    }
  }, [error]);

  // if (isAuthenticated && !loading && !error && user) {
  //   router.replace('/dashboard');
  // }
  const onSubmit = async () => {
    Keyboard.dismiss();
    await handleLogin(secret);
    if (isAuthenticated && !loading && !error && user) {
      router.replace('/dashboard');
    }
  };



  return (
    <>
      <StatusBar style="light"/>
      <View style={style.bg}>
        <ImageBackground source={bg} resizeMode="stretch" style={style.bg}>
          <LinearGradient style={style.bg} colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.6)"]}>
            <SafeAreaView style={style.container}>
              <View>
                <Text style={style.title}>Ware-Stock</Text>
                <Text style={style.text}>Upgrade Your Stock, Track Your Progress</Text>
              </View>
              <View>
                <TextInput
                  style={[style.input, error && style.inputError]}
                  placeholder="Enter your #ID"
                  value={secret}
                  onChangeText={(value) => setSecret(value)}
                  autoCapitalize="characters"
                  maxLength={10}
                  editable={!loading}
                />
              </View>
              <View>
                <MyButton 
                  title={loading ? "Logging in..." : "Get Started"}
                  onPress={onSubmit}
                  disabled={loading}
                  icon={loading && <ActivityIndicator color="#fff" size="small" />}
                />
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  bg : {
      flex: 1,
  },
  container : {
      paddingVertical: 80,
      flex: 1,
      justifyContent: "space-between",
  },
  title : {
      textAlign: "center",
      fontSize: 30,
      color: "#fefefe",
      fontWeight: "600"
  },
  text : {
      textAlign: "center",
      fontSize: 18,
      color: "#fff",
      fontWeight: "200"
  },
  button: {
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#12435a",
  },
  input: {
      backgroundColor: "#f4f4f4",
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      marginHorizontal: 20,
  },
  inputError: {
    borderColor: '#ff0000',
  },
})