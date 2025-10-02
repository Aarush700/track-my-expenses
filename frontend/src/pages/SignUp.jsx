import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");

            const signinRes = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
                credentials: "include",
            });
            const userData = await signinRes.json();
            if (!signinRes.ok) throw new Error(userData.message || "Sign-in failed");
            if (!userData.user || !userData.user._id) {
                throw new Error("Invalid user data from server");
            }
            dispatch(signInSuccess(userData.user));
            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full">
                <h1 className="text-4xl text-center font-bold mb-8">Sign Up</h1>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        className="p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
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
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p>Already have an account? <Link to="/sign-in" className="text-blue-600 hover:underline">Sign In</Link></p>
                </div>
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}

export default SignUp;