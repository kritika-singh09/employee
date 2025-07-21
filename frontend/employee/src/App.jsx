
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Intersect/Navbar';
import Sidebar from './components/Intersect/Sidebar';
import Dashboard from './components/mainmenu/Dashboard.jsx';
import Footer from './components/Intersect/Footer.jsx';
import Project from './components/list/Project.jsx';
import SalaryInformation from './components/list/SalaryInformation';
import Settings from './components/mainmenu/Settings';
import Task from './components/mainmenu/Task';
import Employees from './components/teammanagement/Employees';
import Hiring from './components/teammanagement/Hiring';
import Invoices from './components/teammanagement/Invoices';
import Payments from './components/teammanagement/Payments';
import Performance from './components/teammanagement/Performance';
import helpCenter from './components/mainmenu/helpCenter';
function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <div className="pt-20">
        <Routes>
          {/* Default route for Dashboard */}
          <Route path="/" element={<Dashboard />} />
          {/* Intersect */}
          {/* <Route path="/navbar" element={<Navbar />} /> */}
          <Route path="/sidebar" element={<Sidebar/>} />
          <Route path="/footer" element={<Footer />} />
          {/* list */}
          <Route path="/project" element={<Project />} />
          <Route path="/salaryinformation" element={<SalaryInformation />} />
          {/* mainmenu */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/helpcenter" element={<helpCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/task" element={<Task />} />
          {/* teammanagement */}
          <Route path="/team-employee" element={<Employees />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/invoice" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
