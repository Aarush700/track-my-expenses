import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
        securityQuestion: "Whats your favorite color?",
        securityAnswer: "",
        newPassword: "",
    });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (status.message) setStatus({ type: "", message: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                setStatus({ type: "success", message: data.message });
                setTimeout(() => navigate("/sign-in"), 2000); // Redirect after 2s
            } else {
                setStatus({ type: "error", message: data.message || "Something went wrong." });
            }
        } catch (error) {
            setStatus({ type: "error", message: "Failed to reset password. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full border border-gray-300 rounded-lg p-6 shadow-md">
                <h1 className="text-4xl text-center font-bold mb-8">Forgot Password</h1>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <select
                        id="securityQuestion"
                        value={formData.securityQuestion}
                        onChange={handleChange}
                        className="p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="Whats your favorite color?">Whats your favorite color?</option>
                        <option value="Whats your pets name?">Whats your pets name?</option>
                        <option value="Whats your first school?">Whats your first school?</option>
                    </select>
                    <input
                        type="text"
                        id="securityAnswer"
                        value={formData.securityAnswer}
                        onChange={handleChange}
                        placeholder="Answer"
                        className="p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="New Password"
                        className="p-4 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-400 transition duration-200"
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p>
                        Remember your password?{" "}
                        <Link to="/sign-in" className="text-blue-600 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
                {status.message && (
                    <p className={`text-center mt-4 ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {status.message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;