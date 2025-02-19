import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts, fetchProductById } from '../slices/poductSlice';
import { useEffect } from 'react';

export const useFetchAllProducts = () => {
   
    const dispatch = useDispatch<AppDispatch>();
    const { products, product, loading, error } = useSelector((state: RootState) => state.products);
    
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // useEffect(() => {
    //     dispatch(fetchProductById(product?.id as number));
    // }, [dispatch, product]);  

    return { products, product, loading, error };
           
}