import React, { useState } from 'react';
import { FaList, FaSearch, FaRegEnvelope, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { FaTimes } from 'react-icons/fa';
const Navbar = () => {
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <nav className="bg-white text-blue-600 px-6 py-2 flex items-center justify-between w-full shadow-md fixed top-0 left-0 z-50 border-b border-blue-100">
        <div className="flex items-center gap-4 w-full">
          <button
            className="text-blue-600 text-2xl p-2 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition"
            title="Menu"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FaList />
       </button>
          <span className="font-extrabold text-2xl tracking-wide ml-2 text-blue-700 drop-shadow">EmployeeMS</span>
          <div className="hidden sm:flex items-center bg-blue-50 rounded-full px-4 py-2 ml-8 w-1/3 shadow-sm border border-blue-100">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none px-2 text-blue-700 placeholder-blue-400 w-full text-base"
            />
            <button className="text-blue-600 px-2"><FaSearch /></button>
          </div>
        </div>
        <div className={`flex items-center gap-2 sm:gap-4 transition-all duration-300 ${showMenu ? 'flex' : 'hidden'} sm:flex`}>
          <button className="hover:bg-blue-100 hover:text-blue-700 rounded-lg p-2 transition" title="Messages"><FaRegEnvelope /></button>
          <button className="hover:bg-blue-100 hover:text-blue-700 rounded-lg p-2 transition" title="Notifications"><FaBell /></button>
          <div className="flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 shadow-sm border border-blue-100">
            <FaUserCircle className="w-8 h-8 text-blue-700" />
            <span className="text-blue-700 font-bold">User</span>
          </div>
          <button className="bg-blue-50 border border-blue-400 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition flex items-center gap-2 font-semibold shadow-sm"><FaSignOutAlt /> Logout</button>
        </div>
        <div className="sm:hidden flex items-center">
          <button className="text-blue-600 text-2xl p-2 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition" onClick={() => setShowMenu(!showMenu)}>
            <FaList />
          </button>
        </div>
        {/* Mobile searchbar */}
        {showMenu && (
          <div className="absolute top-16 left-0 w-full bg-white px-6 py-4 flex sm:hidden items-center shadow-md border-b border-blue-100 z-50">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-blue-50 outline-none px-2 text-blue-700 placeholder-blue-400 w-full rounded-full text-base border border-blue-100"
            />
            <button className="text-blue-600 px-2"><FaSearch /></button>
          </div>
        )}
      </nav>
      <div className={`fixed top-0 left-0 z-50 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '16rem', height: '100vh' }}>
        <div className="relative h-full">
          <button
            className="absolute top-4 right-4 text-blue-600 text-xl p-2 rounded-full hover:bg-blue-100 hover:text-blue-700 z-50"
            onClick={() => setShowSidebar(false)}
            title="Close Sidebar"
          >
            <FaTimes />
          </button>
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Navbar;
