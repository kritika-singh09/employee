import React, { useState } from 'react';

import { FaFolder, FaChevronDown, FaChevronUp, FaFileAlt, FaHome, FaUser, FaUpload } from 'react-icons/fa';

const sidebarData = [
  {
    name: 'Intersect',
    icon: <FaFolder />,
    children: [
      { name: 'Navbar.jsx', icon: <FaFileAlt />, link: '/navbar' },
      { name: 'Sidebar.jsx', icon: <FaFileAlt />, link: '/sidebar' },
      { name: 'Footer.jsx', icon: <FaFileAlt />, link: '/footer' },
    ],
  },
  {
    name: 'list',
    icon: <FaFolder />,
    children: [
      { name: 'Project.jsx', icon: <FaFileAlt />, link: '/project' },
      { name: 'SalaryInformation.jsx', icon: <FaFileAlt />, link: '/salaryinformation' },
    ],
  },
  {
    name: 'mainmenu',
    icon: <FaFolder />,
    children: [
      { name: 'Dashboard.jsx', icon: <FaFileAlt />, link: '/dashboard' },
      { name: 'HelpCenter.jsx', icon: <FaFileAlt />, link: '/helpcenter' },
      { name: 'Setting.jsx', icon: <FaFileAlt />, link: '/setting' },
      { name: 'Task.jsx', icon: <FaFileAlt />, link: '/task' },
    ],
  },
  {
    name: 'teammanagement',
    icon: <FaFolder />,
    children: [
      { name: 'Employee.jsx', icon: <FaFileAlt />, link: '/team-employee' },
      { name: 'Hiring.jsx', icon: <FaFileAlt />, link: '/hiring' },
      { name: 'Invoice.jsx', icon: <FaFileAlt />, link: '/invoice' },
      { name: 'Payments.jsx', icon: <FaFileAlt />, link: '/payments' },
      { name: 'Performance.jsx', icon: <FaFileAlt />, link: '/performance' },
    ],
  },
];

const Sidebar = () => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (name) => {
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="bg-blue-50 text-blue-700 w-64 h-screen fixed top-0 left-0 shadow-lg border-r border-blue-100 pt-20 z-40">
      <nav className="flex flex-col gap-2 px-4">
        {sidebarData.map((item) => (
          <div key={item.name} className="mb-2">
            {item.children ? (
              <div>
                <button
                  className="flex items-center w-full py-2 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition justify-between shadow-sm border border-blue-200"
                  onClick={() => toggleFolder(item.name)}
                >
                  <span className="flex items-center gap-2">
                    <span className="bg-blue-200 p-2 rounded-lg text-blue-700">{item.icon}</span>
                    <span className="font-bold text-blue-700 text-lg">{item.name}</span>
                  </span>
                  <span className="ml-2">{openFolders[item.name] ? <FaChevronUp /> : <FaChevronDown />}</span>
                </button>
                {openFolders[item.name] && (
                  <div className="ml-6 mt-2 flex flex-col gap-2">
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.link}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white hover:bg-blue-100 text-blue-600 font-medium shadow-sm border border-blue-100 transition"
                      >
                        <span className="bg-blue-50 p-1 rounded text-blue-600">{child.icon}</span>
                        <span>{child.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                href={item.link}
                className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white hover:bg-blue-100 text-blue-600 font-bold shadow-sm border border-blue-100 transition"
              >
                <span className="bg-blue-50 p-1 rounded text-blue-600">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
