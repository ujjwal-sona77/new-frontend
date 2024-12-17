import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate("/shop");
      } else if (response.data.message && !response.data.success) {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {error}
        </div>
      )}
      <main className="bg-zinc-800 min-h-screen">
        <nav className="flex justify-between items-center p-4 sm:p-6 bg-zinc-800 text-white">
          <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            getFast
          </span>
        </nav>

        <div className="px-4 py-8 sm:py-12">
          <form
            onSubmit={handleSubmit}
            method="post"
            className="max-w-sm mx-auto bg-zinc-900 p-6 sm:p-8 rounded-lg shadow-lg"
          >
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 text-sm rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full p-3 text-sm rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 focus:ring-blue-600 ring-offset-gray-800"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
            </div>

            <input
              type="submit"
              className="w-full p-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-800 transition-colors"
              value="Login"
            />

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-400">
                Don't have an account?
              </span>
              <Link
                to="/"
                className="text-sm text-blue-500 hover:text-blue-400 ml-1 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Login;
