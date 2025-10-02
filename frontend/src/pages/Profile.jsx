import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    updateUserStart,
    updateUserFailure,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOut,
} from "../redux/user/userSlice";

function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || "",
                email: currentUser.email || "",
                password: formData.password,
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser?._id) {
            setError("User ID is missing. Please sign in again.");
            return;
        }
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(updateUserSuccess(data.user));
                setSuccess("Profile updated successfully!");
                setFormData({ ...formData, password: "" });
            } else {
                dispatch(updateUserFailure(data.message));
                setError(data.message || "Update failed");
            }
        } catch (error) {
            dispatch(updateUserFailure(error.message));
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
        if (!currentUser?._id) {
            setError("User ID is missing. Please sign in again.");
            return;
        }
        setError("");
        setSuccess("");
        setLoading(true);
        dispatch(deleteUserStart());

        try {
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(deleteUserSuccess());
                navigate("/sign-in");
            } else {
                dispatch(deleteUserFailure(data.message));
                setError(data.message || "Delete failed");
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/signout", { credentials: "include" });
            dispatch(signOut());
            navigate("/sign-in");
        } catch (error) {
            // Handle error silently
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <img
                    src={currentUser?.profilePicture}
                    alt="Profile"
                    className="mt-2 h-24 w-24 self-center rounded-full object-cover border-2"
                />

                <input
                    type="text"
                    id="username"
                    className="bg-slate-100 rounded-lg p-3"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    id="email"
                    className="bg-slate-100 rounded-lg p-3"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="New Password (leave blank to keep current)"
                    className="bg-slate-100 rounded-lg p-3"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer hover:opacity-95 disabled:opacity-70"
                >
                    {loading ? "Updating..." : "Update"}
                </button>
            </form>

            {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
            {success && <p className="text-green-600 mt-3 text-center">{success}</p>}

            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteAccount}
                    className="text-red-700 cursor-pointer hover:underline"
                >
                    Delete Account
                </span>
                <span onClick={handleSignOut} className="text-red-700 cursor-pointer hover:underline">
                    Sign Out
                </span>
            </div>
        </div>
    );
}

export default Profile;