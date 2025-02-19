import { useSelector } from 'react-redux';
import { Product } from '~/types/types';
import { RootState } from '~/store/store';
import { useCallback, useState, useEffect } from 'react';

interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  mostAddedProducts: Product[];
  mostRemovedProducts: Product[];
}
export const useStatistics = () => {
  const products : Product[] = useSelector((state: RootState) => state.products.products);
  const [statistics, setStatistics] = useState<Statistics>({
    totalProducts: 0,
    outOfStock: 0,
    totalStockValue: 0,
    mostAddedProducts: [],
    mostRemovedProducts: []
  });

  const calculateStatistics = useCallback(async () => {
    const stats = {
      totalProducts: products.length,
      outOfStock: products.filter(product => {
        const totalQuantity = product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) ?? 0;
        return totalQuantity === 0;
      }).length,
      totalStockValue: products.reduce((total, product) => {
        const quantity = product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) ?? 0;
        return total + quantity;
      }, 0),
      mostAddedProducts: products
        .map(product => ({
          id: product.id,
          name: product.name,
          quantity: product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) ?? 0
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
      mostRemovedProducts: products
        .map(product => ({
          id: product.id,
          name: product.name,
          quantity: product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) ?? 0
        }))
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5)
    };
    
    setStatistics(stats as any);
    return stats;
  }, [products]);

  // Initial calculation
  useEffect(() => {
    calculateStatistics();
  }, [products]);

  return {
    statistics,
    recalculate: calculateStatistics
  };
}; 