import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import ProfileDropdown from "../layout/ProfileDropdown";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const { isAuthenticated, user, logout } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <header 
            className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white border-b border-transparent
            ${isScrolled ? "shadow-md py-3" : "py-5"}`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    
                    <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer">
                        <div className="w-11.5 h-11.5 bg-blue-900 rounded-lg flex items-center justify-center shadow-sm">
                           <img src="/src/assets/logo.png" alt="Logo" className="w-7.5 h-7.5" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            TS FinVest
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative text-lg font-medium text-gray-600 transition-colors duration-300 hover:text-gray-900
                                after:content-[''] 
                                after:absolute 
                                after:left-0 
                                after:bottom-[-4px] 
                                after:h-[2px] 
                                after:bg-gray-900 
                                after:w-0 
                                after:transition-all 
                                after:duration-300 
                                hover:after:w-full"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center gap-6">
                        {isAuthenticated ? ( 
                            <ProfileDropdown
                                isOpen={profileDropdownOpen}
                                onToggle={(e) => {
                                    e.stopPropagation();
                                    setProfileDropdownOpen(!profileDropdownOpen);
                                }}
                                avatar={user?.avatar || ""}
                                name={user?.name || "User"}
                                email={user?.email || ""}
                                onLogout={logout}
                            />
                        ) : ( 
                            <>
                                <Link
                                    to="/login"
                                    className="text-lg font-medium text-gray-900 hover:text-blue-900 transition-colors"
                                >
                                    Login
                                </Link>
                                
                                <Link
                                    to="/signup"
                                    className="text-white px-7 py-3 rounded-lg text-lg font-medium transition-all duration-200 shadow-sm 
                                    bg-gradient-to-r from-blue-950 to-blue-900 
                                    hover:brightness-110 hover:shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 space-y-4 bg-white border-t border-gray-100 pt-4">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href}
                                className="block text-gray-600 hover:text-gray-900 text-lg font-medium px-2 py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="flex flex-col gap-4 mt-6 px-2">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 py-2 px-2 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                                            <p className="text-sm text-gray-600">{user?.email || ''}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-900 text-lg font-medium py-2 px-2 hover:text-blue-900"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-left text-red-600 hover:text-red-700 text-lg font-medium py-2 px-2"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="text-gray-900 text-lg font-medium py-2 px-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    
                                    <Link 
                                        to="/signup" 
                                        className="text-white text-center py-3 rounded-lg text-lg font-medium bg-gradient-to-r from-blue-950 to-blue-900 hover:brightness-110"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header