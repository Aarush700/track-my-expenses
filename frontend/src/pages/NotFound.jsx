import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="p-6 max-w-lg mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
                    >
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-800 transition duration-200"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;