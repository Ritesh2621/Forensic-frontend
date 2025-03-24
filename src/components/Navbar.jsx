import React from 'react'
import { Fingerprint } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const Navbar = () => {
  const [cookies, removeCookies] = useCookies(['access_token']) // Add userName if it's stored in cookies
  const navigate = useNavigate();

  // Function to manually remove a cookie
  const removeCookie = (name) => {
    document.cookie = `${name}=; path=/;`;
  };

  // Function to handle logout
  const handleLogout = () => {
    removeCookie('access_token');  // Remove the access_token cookie manually
    window.localStorage.removeItem('userId'); // Remove userId from localStorage
    navigate("/");
    window.location.reload();
  };

  const isAuthenticated = !!cookies.access_token

  return (
    <nav className="py-4 px-6 lg:px-12 flex justify-between items-center border-b border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex items-center gap-2">
        <Fingerprint className="h-8 w-8 text-indigo-500" />
        <Link to='/' className="text-xl font-bold">ForensicVision</Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
        <Link to='/feature' className="hover:text-indigo-400 transition-colors">Features</Link>
        <Link to='/about' className="hover:text-indigo-400 transition-colors">About</Link>
      </div>

      {/* Conditionally show Login or Logout */}
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Logout
        </button>
      ) : (
        <Link
          to='/login'
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
