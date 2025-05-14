import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBell, FaCogs } from 'react-icons/fa';

const Sidebar = ({ toggleSidebar, isSidebarCollapsed }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualToggle, setIsManualToggle] = useState(false);
  const isExpanded = !isSidebarCollapsed || (isHovered && !isManualToggle);

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
      ],
    }
  ];

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

  const getItemClasses = () =>
    `flex items-center p-2 rounded-md transition-colors hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-gray-100`;

  const getSubItemClasses = (isActive) =>
    `block p-2 rounded-md transition-colors ${
      isActive
        ? 'bg-[#655de9] text-white'
        : 'hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-gray-100'
    }`;

  return (
    <div
      className={`text-sm h-full flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      } bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between ${
          isExpanded ? 'p-4' : 'p-[20px]'
        } border-b border-gray-200 dark:border-gray-700 transition-colors duration-300`}
      >
        {isExpanded && <span className="text-xl font-bold">MyApp</span>}
        <button
          className="focus:outline-none ml-2 text-gray-600 dark:text-gray-300"
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
                  className={`${getItemClasses()} cursor-pointer justify-between`}
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
                <div
                  className={`transition-[max-height,opacity,transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden transform-gpu ${
                    openMenu === item.submenuKey && isExpanded
                      ? 'max-h-96 opacity-100 scale-y-100 translate-y-0'
                      : 'max-h-0 opacity-0 scale-y-95 -translate-y-2'
                  }`}
                >
                  <ul className="pl-12 mt-2 space-y-2">
                    {item.subItems.map((sub) => (
                      <li key={sub.path}>
                        <Link
                          to={sub.path}
                          className={`relative pl-5 before:content-[''] before:absolute before:left-1.5 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full ${
                            activeRoute(sub.path)
                              ? 'before:bg-white text-white bg-[#655de9]'
                              : 'before:bg-gray-500 dark:before:bg-gray-300 hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-gray-100'
                          } block p-2 rounded-md transition-colors`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <Link to={item.path} className={getItemClasses()}>
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