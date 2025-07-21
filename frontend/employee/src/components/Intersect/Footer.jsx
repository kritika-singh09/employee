import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 px-4 w-full mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-2 md:mb-0 text-center md:text-left">
          <span className="font-bold text-lg">Employee Management System</span>
          <span className="ml-2 text-sm">© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/helpcenter" className="hover:underline">Help Center</a>
          <a href="/setting" className="hover:underline">Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
