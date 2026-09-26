/**
 * 野有蔓草 · 购物车与订单状态管理
 * 数据按用户隔离：yeyou_mancao_cart_${username} 与 yeyou_mancao_orders_${username}
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Order } from '../types';
import { useAuth } from './AuthContext';
import { BRAND_CONFIG } from '../config';

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalCount: number;
  createOrder: (consignee: { name: string; phone: string; address: string; notes?: string }) => Order | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // 获取特定用户的存储 Key
  const getCartKey = useCallback((username: string) => {
    return `${BRAND_CONFIG.localStorageKeys.cartPrefix}${username.toLowerCase()}`;
  }, []);

  const getOrdersKey = useCallback((username: string) => {
    return `${BRAND_CONFIG.localStorageKeys.ordersPrefix}${username.toLowerCase()}`;
  }, []);

  // 当登录用户变化时，加载该用户的购物车与订单历史
  useEffect(() => {
    if (currentUser?.username) {
      try {
        const cartData = localStorage.getItem(getCartKey(currentUser.username));
        setCart(cartData ? JSON.parse(cartData) : []);

        const ordersData = localStorage.getItem(getOrdersKey(currentUser.username));
        setOrders(ordersData ? JSON.parse(ordersData) : []);
      } catch (e) {
        console.error('Failed to load user cart/orders', e);
      }
    } else {
      setCart([]);
      setOrders([]);
    }
  }, [currentUser, getCartKey, getOrdersKey]);

  // 同步购物车到 localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (currentUser?.username) {
      localStorage.setItem(getCartKey(currentUser.username), JSON.stringify(newCart));
    }
  };

  // 加入购物车
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const existingIndex = cart.findIndex(
      i =>
        i.garmentId === item.garmentId &&
        i.size === item.size &&
        i.color === item.color &&
        i.fabric === item.fabric
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += item.quantity;
    } else {
      const newItem: CartItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      };
      updated = [newItem, ...cart];
    }

    saveCart(updated);
  };

  // 修改数量
  const updateQuantity = (id: string, delta: number) => {
    const updated = cart
      .map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    saveCart(updated);
  };

  // 从购物车移除
  const removeFromCart = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    saveCart(updated);
  };

  // 清空购物车
  const clearCart = () => {
    saveCart([]);
  };

  // 创建订单并清空购物车
  const createOrder = (consignee: { name: string; phone: string; address: string; notes?: string }): Order | null => {
    if (!currentUser || cart.length === 0) return null;

    const timestamp = Date.now();
    const orderId = `YYMC${timestamp}`;
    const newOrder: Order = {
      orderId,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      items: [...cart],
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: '待处理',
      consignee
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(getOrdersKey(currentUser.username), JSON.stringify(updatedOrders));

    // 清空购物车
    clearCart();

    return newOrder;
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalCount,
        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
