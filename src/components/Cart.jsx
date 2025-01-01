import { useState, useEffect, React } from "react";
import axios from "axios";
import Buffer from "buffer";
import { Link } from "react-router-dom";

const Cart = () => {
  const [user, setUser] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState(null);

  const getEmailFromToken = () => {
    try {
      const token = document.cookie.split("=")[1];
      if (!token) {
        return null;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email;
    } catch (err) {
      setError("Invalid authentication token");
      return null;
    }
  };

  const email = getEmailFromToken();

  const getUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${email}`);
      setUser(response.data.user);
      if (response.data.user.cart) {
        // Group same products and add quantities
        const groupedCart = response.data.user.cart.reduce((acc, item) => {
          const existingItem = acc.find(i => i._id === item._id);
          if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
            return acc;
          }
          return [...acc, {...item, quantity: 1}];
        }, []);
        
        setCartItems(groupedCart);
        calculateSubtotal(groupedCart);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching user data");
    }
  };

  const calculateSubtotal = (items) => {
    try {
      const total = items.reduce((acc, item) => {
        const price = item.discount ? item.price - item.discount : item.price;
        return acc + price * (item.quantity || 1);
      }, 0);
      setSubtotal(total);
    } catch (err) {
      setError("Error calculating subtotal");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleQuantityChange = async (itemId, action) => {
    try {
      if (action === "increase") {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/increase/${itemId}/${email}`);
      } else if (action === "decrease") {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/decrease/${itemId}/${email}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${itemId}/${email}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error removing item");
    }
  };

  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/shop"
            className="flex items-center space-x-3 rtl:space-x-reverse animate__animated animate__fadeIn"
          >
            <img src="/images/logo.png" className="h-8 w-auto" alt="Logo" />
            <span className="self-center text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              getFast
            </span>
          </Link>
          <Link
            to="/shop"
            className="text-gray-500 hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base animate__animated animate__fadeIn"
          >
            Continue Shopping
          </Link>
        </div>
      </nav>

      <div
        className="container mx-auto px-4 py-20 sm:py-24"
        data-scroll-section
      >
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg fade-in">
            {error}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-gray-900 dark:text-white fade-in">
          Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
          <div className="w-full lg:w-2/3">
            {cartItems.length > 0 ? (
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const discountedPrice = item.discount
                    ? item.price - item.discount
                    : item.price;
                  return (
                    <div
                      key={item._id}
                      className="cart-item bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm fade-in"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-6">
                          <img
                            src={`data:image/png/jpg;base64,${Buffer.Buffer.from(
                              item.image
                            ).toString("base64")}`}
                            alt={item.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md"
                          />
                          <div>
                            <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
                              {item.name}
                            </h3>
                            <div className="space-y-1">
                              {item.discount ? (
                                <>
                                  <p className="text-green-600 text-lg font-semibold">
                                    ₹{discountedPrice.toFixed(2)}
                                  </p>
                                  <p className="text-gray-400 line-through text-sm">
                                    ₹{item.price.toFixed(2)}
                                  </p>
                                </>
                              ) : (
                                <p className="text-green-600 text-lg font-semibold">
                                  ₹{item.price.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <button
                              onClick={async () => {
                                await handleQuantityChange(
                                  item._id,
                                  "decrease"
                                );
                                window.location.reload();
                              }}
                              className="quantity-btn px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                handleQuantityChange(item._id, "increase");
                                window.location.reload();
                              }}
                              className="quantity-btn px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              handleRemoveItem(item._id);
                              window.location.reload();
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm fade-in">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Your cart is empty
                </p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start Shopping →
                </Link>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm fade-in sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                  <Link
                    to="/checkout"
                    className="w-full mt- bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
