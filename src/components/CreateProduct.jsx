import { useState, React } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create/product`, { name, price, discount , image},  {withCredentials: true} ,{
        headers: {
          "Content-Type": "multipart/form-data",
        } 
      });
      if(response.data.success){
        navigate("/owner/createproduct");
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    {success && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
        {success}
      </div>
    )}
      <div className="min-h-screen flex flex-col">
        <div className="container px-4 sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-20 flex flex-col lg:flex-row flex-grow">
          {/* Sidebar */}
          <div className="w-full lg:w-[25%] mb-8 lg:mb-0">
            <div className="flex flex-row lg:flex-col space-x-4 lg:space-x-0">
              <Link
                className="block w-fit mb-0 lg:mb-2 hover:text-blue-500"
                to="/owner/allproducts"
              >
                All Products
              </Link>
              <Link
                className="block w-fit mb-0 lg:mb-2 hover:text-blue-500"
                to="/owner/createproduct"
              >
                Create new product
              </Link>
              <Link
                className="block w-fit mb-0 lg:mb-2 hover:text-blue-500"
                to="/shop"
              >
                Shop
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <main className="w-full lg:w-3/4 bg-white p-4 sm:p-6 lg:p-8 shadow-lg rounded-lg lg:ml-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
              Create New Product
            </h2>

            <form
              autoComplete="off"
              method="POST"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">
                  Product Details
                </h3>
                <div className="mb-4 sm:mb-6">
                  <label className="block mb-2 font-medium text-gray-600">
                    Product Image
                  </label>
                  <input
                    name="image"
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    className="py-2 px-4 rounded border border-gray-300 w-full text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-600">
                      Product Name
                    </label>
                    <input
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Enter product name"
                      className="border border-gray-300 p-2 sm:p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-600">
                      Product Price
                    </label>
                    <input
                      name="price"
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      className="border border-gray-300 p-2 sm:p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-600">
                      Discount Price
                    </label>
                    <input
                      name="discount"
                      onChange={(e) => setDiscount(e.target.value)}
                      type="number"
                      step="0.01"
                      placeholder="Enter discount price"
                      className="border border-gray-300 p-2 sm:p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
              <input
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
                value="Create Product"
              />
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
