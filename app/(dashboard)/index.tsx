import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

//Profil utilisateur avec affichage de l’IMC et des données de base. Boutons pour accéder aux fonctionnalités (calcul, photos, timelapse).
export default function Index() {

 const [color, setColor] = useState('red');
  const [counter, setCounter] = useState(0);
  const [reverse, setReverse] = useState(false)
  const handlClick = ()=>{
  // console.log(reverse);
  // console.log(counter);
  
  
    if (counter < 5 && counter >= 0 && reverse === false) {
      setCounter((ov)=> {
        ov++
        if(ov === 5) setReverse(true);
        return ov;
      })
      
    }
    else{
      setCounter((ov)=>{
        ov--
        if(ov === 0) setReverse(false); 
        return ov;
      })

      
      
      
    }
    setColor(chanColor())
      console.log(color);
    
  }
 const chanColor = () => {
  return '#' + Number(Math.round(Math.random()*1677721)).toString(16)
 }


  return (
    <View
      style={{...style.container, backgroundColor : color}}
    >
      <TouchableOpacity onPress={handlClick}>{counter}</TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text : {
    fontSize: 16
  }
})