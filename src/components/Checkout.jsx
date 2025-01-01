import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";
import { Buffer } from "buffer";

const Checkout = () => {
  const [user, setUser] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [fullname, setFullname] = useState(user.fullname || "");
  const [postalcode, setPostalcode] = useState(user.postalcode || "");
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        fullname,
        address,
        city,
        postalcode,
        contactno: phone,
        products: cartItems.map(item => item._id),
        paymentMethod: "Cash on Delivery"
      };

      const response = await axios.post(`/api/orders/create/${email}`, orderData);
      if (response.data.success) {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error placing order");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/shop" className="flex items-center space-x-3 rtl:space-x-reverse animate__animated animate__fadeIn">
            <img src="/images/logo.png" className="h-8 w-auto" alt="Logo" />
            <span className="self-center text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">getFast</span>
          </Link>
          <Link to="/cart" className="text-gray-500 hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base animate__animated animate__fadeIn">
            Back to Cart
          </Link>
        </div>
      </nav>

      <div className="min-h-screen pt-20" data-scroll-section>
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} method="post">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Shipping Information */}
              <div className="w-full lg:w-2/3 space-y-6">
                <div className="bg-gray-50 rounded-xl shadow-lg p-6 checkout-section fade-in animate__animated animate__fadeInLeft">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shipping Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                        <input type="text" name="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full border rounded-lg p-3 input-field focus:outline-none" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
                      <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded-lg p-3 input-field focus:outline-none" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">City</label>
                            <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border rounded-lg p-3 input-field focus:outline-none" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Postal Code</label>
                        <input type="text" name="postalcode" value={postalcode} onChange={(e) => setPostalcode(e.target.value)} className="w-full border rounded-lg p-3 input-field focus:outline-none" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                      <input type="tel" name="contactno" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg p-3 input-field focus:outline-none" required />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-xl shadow-lg p-6 checkout-section fade-in animate__animated animate__fadeInLeft" style={{animationDelay: "0.2s"}}>
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="payment-option p-3 rounded-lg">
                      <input type="radio" id="cod" name="paymentMethod" value="cod" className="w-4 h-4 text-blue-600" required />
                      <label htmlFor="cod" className="ml-2 text-gray-700">Cash on Delivery</label>
                    </div>
                    <div className="payment-option p-3 rounded-lg">
                      <input type="radio" id="card" name="paymentMethod" value="card" className="w-4 h-4 text-blue-600" />
                      <label htmlFor="card" className="ml-2 text-gray-700">Credit/Debit Card</label>
                    </div>
                    <div className="payment-option p-3 rounded-lg">
                      <input type="radio" id="upi" name="paymentMethod" value="upi" className="w-4 h-4 text-blue-600" />
                      <label htmlFor="upi" className="ml-2 text-gray-700">UPI Payment</label>
                    </div>
                    <div className="payment-option p-3 rounded-lg">
                      <input type="radio" id="netbanking" name="paymentMethod" value="netbanking" className="w-4 h-4 text-blue-600" />
                      <label htmlFor="netbanking" className="ml-2 text-gray-700">Net Banking</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-1/3">
                <div className="bg-gray-50 rounded-xl shadow-lg p-6 checkout-section sticky top-24 fade-in animate__animated animate__fadeInRight">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => {
                      const discountedPrice = item.discount ? item.price - item.discount : item.price;
                      return (
                        <div key={item._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                          <img 
                            src={`data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                            <p className="text-sm font-medium">
                              {item.discount ? (
                                <>
                                  <span className="text-green-600">₹{(discountedPrice * (item.quantity || 1)).toFixed(2)}</span>
                                  <span className="text-gray-400 line-through ml-1">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                                </>
                              ) : (
                                `₹${(discountedPrice * (item.quantity || 1)).toFixed(2)}`
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span className="text-blue-600">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transform transition hover:scale-105">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
