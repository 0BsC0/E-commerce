import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addItem,
  removeFromCart as removeItem,
  clearCart as clearAll
} from "@/services/cartService";
import { AuthContext } from "@/context/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, handleTokenError } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (user?.token) loadCart();
    else setCartItems([]);
  }, [user]);

  const loadCart = async () => {
    if (!user?.token) return;
    setLoadingCart(true);
    try {
      const items = await getCart(user.token);
      setCartItems(items);
    } catch (error) {
      console.error("❌ Error al cargar carrito:", error);
      handleTokenError(error);
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user?.token) return;
    try {
      await addItem(productId, quantity, user.token);
      await loadCart();
    } catch (error) {
      console.error("❌ Error al agregar al carrito:", error);
      handleTokenError(error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user?.token) return;
    try {
      await removeItem(itemId, user.token);
      await loadCart();
    } catch (error) {
      console.error("❌ Error al eliminar del carrito:", error);
      handleTokenError(error);
    }
  };

  const clearCart = async () => {
    if (!user?.token) return;
    try {
      await clearAll(user.token);
      setCartItems([]);
    } catch (error) {
      console.error("❌ Error al vaciar carrito:", error);
      handleTokenError(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        loadingCart,
        addToCart,
        removeFromCart,
        clearCart,
        reloadCart: loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
