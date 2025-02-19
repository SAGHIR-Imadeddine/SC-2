import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

interface Style {
  [key: string]: string | number;
}

interface MyButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title: string;
  textStyle?: Style;
  containerStyle?: Style;
  icon?: React.ReactNode;
}

export default function MyButton({
  onPress, 
  disabled = false,
  title, 
  textStyle = {}, 
  containerStyle = {}, 
  icon
}: MyButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={{...style.btn, ...containerStyle}}
    >
      <View style={style.content}>
        {icon}
        <Text style={{...style.text, ...textStyle}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  btn: {
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    minHeight: 60,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});