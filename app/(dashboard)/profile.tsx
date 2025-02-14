import { Text, View, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <View
      style={style.container}
    >
      <Text style={style.text}>Profile.</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container : {
    backgroundColor: "#f4f4f4",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text : {
    fontSize: 16,
  },
})