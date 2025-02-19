import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Product } from '../../types/types';
import ProductsCard from '../ProductCard';

export default function SearchScreen(
    { _onProductPress }: { _onProductPress: (productId: number) => void }
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { products } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const debounce = setTimeout(() => {
        if (searchQuery.length >= 3) {
            setIsSearching(true);
            const filteredProducts = products.filter(product => 
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.barcode.includes(searchQuery)
            );
            setSearchResults(filteredProducts);
            setIsSearching(false);
          } else {
            setSearchResults([]);
          };
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleChange = (event: any) => {
    setSearchQuery(event.target.value);
  };


  const renderProduct = ({ item }: { item: Product }) => (
    <ProductsCard
      type={item.type}
      price={item.price}
      src={item.image}
      name={item.name}
      quantity={item.stocks.reduce((acc, stock) => acc + stock.quantity, 0)}
      onPress={() => { _onProductPress(item.id);}}
    />
  );

  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or barcode..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />
      
      {isSearching ? (
        <ActivityIndicator size="large" color="#12435a" style={styles.loader} />
      ) :
      
      searchResults.length > 0 ?
      (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.productsList}
          numColumns={2}
          columnWrapperStyle={styles.productsRow}
          showsVerticalScrollIndicator={false}
        />
      ):
      (
        <FlatList
            data={products}
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
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    marginHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsList: {
    paddingBottom: 20,
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
