import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBell, FaCogs } from 'react-icons/fa';

const menuItems = [
  {
    label: 'Dashboard',
    icon: <FaTachometerAlt className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    label: 'Organization',
    icon: <FaCogs className="w-5 h-5" />,
    submenuKey: 'organization',
    subItems: [
      { label: 'Users', path: '/organization/users' },
      { label: 'Account Settings', path: '/settings/account' },
    ],
  },
  {
    label: 'Settings',
    icon: <FaCogs className="w-5 h-5" />,
    submenuKey: 'settings',
    subItems: [
      { label: 'Users settings', path: '/settings/users' },
      { label: 'Account Settings', path: '/settings/account' },
    ],
  },
  {
    label: 'Notifications',
    icon: <FaBell className="w-5 h-5" />,
    path: '/notifications',
  },
];

const Sidebar = ({ isDarkMode, toggleSidebar, isSidebarCollapsed }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualToggle, setIsManualToggle] = useState(false);

  const isExpanded = !isSidebarCollapsed || (isHovered && !isManualToggle);

  const activeRoute = (route) => location.pathname.startsWith(route);

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems?.some((sub) => activeRoute(sub.path))) {
        setOpenMenu(item.submenuKey);
      }
    });
  }, [location]);

  const handleToggleClick = () => {
    toggleSidebar();
    setIsManualToggle(true);
  };

  const handleMouseEnter = () => {
    if (!isManualToggle) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsManualToggle(false);
  };

  const getItemClasses = (isActive) =>
    `flex items-center p-2 rounded-md transition-colors ${
        isDarkMode
        ? 'hover:bg-gray-700 hover:text-gray-100'
        : 'hover:bg-gray-200 hover:text-black'
    }`;

  const getSubItemClasses = (isActive) =>
    `block p-2 rounded-md transition-colors ${
      isActive
        ? 'bg-[#655de9] text-white'
        : isDarkMode
        ? 'hover:bg-gray-700 hover:text-gray-100'
        : 'hover:bg-gray-200 hover:text-black'
    }`;

  return (
    <div
      className={`text-sm h-full flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      } ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b ${
          isExpanded ? 'p-4' : 'p-[20px]'
        } dark:border-gray-200`}
      >
        {isExpanded && <span className="text-xl font-bold">MyApp</span>}
        <button
          className={`focus:outline-none ml-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
          onClick={handleToggleClick}
        >
          &#9776;
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) =>
            item.subItems ? (
              <li key={item.label}>
                {/* Parent Item */}
                <div
                  onClick={() =>
                    setOpenMenu((prev) => (prev === item.submenuKey ? null : item.submenuKey))
                  }
                  className={getItemClasses(openMenu === item.submenuKey || item.subItems.some((s) => activeRoute(s.path))) + ' cursor-pointer justify-between'}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {isExpanded && <span className="ml-3">{item.label}</span>}
                  </div>
                  {isExpanded && (
                    <svg
                      className={`w-3 h-3 transform transition-transform ${
                        openMenu === item.submenuKey ? 'rotate-90' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>

                {/* Submenu */}
                {openMenu === item.submenuKey && isExpanded && (
                  <ul className="pl-12 mt-2 space-y-2">
                    {item.subItems.map((sub) => (
                      <li key={sub.path}>
                        <Link
                          to={sub.path}
                          className={getSubItemClasses(activeRoute(sub.path))}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={getItemClasses(activeRoute(item.path))}
                >
                  {item.icon}
                  {isExpanded && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;