import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

interface Style {
  [key: string]: string | number;
}

interface MyButtonProps {
  onPress: () => void;
  disabled: boolean;
  title: string;
  textStyle?: Style;
  containerStyle?: Style;
  // icon?: () => React.ReactNode;
}
export default function MyButton({onPress, disabled = true, title, textStyle = {}, containerStyle = {}, icon}: MyButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{...style.btn, ...containerStyle}}
    >
      <Text style={{...style.text, ...textStyle}}>{title}</Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  btn : {
    backgroundColor: "#f4f4f4",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    minHeight: 60,
    marginHorizontal: 16,
  },
  text : {
    fontSize: 16,
    fontWeight: '500',
  },
})