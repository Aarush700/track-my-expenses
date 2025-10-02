import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { useState } from "react";

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = () => {
        dispatch(signOut());
        window.location.href = "/sign-in";
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
                <div className="flex items-center gap-4">
                    <img
                        src="src/assets/images/logo.png"
                        alt="Expense Tracker Logo"
                        className="h-9 w-auto"
                    />
                    <Link to={currentUser ? "/dashboard" : "/"}>
                        <h1 className="text-2xl font-bold">Expense Tracker</h1>
                    </Link>
                </div>

                {/* Hamburger Button for Mobile */}
                <button
                    className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span
                        className={`block h-0.5 w-6 bg-white transform transition duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""
                            }`}
                    ></span>
                    <span
                        className={`block h-0.5 w-6 bg-white transition duration-300 ${isMenuOpen ? "opacity-0" : ""
                            }`}
                    ></span>
                    <span
                        className={`block h-0.5 w-6 bg-white transform transition duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                            }`}
                    ></span>
                </button>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-6 items-center">
                    {!currentUser && (
                        <Link to="/">
                            <li className="hover:text-blue-200 transition">Home</li>
                        </Link>
                    )}
                    {currentUser && (
                        <Link to="/dashboard">
                            <li className="hover:text-blue-200 transition">Dashboard</li>
                        </Link>
                    )}
                    {currentUser && (
                        <Link to="/transactions">
                            <li className="hover:text-blue-200 transition">Transactions</li>
                        </Link>
                    )}
                    <Link to="/contact">
                        <li className="hover:text-blue-200 transition">Contact Us</li>
                    </Link>
                </ul>

                {/* Desktop User Actions */}
                <ul className="hidden md:flex gap-6 items-center">
                    {currentUser ? (
                        <>
                            <Link to="/profile">
                                <img
                                    src={currentUser.profilePicture}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                                />
                            </Link>
                            <Link to="/sign-in" onClick={handleSignOut}>
                                <li className="hover:text-blue-200 transition">Logout</li>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/sign-in">
                                <li className="hover:text-blue-200 transition">Sign In</li>
                            </Link>
                            <Link to="/sign-up">
                                <li className="hover:text-blue-200 transition">Sign Up</li>
                            </Link>
                        </>
                    )}
                </ul>

                {/* Mobile Navigation Menu */}
                <div
                    className={`md:hidden fixed top-0 right-0 h-full w-64 bg-blue-800 text-white transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <button
                        className="p-4 text-right text-2xl"
                        onClick={toggleMenu}
                        aria-label="Close navigation menu"
                    >
                        &times;
                    </button>
                    <ul className="flex flex-col gap-4 p-4">
                        {!currentUser && (
                            <Link to="/" onClick={toggleMenu}>
                                <li className="hover:text-blue-200 transition">Home</li>
                            </Link>
                        )}
                        {currentUser && (
                            <Link to="/dashboard" onClick={toggleMenu}>
                                <li className="hover:text-blue-200 transition">Dashboard</li>
                            </Link>
                        )}
                        {currentUser && (
                            <Link to="/transactions" onClick={toggleMenu}>
                                <li className="hover:text-blue-200 transition">Transactions</li>
                            </Link>
                        )}
                        <Link to="/contact" onClick={toggleMenu}>
                            <li className="hover:text-blue-200 transition">Contact Us</li>
                        </Link>
                        {currentUser ? (
                            <>
                                <Link to="/profile" onClick={toggleMenu}>
                                    <li className="hover:text-blue-200 transition">Profile</li>
                                </Link>
                                <Link to="/sign-in" onClick={() => { handleSignOut(); toggleMenu(); }}>
                                    <li className="hover:text-blue-200 transition">Logout</li>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/sign-in" onClick={toggleMenu}>
                                    <li className="hover:text-blue-200 transition">Sign In</li>
                                </Link>
                                <Link to="/sign-up" onClick={toggleMenu}>
                                    <li className="hover:text-blue-200 transition">Sign Up</li>
                                </Link>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}