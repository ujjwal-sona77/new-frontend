import React, { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";
const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);

  const getEmailFromToken = () => {
    const token = document.cookie.split("=")[1];
    if (!token) {
      return null; // Return null instead of throwing an error
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email;
  };

  const email = getEmailFromToken();

  const getUser = async () => {
    try {
      if (!email) return; // Check if email is null before making the request
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${email}`
      );
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return (
      <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
        <l-waveform size="35" stroke="3.5" speed="1" color="black"></l-waveform>
      </div>
    );
  }

  return (
    <>
      {success && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {success}
        </div>
      )}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/shop"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>{" "}
            Back to Shop
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-6" data-scroll-section>
        <div className="max-w-7xl mx-auto">
          {/* User Profile Card */}
          <div
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover-card fade-up"
            data-scroll
            data-scroll-speed="1"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-100">
                <img src="" alt="" />
                {user.picture ? (
                  <img
                    src={`data:image/png/jpeg;base64,${Buffer.from(
                      user.picture
                    ).toString("base64")}`}
                    alt="Profile Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">
                      {user.fullname[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.fullname}
                </h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <Link
                  to="/users/edit-profile"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>{" "}
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover-card slide-in"
          data-scroll
          data-scroll-speed="1.2"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <Link
              to="/cart"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              View Cart
            </Link>
          </div>

          <div className="space-y-6">
            {user.cart && user.cart.length > 0 ? (
              (() => {
                const groupedItems = {};
                user.cart.forEach((item) => {
                  if (!groupedItems[item._id]) {
                    groupedItems[item._id] = { ...item };
                    groupedItems[item._id].quantity = item.quantity || 1;
                  } else {
                    groupedItems[item._id].quantity += item.quantity || 1;
                  }
                });

                return Object.values(groupedItems).map((item) => (
                  <div
                    className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    key={item._id}
                  >
                    <img
                      src={`data:image/jpeg;base64,${Buffer.from(
                        item.image
                      ).toString("base64")}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      <div className="mt-1">
                        {item.discount ? (
                          <>
                            <span className="text-green-600 font-bold">
                              ₹{(item.price - item.discount) * item.quantity}
                            </span>
                            <span className="text-gray-400 line-through ml-2">
                              ₹{item.price * item.quantity}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-800 font-bold">
                            ₹{item.price * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await axios.post(
                              `/api/cart/decrease/${item._id}/${email}`
                            );
                            if (res.data.message || res.status(200)) {
                              setSuccess(res.data.message);
                            }
                            setTimeout(() => {
                              window.location.reload();
                            }, 700);
                          }}
                          method="post"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                        </form>
                        <span className="px-4 py-2 border-x">
                          {item.quantity}
                        </span>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await axios.post(
                              `/api/cart/increase/${item._id}/${email}`
                            );
                            if (res.data.message || res.status(200)) {
                              setSuccess(res.data.message);
                            }

                            setTimeout(() => {
                              window.location.reload();
                            }, 700);
                          }}
                          method="post"
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </form>
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await axios.post(
                            `/api/cart/remove/${item._id}/${email}`
                          );
                          if (res.data.message || res.status(200)) {
                            setSuccess(res.data.message);
                          }
                          setTimeout(() => {
                            window.location.reload();
                          }, 700);
                        }}
                        method="post"
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="text-red-500 hover:text-red-700 transition-colors"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                ));
              })()
            ) : (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            )}
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg p-6 hover-card fade-up"
          data-scroll
          data-scroll-speed="1.4"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Order History
          </h2>

          {user.orders && user.orders.length > 0 ? (
            <div className="space-y-6">
              {user.orders.map((order) => (
                <div
                  className="border rounded-xl p-6 hover:border-blue-500 transition-colors"
                  key={order._id}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <span className="font-medium">Address:</span>
                          {order.address}
                        </p>
                        <p>
                          <span className="font-medium">Contact:</span>{" "}
                          {order.contactno}
                        </p>
                        <p>
                          <span className="font-medium">Payment:</span>{" "}
                          {order.paymentMethod}
                        </p>
                        <p>
                          <span className="font-medium">City:</span>{" "}
                          {order.city}
                        </p>
                        <p>
                          <span className="font-medium">Postal Code:</span>{" "}
                          {order.postalcode}
                        </p>
                        <p>
                          <span className="font-medium">Subtotal:</span> ₹
                          {order.products.reduce(
                            (total, product) =>
                              total +
                              (product?.price || 0) -
                              (product?.discount || 0),
                            0
                          )}
                        </p>
                        <p>
                          <span className="font-medium">Shipping:</span> ₹50
                        </p>
                        <p className="font-medium text-lg text-gray-800 mt-2">
                          Total: ₹
                          {order.products.reduce(
                            (total, product) =>
                              total +
                              (product?.price || 0) -
                              (product?.discount || 0),
                            0
                          ) + 50}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <details className="group">
                        <summary className="flex justify-between items-center cursor-pointer bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-gray-800">
                            Products
                          </h3>
                          <span className="transform group-open:rotate-180 transition-transform">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </summary>
                        {order.products && order.products.length > 0 ? (
                          <div className="space-y-4 mt-4 pl-4">
                            {order.products.map((product) => (
                              <div
                                className="flex gap-4 p-4 rounded-lg bg-gray-50"
                                key={product._id}
                              >
                                {product?.image ? (
                                  <img
                                    src={`data:image/jpg;base64,${product.image.toString(
                                      "base64"
                                    )}`}
                                    alt={product?.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">
                                      No image
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-800">
                                      {product?.name ||
                                        "Product Name Not Available"}
                                    </h4>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                      x{product.quantity}
                                    </span>
                                  </div>
                                  <div className="mt-1 space-x-2">
                                    <span className="text-gray-600">
                                      ₹{product?.price || 0}
                                    </span>
                                    {product?.discount && (
                                      <span className="text-green-600">
                                        (-₹{product.discount})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {product?.description ||
                                      "No description available"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 mt-4 pl-4">
                            No products found in this order
                          </p>
                        )}
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No orders yet</div>
          )}
        </div>
      </main>
    </>
  );
};

export default Profile;
