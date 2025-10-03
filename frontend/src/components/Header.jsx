import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { useState } from "react";
import { Menu, X, LogOut, User, LayoutDashboard, Receipt, Mail } from "lucide-react";

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
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3">
                {/* Logo and Brand */}
                <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center gap-3 group">
                    <div className="relative">
                        <img
                            src="src/assets/images/logo.png"
                            alt="Expense Tracker Logo"
                            className="h-10 w-auto transition-transform group-hover:scale-105"
                        />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Expense Tracker
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {!currentUser && (
                        <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium">
                            Home
                        </Link>
                    )}
                    {currentUser && (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link to="/transactions" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium">
                                <Receipt className="w-4 h-4" />
                                Transactions
                            </Link>
                        </>
                    )}
                    <Link to="/contact" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium">
                        <Mail className="w-4 h-4" />
                        Contact
                    </Link>
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {currentUser ? (
                        <>
                            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <img
                                    src={currentUser.profilePicture}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 hover:border-gray-400 transition-colors"
                                />
                                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                                    {currentUser.username}
                                </span>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/sign-in"
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/sign-up"
                                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6 text-gray-700" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-700" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleMenu}
            >
                <div
                    className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                        <button
                            onClick={toggleMenu}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close navigation menu"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="flex flex-col h-full">
                        <nav className="flex-1 overflow-y-auto p-4">
                            <ul className="space-y-2">
                                {!currentUser && (
                                    <li>
                                        <Link
                                            to="/"
                                            onClick={toggleMenu}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                )}
                                {currentUser && (
                                    <>
                                        <li>
                                            <Link
                                                to="/dashboard"
                                                onClick={toggleMenu}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                                            >
                                                <LayoutDashboard className="w-5 h-5" />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/transactions"
                                                onClick={toggleMenu}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                                            >
                                                <Receipt className="w-5 h-5" />
                                                Transactions
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <Link
                                        to="/contact"
                                        onClick={toggleMenu}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Contact Us
                                    </Link>
                                </li>
                                {currentUser && (
                                    <li>
                                        <Link
                                            to="/profile"
                                            onClick={toggleMenu}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                                        >
                                            <User className="w-5 h-5" />
                                            Profile
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </nav>

                        {/* Mobile Menu Footer with Auth Actions */}
                        <div className="border-t border-gray-200 p-4 space-y-3">
                            {currentUser ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                                        <img
                                            src={currentUser.profilePicture}
                                            alt="Profile"
                                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {currentUser.username}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {currentUser.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleSignOut(); toggleMenu(); }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/sign-in"
                                        onClick={toggleMenu}
                                        className="block w-full px-4 py-3 text-center border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/sign-up"
                                        onClick={toggleMenu}
                                        className="block w-full px-4 py-3 text-center bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}