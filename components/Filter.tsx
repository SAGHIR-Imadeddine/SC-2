import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

function Filter({setFilter}: {setFilter: (filter: string) => void}) {
    return (
        <View style={{ backgroundColor: 'white', paddingVertical: 10, marginVertical: 8, width: '95%', marginHorizontal: 'auto', borderRadius: 20, shadowColor: 'gray', shadowOffset: { width: 0, height: 2}, shadowOpacity: 0.3, shadowRadius: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8}}>
                <TouchableOpacity onPress={() => setFilter('price-desc')} style={{ backgroundColor: '#eeeeee', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 8, borderRadius: 10, borderColor: 'gray'}}>
                    <Text style={{ color: 'gray', fontWeight: 500, fontSize: 10}}>Price</Text>
                    <Ionicons name={"arrow-down"} color={"gray"} size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('price-asc')} style={{ backgroundColor: '#eeeeee', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 8, borderRadius: 10, borderColor: 'gray'}}>
                    <Text style={{ color: 'gray', fontWeight: 500, fontSize: 10}}>Price</Text>
                    <Ionicons name={"arrow-up"} color={"gray"} size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('name')} style={{ backgroundColor: '#eeeeee', paddingHorizontal: 6, paddingVertical: 10, borderRadius: 10, borderColor: 'gray'}}>
                    <Text style={{ color: 'gray', fontWeight: 500, fontSize: 10}}>A-Z</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('quantity-asc')} style={{ backgroundColor: '#eeeeee', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 10, borderRadius: 10, borderColor: 'gray'}}>
                    <Text style={{ color: 'gray', fontWeight: 500, fontSize: 10}}>Quantity</Text>
                    <Ionicons name={"arrow-up"} color={"gray"} size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('quantity-desc')} style={{ backgroundColor: '#eeeeee', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, paddingVertical: 10, borderRadius: 10, borderColor: 'gray'}}>
                    <Text style={{ color: 'gray', fontWeight: 500, fontSize: 10}}>Quantity</Text>
                    <Ionicons name={"arrow-down"} color={"gray"} size={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Filter;