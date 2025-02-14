import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NotFound() {
    return (
        <>
            <Stack.Screen options={{ title: "Not Found!!" }}/>
            <View style={style.container} >
                <Text style={style.text}>Error 404, page not found..!</Text>
                <Link href="/" style={style.button}>
                    Go Back To Home Page.
                </Link> 
            </View>
        </>
    );
}

const style = StyleSheet.create({
  container : {
    backgroundColor: "#f4f4f4",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text : {
    fontSize: 20,
  },
  button: {
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#12435a",
  },
})