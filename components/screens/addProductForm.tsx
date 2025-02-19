import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/store/store';
import { createProduct, getProductByBarcode } from '~/services/api/productServices';
import { fetchProducts } from '~/slices/poductSlice';
import * as ImagePicker from 'expo-image-picker';

interface AddProductFormProps {
  onClose: () => void;
  initialBarcode?: string;
}

export default function AddProductForm({ onClose, initialBarcode }: AddProductFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { products } = useSelector((state: RootState) => state.products);
  
  const warehouseInfo = products
    .find(p => p.stocks.some(s => s.id === user?.warehouseId))
    ?.stocks.find(s => s.id === user?.warehouseId);

  const warehouseName = warehouseInfo?.name || "Main Stock";
  const warehouseLocation = warehouseInfo?.localisation || {
    city: user?.city || '',
    latitude: 0,
    longitude: 0
  };

  const [initialQuantity, setInitialQuantity] = useState('');
  const [formData, setFormData] = useState({
    id: products.length + 1,
    name: '',
    type: '',
    barcode: initialBarcode || '',
    price: '',
    solde: '',
    supplier: '',
    image: '',
    stocks: [],
    editedBy: [{
      warehousemanId: user?.id || 0,
      at: new Date().toISOString()
    }]
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add state for barcode error
  const [barcodeExists, setBarcodeExists] = useState(false);

  // Check if barcode exists when form loads or barcode changes
  useEffect(() => {
    const checkBarcode = async () => {
      if (formData.barcode.length >= 3) {
        try {
          const existingProduct = await getProductByBarcode(formData.barcode);
          if (existingProduct) {
            setBarcodeExists(true);
            setErrors(prev => ({
              ...prev,
              barcode: 'This barcode is already registered'
            }));
          } else {
            setBarcodeExists(false);
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.barcode;
              return newErrors;
            });
          }
        } catch (error) {
          console.error('Error checking barcode:', error);
        }
      }
    };

    checkBarcode();
  }, [formData.barcode]);

  const pickImage = async () => {
    try {

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }


      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {

        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setFormData(prev => ({
          ...prev,
          image: imageUri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type.trim()) newErrors.type = 'Type is required';
    if (!formData.barcode.trim()) newErrors.barcode = 'Barcode is required';
    if (barcodeExists) newErrors.barcode = 'This barcode is already registered';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!selectedImage) newErrors.image = 'Image is required';
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) newErrors.price = 'Price must be a positive number';
    
    if (formData.solde) {
      const solde = parseFloat(formData.solde);
      if (isNaN(solde) || solde <= 0) newErrors.solde = 'Solde must be a positive number';
      if (solde >= price) newErrors.solde = 'Solde must be less than price';
    }

    if (initialQuantity && (isNaN(Number(initialQuantity)) || Number(initialQuantity) < 0)) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const quantity = Number(initialQuantity);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        solde: formData.solde ? parseFloat(formData.solde) : 0,
        stocks: quantity > 0 ? [{
          id: user?.warehouseId || 1,
          name: warehouseName,
          quantity: quantity,
          localisation: warehouseLocation
        }] : []
      };

      await createProduct(productData);
      await dispatch(fetchProducts()).unwrap();
      Alert.alert('Success', 'Product added successfully');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} color="#12435a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Product name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              style={[styles.input, errors.type && styles.inputError]}
              value={formData.type}
              onChangeText={(text) => setFormData({...formData, type: text})}
              placeholder="Product type"
            />
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Barcode</Text>
            <TextInput
              style={[
                styles.input, 
                errors.barcode && styles.inputError,
                barcodeExists && styles.barcodeExists
              ]}
              value={formData.barcode}
              onChangeText={(text) => setFormData({...formData, barcode: text})}
              placeholder="Product barcode"
              keyboardType="decimal-pad"
              editable={!initialBarcode}
            />
            {errors.barcode && (
              <Text style={[
                styles.errorText,
                barcodeExists && styles.barcodeExistsText
              ]}>
                {errors.barcode}
              </Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                value={formData.price}
                onChangeText={(text) => setFormData({...formData, price: text})}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Solde (Optional)</Text>
              <TextInput
                style={[styles.input, errors.solde && styles.inputError]}
                value={formData.solde}
                onChangeText={(text) => setFormData({...formData, solde: text})}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              {errors.solde && <Text style={styles.errorText}>{errors.solde}</Text>}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Supplier</Text>
            <TextInput
              style={[styles.input, errors.supplier && styles.inputError]}
              value={formData.supplier}
              onChangeText={(text) => setFormData({...formData, supplier: text})}
              placeholder="Supplier name"
            />
            {errors.supplier && <Text style={styles.errorText}>{errors.supplier}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Initial Quantity</Text>
            <TextInput
              style={[styles.input, errors.quantity && styles.inputError]}
              value={initialQuantity}
              onChangeText={setInitialQuantity}
              placeholder="Enter initial quantity (optional)"
              keyboardType="numeric"
            />
            {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Image</Text>
            <TouchableOpacity 
              style={styles.imagePickerButton} 
              onPress={pickImage}
            >
              {selectedImage ? (
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.previewImage} 
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="camera-outline" size={40} color="#666" />
                  <Text style={styles.placeholderText}>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#12435a',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#12435a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePickerButton: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  barcodeExists: {
    borderColor: '#ff9800',
    backgroundColor: '#fff3e0',
  },
  barcodeExistsText: {
    color: '#ff9800',
    fontWeight: '500',
  },
});
