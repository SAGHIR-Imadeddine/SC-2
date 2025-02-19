import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useStatistics } from "~/hooks/useStatistics";
import { fetchProducts } from "~/slices/poductSlice";
import { AppDispatch, RootState } from "~/store/store";
import { Ionicons } from "@expo/vector-icons";

export default function Metrics() {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  const { statistics, recalculate } = useStatistics();
  const { products } = useSelector((state: RootState) => state.products);
  
  useEffect(() => {
    recalculate();
  }, [products]);
  
  const _onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchProducts());
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={_onRefresh}
        />
      }
    >
      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="cube" size={24} color="#12435a" />
          </View>
          <Text style={styles.label}>Total Products</Text>
          <Text style={styles.value}>{statistics.totalProducts}</Text>
        </View>

        <View style={[styles.card, styles.warningCard]}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={24} color="#ff9800" />
          </View>
          <Text style={styles.label}>Out of Stock</Text>
          <Text style={[styles.value, { color: '#ff9800' }]}>{statistics.outOfStock}</Text>
        </View>

        <View style={[styles.card, styles.successCard]}>
          <View style={styles.iconContainer}>
            <Ionicons name="bar-chart" size={24} color="#4caf50" />
          </View>
          <Text style={styles.label}>Total Stock</Text>
          <Text style={[styles.value, { color: '#4caf50' }]}>{statistics.totalStockValue}</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Stocked Products</Text>
          {statistics.mostAddedProducts.map((product: any) => (
            <View key={product.id} style={styles.productItem}>
              <Ionicons name="trending-up" size={20} color="#4caf50" />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productQuantity}>{product.quantity} units</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Least Stocked Products</Text>
          {statistics.mostRemovedProducts.map((product: any) => (
            <View key={product.id} style={styles.productItem}>
              <Ionicons name="trending-down" size={20} color="#f44336" />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productQuantity}>{product.quantity} units</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  warningCard: {
    backgroundColor: '#fff9e6',
  },
  successCard: {
    backgroundColor: '#e8f5e9',
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#12435a',
  },
  listContainer: {
    gap: 20,
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#12435a',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});