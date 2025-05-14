import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={`flex h-screen overflow-hidden`}>
      <Sidebar  
        toggleSidebar={toggleSidebar} 
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className={`flex-1 overflow-auto bg-gray-50 p-6 transition-all duration-300 dark:bg-gray-800 dark:text-gray-100 bg-white text-gray-800`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;