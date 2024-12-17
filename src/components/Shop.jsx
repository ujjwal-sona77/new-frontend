import React, { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState({});

  const getEmailFromToken = () => {
    const token = document.cookie.split("=")[1];
    if (!token) {
      return null; // Return null instead of throwing an error
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email;
  };

  const email = getEmailFromToken();

  const getProducts = async () => {
    try {
      const response = await axios.get(`
        ${import.meta.env.VITE_BACKEND_URL}/api/owner/allproducts/`);
      setProducts(response.data.products);
    } catch (err) {
      setError(err.message);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${email}`
      );
      setUser(response.data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getProducts();
    getUser();
  }, []);

  if (!products) {
    return (
      <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
        <l-waveform size="35" stroke="3.5" speed="1" color="black"></l-waveform>
      </div>
    );
  }

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <img
                  src="/images/logo.png"
                  className="h-8 w-auto transform group-hover:scale-110 transition-transform duration-300"
                  alt="Logo"
                />
                <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  getFast
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/shop"
                className="menu-transition text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Shop
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/owner/createproduct"
                  className="menu-transition text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
                >
                  Create Product
                </Link>
              )}
              <Link
                to="/cart"
                className="menu-transition text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Cart
              </Link>
              <Link
                to="/profile"
                className="menu-transition text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main
        className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        data-scroll-section
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm fade-in">
              <h3 className="font-medium text-gray-900 mb-4 text-lg">
                Sort By
              </h3>
              <form action="/shop" className="flex items-center">
                <select
                  name="sortby"
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                </select>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm fade-in">
              <h3 className="font-medium text-gray-900 mb-4 text-lg">
                Categories
              </h3>
              <div className="flex flex-col space-y-3">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  New Collection
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  All Products
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Discounted Products
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm fade-in">
              <h3 className="font-medium text-gray-900 mb-4 text-lg">
                Filters
              </h3>
              <div className="flex flex-col space-y-3">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Availability
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Discount
                </Link>
              </div>
            </div>
            {success && (
              <div className="mt-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm md:text-base">{success}</p>
                    <button
                      onClick={(e) =>
                        e.target.parentElement.parentElement.remove()
                      }
                      className="ml-4 text-white hover:text-green-200 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-50">
                    <img
                      src={`data:image/jpeg;base64,${Buffer.from(
                        product.image
                      ).toString("base64")}`}
                      alt={product.name}
                      className="h-64 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {Math.round(
                            (product.discount /
                              (product.price + product.discount)) *
                              100
                          )}
                          % OFF
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    <div className="flex items-end justify-between">
                      <div>
                        {product.discount ? (
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{product.price - product.discount}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{product.price}
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{product.price}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await axios.post(
                              `${
                                import.meta.env.VITE_BACKEND_URL
                              }/api/cart/add/${product._id}/${email}`
                            );
                            setSuccess("Added to cart successfully!");
                          } catch (err) {
                            setError("Failed to add to cart");
                          }
                        }}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                        aria-label="Add to cart"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shop;
