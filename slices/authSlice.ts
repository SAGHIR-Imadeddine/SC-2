import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserBySecretKey } from '~/services/api/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Warehouseman, AuthState } from '~/types/types';


const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk<Warehouseman, string>(
    'auth/login',

    async (secretKey: string, { rejectWithValue }) => {
      
        try {       
            console.log(secretKey)
            const user : Warehouseman = await getUserBySecretKey(secretKey);
            console.log(user);
            
            if (!user) return rejectWithValue('Invalid secret key');

            await AsyncStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return rejectWithValue('Error connecting  server');
        }
    }
  );

  export const loadUser = createAsyncThunk(
    'auth/loadUser', 
    
    async (_, { rejectWithValue }) => {
        try {
            const userData = await AsyncStorage.getItem('user');
            console.log(userData);
            return userData ? JSON.parse(userData) : null;
          } catch (error) {
            return rejectWithValue('Failed to restore session');
          }
  });

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.removeItem('user');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<Warehouseman>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<Warehouseman | null>) => {
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        // console.log(state.user);
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
