import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const EditProfile = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const getEmailFromToken = () => {
    const token = document.cookie.split("=")[1];
    if (!token) {
      return null; // Return null instead of throwing an error
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email;
  };

  const email_Token = getEmailFromToken();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/editprofile/${email_Token}`,
      {
        fullname,
        email,
        picture,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status == 200) {
      setSuccess(res.data.message);
      navigate("/profile");
    } else {
      setError(res.data.message);
    }
  };
  const getUser = async () => {
    try {
      if (!email_Token) return; // Check if email is null before making the request
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${email_Token}`
      );
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    getUser();
  });

  if (!user) {
    return (
      <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
        <l-waveform size="35" stroke="3.5" speed="1" color="black"></l-waveform>
      </div>
    );
  } else {
    return (
      <>
        {success && <div className="text-green-500">{success}</div>}
        <form
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Edit Your Profile
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="picture"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Picture
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-blue-300 rounded-lg">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400">
                      Select a photo
                    </p>
                  </div>
                  <input
                    type="file"
                    name="picture"
                    id="picture"
                    className="opacity-0"
                    onChange={(e) => setPicture(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                id="fullname"
                placeholder={`${user.fullname} , Enter Your New Name`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`${user.email} Enter your new Email`}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Profile
          </button>
        </form>
      </>
    );
  }
};

export default EditProfile;
