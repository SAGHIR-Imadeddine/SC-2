import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductState, WarehouseStock } from '~/types/types';
import { getAllProducts, getProductByBarcode, getProductById } from '~/services/api/productServices';



const initialState: ProductState = {
    products: [],
    product: null,
    loading: false,
    error: null,
}

export const fetchProducts = createAsyncThunk<Product[], void>(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllProducts();
            return response;
        } catch (error: any) {
            return rejectWithValue('Error fetching products: ' + error.message);
        }
    }
)           

export const fetchProductById = createAsyncThunk<Product, number>(
    'products/fetchProductById',
    async (id: number, { rejectWithValue }) => {
        try {            
            const response = await getProductById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue('Error fetching product: ' + error.message);
        }
    }
)   

export const fetchProductByBarcode = createAsyncThunk<Product, string>(
    'products/fetchProductByBarcode',
    async (barcode: string, { rejectWithValue }) => {
        try {
            const response = await getProductByBarcode(barcode);
            return response;
        } catch (error: any) {
            return rejectWithValue('Error fetching product: ' + error.message);
        }
    }
)  
   

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ------------------------fetch all products
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Error fetching products';
        });

        // ------------------------fetch product by id
        builder.addCase(fetchProductById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
            state.loading = false;
            state.product = action.payload;
        });
        builder.addCase(fetchProductById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Error fetching product';
        });

        // ------------------------fetch product by barcode
        builder.addCase(fetchProductByBarcode.pending, (state) => {
            state.loading = true;
            state.error = null;
        });     
        builder.addCase(fetchProductByBarcode.fulfilled, (state, action: PayloadAction<Product>) => {
            state.loading = false;
            state.product = action.payload;
        });
        builder.addCase(fetchProductByBarcode.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Error fetching product';
        });
    },
})                          

export default productSlice.reducer;