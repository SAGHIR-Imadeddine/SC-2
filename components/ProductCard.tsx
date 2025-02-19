import {Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface ProductsCardProps {
    type: string,
    price: number,
    solde?: number,
    src: string,
    name: string,
    quantity: number,
    onPress: () => void
}

function ProductsCard({ type, price, solde, src, name, quantity, onPress}: ProductsCardProps) {
    const truncateName = name.length > 10 ? name.substring(0, 11) + ' ...' : name;
    const truncateType = type.length > 10 ? type.substring(0, 5) + ' ...' : type;

    let stockColor = 'green';
    if(quantity === 0) {
        stockColor = 'red'
    } else if (quantity > 0 && quantity < 10) {
        stockColor = 'orange';
    }
    return (
        <View style={{ backgroundColor: 'white', width: 175, height: 230, borderRadius: 20}}>
            <View style={{ flexDirection: 'row', gap: 3, justifyContent: 'space-between', paddingHorizontal: 4, paddingVertical: 10}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#f7f7f7', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 20, borderColor: '#e6e6e6', borderWidth: 1 }}>
                    <Ionicons name={"pricetag-outline"} size={15} color={"black"} />
                    <Text style={{ color: '#b3b3b3'}}>{truncateType}</Text>
                </View>
                {solde ? 
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f7f7f7', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 20, borderColor: '#0097c5', borderWidth: 1 }}>
                    <Ionicons name={"ticket"} color={"black"} size={15} />
                    <Text style={{ color: '#0097c5'}}>{solde}Dh</Text>
                </View> :
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f7f7f7', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 20, borderColor: '#e6e6e6', borderWidth: 1 }}>
                    <Ionicons name={"ticket"} color={"black"} size={15} />
                    <Text style={{ color: '#b3b3b3'}}>{price}Dh</Text>
                </View>
                }
                
            </View>
            <View style={{ backgroundColor: "#f7f7f7", width: '90%', marginHorizontal: 'auto', height: 130, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Image style={{ width: '70%', height: '70%'}} source={{uri:src}} />
            </View>
            <View style={{ width: '90%', marginHorizontal: 'auto', marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5}}>
                        <View style={{ backgroundColor: stockColor, width: 8, height: 8, borderRadius: 50}}></View>
                        <Text style={{ fontWeight: 200, fontSize: 14}}>{quantity} Unit</Text>
                    </View>
                    <Text style={{ fontWeight: 600, fontSize: 17}}>{truncateName}</Text>
                </View>
                <Pressable>
                    <TouchableOpacity onPress={onPress} style={{ borderWidth: 1, paddingVertical: 5, paddingHorizontal: 5, borderRadius: 50}}>
                        <Ionicons name={"arrow-forward"} color={"black"} size={20} />
                    </TouchableOpacity>
                </Pressable>
            </View>
        </View>
    );
}

export default ProductsCard;