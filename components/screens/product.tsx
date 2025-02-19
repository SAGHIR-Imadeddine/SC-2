import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '~/types/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/store/store';
import { fetchProducts } from '~/slices/poductSlice';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateProductPDF } from '~/components/PDFGenerator';
import { useState } from 'react';
import { updateProductStock } from '~/services/api/productServices';

interface ProductScreenProps {
  product: Product;
  onClose: () => void;
}

type QuantityAction = 'increase' | 'decrease';

export default function ProductScreen({ product, onClose }: ProductScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [quantityAction, setQuantityAction] = useState<QuantityAction>('increase');

  const userStock = product.stocks.find(stock => stock.id === user?.warehouseId);

  const totalQuantity = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const firstEdit = product.editedBy[0];
  const lastEdit = product.editedBy[product.editedBy.length - 1];

  const getStockStatusStyle = (quantity: number) => {
    if (quantity === 0) return styles.outOfStock;
    if (quantity < 10) return styles.lowStock;
    return styles.inStock;
  };

  const handleQuantityChange = async () => {
    const changeAmount = parseInt(quantity);
    if (isNaN(changeAmount) || changeAmount < 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!userStock) {
      setError('No stock found for your warehouse');
      return;
    }

    const newQuantity = quantityAction === 'increase' 
      ? userStock.quantity + changeAmount
      : userStock.quantity - changeAmount;

    if (newQuantity < 0) {
      setError('Cannot reduce below 0');
      return;
    }

    try {
      const updatedProduct = {
        ...product,
        stocks: product.stocks.map(stock => 
          stock.id === user?.warehouseId 
            ? { ...stock, quantity: newQuantity }
            : stock
        ),
        editedBy: [
          ...product.editedBy,
          {
            warehousemanId: user?.id || '',
            at: new Date().toISOString()
          }
        ]
      };

      await updateProductStock(updatedProduct as Product);
      await dispatch(fetchProducts());
      setIsModalVisible(false);
      setQuantity('');
      setError('');
      setQuantityAction('increase');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to update quantity: ${errorMessage}`);
      console.error('Update error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={24} color="#12435a" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{product.name}</Text>
        </View>
        <View style={styles.pdfButtons}>
          <TouchableOpacity 
            onPress={() => generateProductPDF(product, 'download')} 
            style={styles.pdfButton}
          >
                <Ionicons name="share-social" size={24} color="#12435a" />         
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          {product.image && (
            <Image 
              source={{ uri: product.image }} 
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{product.type}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Barcode:</Text>
            <Text style={styles.value}>{product.barcode}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>{product.price} Dh</Text>
          </View>
          
          {product.solde !== undefined && product.solde > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Solde:</Text>
              <Text style={[styles.value, { color: '#f54d4d' }]}>{product.solde} Dh</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Stock:</Text>
            <Text style={[styles.value, getStockStatusStyle(totalQuantity)]}>
              {totalQuantity} units
            </Text>
          </View>
        </View>

        <View style={styles.stocksSection}>
          <Text style={styles.sectionTitle}>Stock Distribution</Text>
          {/* {!product.stocks.length && ( */}
            <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsModalVisible(true)}
            >
                <Ionicons name="create-outline" size={20} color="#f0f0f0" />
                <Text style={styles.editButtonText}>Add Stock</Text>
            </TouchableOpacity>
          {/* )} */}
          {product.stocks.map((stock) => (
            <View key={stock.id.toString()} style={styles.stockItem}>
              <View style={styles.stockHeader}>
                <Text style={styles.stockName}>{stock.name}</Text>
                <Text style={styles.stockQuantity}>{stock.quantity} units</Text>
              </View>
              <Text style={styles.stockLocation}>
                {stock.localisation.city}
              </Text>
              {/* {stock.id === user?.warehouseId && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Ionicons name="create-outline" size={20} color="#12435a" />
                  <Text style={styles.editButtonText}>Modify Quantity</Text>
                </TouchableOpacity>
              )} */}
            </View>
          ))}
        </View>

        {firstEdit && (
          <View style={styles.lastEditSection}>
            <Text style={styles.lastEditText}>
              Created by ID: {firstEdit.warehousemanId}
            </Text>
            <Text style={styles.lastEditDate}>
              {new Date(firstEdit.at).toLocaleDateString()}
            </Text>
          </View>
        )}
        
        {lastEdit && lastEdit !== firstEdit && (
          <View style={styles.lastEditSection}>
            <Text style={styles.lastEditText}>
              Last edited by ID: {lastEdit.warehousemanId}
            </Text>
            <Text style={styles.lastEditDate}>
              {new Date(lastEdit.at).toLocaleDateString()}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modify Stock Quantity</Text>
            
            <Text style={styles.modalLabel}>Current Quantity: {userStock?.quantity || 0}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  quantityAction === 'increase' && styles.actionButtonActive
                ]}
                onPress={() => setQuantityAction('increase')}
              >
                <Ionicons 
                  name="add-circle-outline" 
                  size={20} 
                  color={quantityAction === 'increase' ? '#fff' : '#12435a'} 
                />
                <Text style={[
                  styles.actionButtonText,
                  quantityAction === 'increase' && styles.actionButtonTextActive
                ]}>
                  Increase
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  quantityAction === 'decrease' && styles.actionButtonActive
                ]}
                onPress={() => setQuantityAction('decrease')}
              >
                <Ionicons 
                  name="remove-circle-outline" 
                  size={20} 
                  color={quantityAction === 'decrease' ? '#fff' : '#12435a'} 
                />
                <Text style={[
                  styles.actionButtonText,
                  quantityAction === 'decrease' && styles.actionButtonTextActive
                ]}>
                  Decrease
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder={`Enter quantity to ${quantityAction}`}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setQuantity('');
                  setError('');
                  setQuantityAction('increase');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleQuantityChange}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#12435a',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  outOfStock: {
    color: '#dc3545',
  },
  lowStock: {
    color: '#ffc107',
  },
  inStock: {
    color: '#28a745',
  },
  stocksSection: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#12435a',
  },
  stockItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '500',
  },
  stockQuantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#12435a',
  },
  stockLocation: {
    fontSize: 14,
    color: '#666',
  },
  lastEditSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  lastEditText: {
    fontSize: 14,
    color: '#666',
  },
  lastEditDate: {
    fontSize: 14,
    color: '#999',
  },
  pdfButtons: {
    flexDirection: 'row',
    gap: 16,
    position: 'absolute',
    right: 16,
  },
  pdfButton: {
    padding: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12435a',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  editButtonText: {
    marginLeft: 4,
    color: '#f0f0f0',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#12435a',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#12435a',
    gap: 8,
  },
  actionButtonActive: {
    backgroundColor: '#12435a',
  },
  actionButtonText: {
    color: '#12435a',
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtonTextActive: {
    color: '#fff',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#12435a',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 16,
  },
});
