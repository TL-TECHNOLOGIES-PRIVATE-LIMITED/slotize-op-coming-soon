import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-red-500">404</h1>
        <p className="text-2xl md:text-3xl font-semibold mt-4">
          Oops! The page you are looking for doesn't exist.
        </p>
        <p className="text-lg mt-2 text-gray-600">
          You may have mistyped the address or the page may have moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md transition-all"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
