import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaCogs, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';
import { api, basePath } from '../services/api';
import { useError } from '../contexts/ErrorContext';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.mode);
  const { showError } = useError();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(basePath + '/logout', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response)
      // return

      if(response.data.status)
      {
        dispatch(logout());
        navigate('/login');
      }
      else
      {
        showError('Something wents wrong!');
      }

    } catch (err) {
      showError(err.response ? err.response.data.message : 'Server error');
    }
  };

  const dropdownClasses = (isOpen) =>
    `absolute right-0 mt-2 w-48 rounded-md shadow-lg transition-all transform duration-200 ease-out origin-top-right
     ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}
     bg-white text-black dark:bg-gray-700 dark:text-gray-200`;

  const menuItemClass = `hover:bg-gray-100 dark:hover:bg-gray-600`;

  return (
    <div className="text-sm shadow py-[14px] px-4 flex items-center justify-between border-b bg-white text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors">
      <h1 className="text-2xl font-bold text-[#655de9]">Dashboard</h1>

      <div className="flex items-center space-x-4">
        {/* Notification Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsDropdownOpen(false);
            }}
            className="flex items-center hover:text-gray-900 dark:hover:text-gray-300 relative"
          >
            <FaBell className="w-5 h-5 text-gray-700 dark:text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className={dropdownClasses(isNotificationOpen)}>
            <div className={`py-2 px-4 cursor-pointer ${menuItemClass}`}>New notification 1</div>
            <div className={`py-2 px-4 cursor-pointer ${menuItemClass}`}>New notification 2</div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center space-x-2 hover:text-gray-900 dark:hover:text-gray-300"
          >
            <img className="w-8 h-8 rounded-full" src="https://i.pravatar.cc/40" alt="User" />
            <span className="hidden md:inline-block text-black dark:text-gray-200">Aazan Khan</span>
          </button>

          <div className={dropdownClasses(isDropdownOpen)}>
            <Link to="/profile" className={`flex items-center px-4 py-2 ${menuItemClass}`}>
              <FaUserCircle className="w-5 h-5 mr-2" /> Profile
            </Link>
            <Link to="/settings" className={`flex items-center px-4 py-2 ${menuItemClass}`}>
              <FaCogs className="w-5 h-5 mr-2" /> Settings
            </Link>
            <Link className={`flex items-center px-4 py-2 ${menuItemClass}`} onClick={handleLogout}>
              <FaSignOutAlt className="w-5 h-5 mr-2" /> Logout
            </Link>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="text-gray-600 dark:text-gray-300 focus:outline-none"
        >
          {isDarkMode ? <FaSun className="text-white" /> : <FaMoon className="text-gray-700" />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
