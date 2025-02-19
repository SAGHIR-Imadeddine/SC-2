import { Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, View, SafeAreaView } from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/store/store";
import { fetchProductById, fetchProducts } from "~/slices/poductSlice";
import { Product } from "~/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "~/hooks/useAuth";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import ProductsCard from "~/components/ProductCard";
import Filter from "~/components/Filter";
import SearchScreen from "../../components/screens/search";
import ProductScreen from '~/components/screens/product';
import AddProductForm from "~/components/screens/addProductForm";


export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('quantity-asc');
  const [productForm, setProductForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [productDetails, setProductDetails] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null as number | null);
  const { showProduct, productId, showForm, barcode } = useLocalSearchParams();

  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
  };
    
  const dispatch = useDispatch<AppDispatch>();
  const { products, product, loading, error } = useSelector((state: RootState) => state.products);
  
  const productsTotalQuantity = products.map((product) => {
    const totalQuantity = product.stocks ? product.stocks.reduce((sum, stock) => sum + stock.quantity, 0) : 0;
    return { ...product, totalQuantity };
});


const filteredProduct = (products: Product[], filter: string) => {
  switch (filter) {
      case 'price-asc':
          return [...products].sort((a,b) => a.price - b.price);
      case 'price-desc':
          return [...products].sort((a,b) => b.price - a.price);
      case 'name':
          return [...products].sort((a,b) => a.name.localeCompare(b.name));
      case 'quantity-asc':
          return [...products].sort((a,b) => (a.totalQuantity ?? 0) - (b.totalQuantity ?? 0));
      case 'quantity-desc':
          return [...products].sort((a,b) => (b.totalQuantity ?? 0) - (a.totalQuantity ?? 0));
      default:
          return products;
  }
};

const _onProductPress = async (productId: number) => {
  setSelectedProductId(productId);
  await dispatch(fetchProductById(productId)).unwrap();
  setProductDetails(true);
}

  useLayoutEffect(() => {
    dispatch(fetchProducts()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
              <TouchableOpacity onPress={() => isSearching ? setIsSearching(false) : setIsSearching(true)}>
                <Ionicons name={isSearching ? "close-outline" : "search-outline"} style={{ marginRight: 15 }} size={24} color="#12435a" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={async () => {await logout(); router.push('/');}}
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
    });
  }, [navigation, isSearching]);

  useEffect(() => {
    if (showProduct === 'true' && productId) {
      _onProductPress(Number(productId));
    }
    if (showForm === 'true') {
      setProductForm(true);
    }
  }, [showProduct, productId, showForm]);

  const _handleCloseProduct = () => {
    setProductDetails(false);
    setSelectedProductId(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', padding: 2 }}>
      {(productForm) ? (
        <AddProductForm 
          onClose={() => setProductForm(false)} 
          initialBarcode={barcode as string}
        />
      ) : 

      (product && productDetails) ? (
        <ProductScreen 
          product={product} 
          onClose={_handleCloseProduct}
        />
      ) :

      (
          isSearching ? (
            <SearchScreen _onProductPress={_onProductPress} />
          ) : 
          
          (
            <>
              <Filter setFilter={setFilter} />
              <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />}
                data={filteredProduct(productsTotalQuantity, filter)}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, padding: 5 }}>
                        <ProductsCard 
                          key={item.id}   
                          name={item.name} 
                          price={item.price}
                          solde={item.solde}
                          type={item.type} 
                          src={item.image} 
                          quantity={item.totalQuantity as number}
                          onPress={() => { _onProductPress(item.id);}}
                        /> 
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={style.addButton}
                onPress={() => setProductForm(true)}>
                  <Ionicons name="add-circle-outline" size={35} color="skyblue" />
              </TouchableOpacity>
            </>
          )
        
      )}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#357998',
    padding: 10,
    borderRadius: 50,
  }
});