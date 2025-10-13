import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";

function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Sign-in failed");
            if (!data.user || !data.user._id) {
                throw new Error("Invalid user data from server");
            }
            dispatch(signInSuccess(data.user));
            navigate("/dashboard");
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full border border-gray-300 rounded-lg p-6 shadow-md">
                <h1 className="text-4xl text-center font-bold mb-8">Sign In</h1>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        className="p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        className="p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <button
                        disabled={loading}
                        type="submit"
                        className="p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-400 transition duration-200"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p>
                        New user?{" "}
                        <Link to="/sign-up" className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                    <p className="mt-2">
                        Forgot password?{" "}
                        <Link to="/forgot-password" className="text-blue-600 hover:underline">
                            Reset Password
                        </Link>
                    </p>
                </div>
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default SignIn;