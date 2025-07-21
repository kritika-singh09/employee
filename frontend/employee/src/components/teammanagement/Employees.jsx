import React, { useState, useEffect, useRef } from 'react';

// Main Employees component
const Employees = () => {
  // State to hold the list of employees
  const [employees, setEmployees] = useState([]);
  // State to manage the visibility of the add/edit employee form
  const [showForm, setShowForm] = useState(false);
  // State for the new/edited employee form data
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    hireDate: '', // New field
    salary: '',   // New field
    status: 'Active' // New field with default
  });
  // State to track which employee is currently being edited (null if not editing)
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  // State to store the employee being viewed in detail (null if no employee is being viewed)
  const [viewingEmployee, setViewingEmployee] = useState(null);
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  // State for delete confirmation modal
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  // State to store the ID of the employee to be deleted
  const [employeeToDeleteId, setEmployeeToDeleteId] = useState(null);
  // State for loading indicator (simulated)
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5); // Number of employees per page

  // Sorting states
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Toast notification states
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'
  const toastTimeoutRef = useRef(null); // Ref to clear toast timeout

  // Activity Log state
  const [activityLog, setActivityLog] = useState([]);

  // Fetch employees from API
  useEffect(() => {
    setIsLoading(true);
    fetch('https://employeemanagement-plum.vercel.app/api/employees/')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setIsLoading(false);
        setActivityLog([{ id: Date.now(), timestamp: new Date().toLocaleString(), description: 'Fetched employees from API.' }]);
      })
      .catch(err => {
        setIsLoading(false);
        setActivityLog([{ id: Date.now(), timestamp: new Date().toLocaleString(), description: 'Failed to fetch employees from API.' }]);
      });
  }, []);

  // Function to show toast notifications
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 3000); // Toast disappears after 3 seconds
  };

  // Function to add an entry to the activity log
  const addActivityLogEntry = (description) => {
    setActivityLog(prevLog => [{ id: Date.now(), timestamp: new Date().toLocaleString(), description }, ...prevLog]);
  };

  // Handle input changes for the form (add/edit)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error for the field being typed into
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.position.trim()) errors.position = 'Position is required.';
    if (!formData.department.trim()) errors.department = 'Department is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be in XXX-XXX-XXXX format.';
    }
    if (!formData.hireDate) errors.hireDate = 'Hire Date is required.';
    if (!formData.salary || isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
      errors.salary = 'Salary must be a positive number.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle opening the add employee form
  const handleAddClick = () => {
    setEditingEmployeeId(null); // Ensure not in edit mode
    setFormData({ name: '', position: '', department: '', email: '', phone: '', hireDate: '', salary: '', status: 'Active' }); // Clear form
    setValidationErrors({}); // Clear any previous validation errors
    setShowForm(true); // Show the form
  };

  // Handle opening the edit employee form
  const handleEditClick = (employee) => {
    setEditingEmployeeId(employee.id); // Set the ID of the employee being edited
    setFormData(employee); // Populate form with employee data
    setValidationErrors({}); // Clear any previous validation errors
    setShowForm(true); // Show the form
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the errors in the form.', 'error');
      return;
    }

    if (editingEmployeeId) {
      // Update existing employee via API
      try {
        const response = await fetch(`https://employeemanagement-plum.vercel.app/api/employees/${editingEmployeeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update employee');
        showToast('Employee updated successfully!', 'success');
        addActivityLogEntry(`Updated employee: ${formData.name}`);
        // Refresh list
        fetch('https://employeemanagement-plum.vercel.app/api/employees/')
          .then(res => res.json())
          .then(data => setEmployees(data));
      } catch (err) {
        showToast('Error updating employee', 'error');
      }
    } else {
      // Add new employee via API
      try {
        const response = await fetch('https://employeemanagement-plum.vercel.app/api/employees/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to add employee');
        showToast('Employee added successfully!', 'success');
        addActivityLogEntry(`Added new employee: ${formData.name}`);
        // Refresh list
        fetch('https://employeemanagement-plum.vercel.app/api/employees/')
          .then(res => res.json())
          .then(data => setEmployees(data));
      } catch (err) {
        showToast('Error adding employee', 'error');
      }
    }
    setFormData({ name: '', position: '', department: '', email: '', phone: '', hireDate: '', salary: '', status: 'Active' }); // Clear form
    setEditingEmployeeId(null); // Reset editing state
    setShowForm(false); // Hide form
  };

  // Handle viewing employee details
  const handleViewClick = (employee) => {
    setViewingEmployee(employee);
  };

  // Handle closing the view employee details modal
  const handleCloseViewModal = () => {
    setViewingEmployee(null);
  };

  // Handle initiating delete action (show confirmation modal)
  const handleDeleteClick = (id) => {
    setEmployeeToDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  // Confirm and perform delete
  const confirmDeleteEmployee = async () => {
    try {
      const response = await fetch(`https://employeemanagement-plum.vercel.app/api/employees/employee/${ToDeleteId}`, {
  method: 'DELETE',
});

      if (!response.ok) throw new Error('Failed to delete employee');
      showToast('Employee deleted successfully!', 'success');
      const deletedEmployee = employees.find(emp => emp.id === employeeToDeleteId);
      if (deletedEmployee) {
        addActivityLogEntry(`Deleted employee: ${deletedEmployee.name}`);
      }
      // Refresh list
      fetch('https://employeemanagement-plum.vercel.app/api/employees/')
        .then(res => res.json())
        .then(data => setEmployees(data));
    } catch (err) {
      showToast('Error deleting employee', 'error');
    }
    setShowConfirmDeleteModal(false);
    setEmployeeToDeleteId(null);
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setEmployeeToDeleteId(null);
  };

  // Filtered employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = String(a[sortColumn]).toLowerCase();
    const bValue = String(b[sortColumn]).toLowerCase();

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle column header click for sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc'); // Default to ascending when changing column
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  // Pagination calculations
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(sortedEmployees.length / employeesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-screen-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Employee Management</h1>

        {/* Action Buttons: Add Employee & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Reset page on search
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/2"
          />
          <button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 w-full md:w-auto"
          >
            Add New Employee
          </button>
        </div>

        {/* Add/Edit Employee Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                  required
                />
                {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.position ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                  required
                />
                {validationErrors.position && <p className="text-red-500 text-sm mt-1">{validationErrors.position}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.department ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                  required
                />
                {validationErrors.department && <p className="text-red-500 text-sm mt-1">{validationErrors.department}</p>}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                  required
                />
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (e.g., 123-456-7890)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.phone ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                  required
                />
                {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
              </div>
              <div>
                <input
                  type="date"
                  name="hireDate"
                  placeholder="Hire Date"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.hireDate ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                  required
                />
                {validationErrors.hireDate && <p className="text-red-500 text-sm mt-1">{validationErrors.hireDate}</p>}
              </div>
              <div>
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.salary ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                  required
                />
                {validationErrors.salary && <p className="text-red-500 text-sm mt-1">{validationErrors.salary}</p>}
              </div>
              <div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingEmployeeId(null); setFormData({ name: '', position: '', department: '', email: '', phone: '', hireDate: '', salary: '', status: 'Active' }); setValidationErrors({}); }}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              >
                {editingEmployeeId ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        )}

        {/* Loading Indicator */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading employees...</p>
          </div>
        ) : (
          /* Employee List */
          filteredEmployees.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No employees found. Add some!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    {['name', 'position', 'department', 'email', 'phone', 'hireDate', 'salary', 'status'].map((column) => (
                      <th
                        key={column}
                        className="py-3 px-4 text-left text-gray-700 font-semibold uppercase text-sm cursor-pointer hover:bg-gray-300 transition duration-150 ease-in-out"
                        onClick={() => handleSort(column)}
                      >
                        {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                        {sortColumn === column && (
                          <span className="ml-2">
                            {sortDirection === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold uppercase text-sm rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 text-gray-800">{employee.name}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.position}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.department}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.email}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.phone}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.hireDate}</td>
                      <td className="py-3 px-4 text-gray-800">${parseFloat(employee.salary).toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.status}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => handleViewClick(employee)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(employee)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(employee.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`py-2 px-4 rounded-lg font-semibold transition duration-300 ease-in-out ${
                  currentPage === number + 1
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}

        {/* View Employee Details Modal */}
        {viewingEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Details</h2>
              <p className="mb-2"><span className="font-semibold">Name:</span> {viewingEmployee.name}</p>
              <p className="mb-2"><span className="font-semibold">Position:</span> {viewingEmployee.position}</p>
              <p className="mb-2"><span className="font-semibold">Department:</span> {viewingEmployee.department}</p>
              <p className="mb-2"><span className="font-semibold">Email:</span> {viewingEmployee.email}</p>
              <p className="mb-2"><span className="font-semibold">Phone:</span> {viewingEmployee.phone}</p>
              <p className="mb-2"><span className="font-semibold">Hire Date:</span> {viewingEmployee.hireDate}</p>
              <p className="mb-2"><span className="font-semibold">Salary:</span> ${parseFloat(viewingEmployee.salary).toLocaleString()}</p>
              <p className="mb-4"><span className="font-semibold">Status:</span> {viewingEmployee.status}</p>
              <button
                onClick={handleCloseViewModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <button
                onClick={handleCloseViewModal}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showConfirmDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
              <p className="mb-6 text-gray-700">Are you sure you want to delete this employee?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteEmployee}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} transition-opacity duration-300 ease-in-out opacity-100`}>
            {toastMessage}
          </div>
        )}

        {/* Activity Log Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Activity Log</h2>
          {activityLog.length === 0 ? (
            <p className="text-gray-600">No recent activities.</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {activityLog.map((log) => (
                <li key={log.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-gray-700 text-sm">
                  <span className="font-medium text-gray-500 mr-2">{log.timestamp}:</span> {log.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
// import React, { useEffect, useState } from 'react';

// const EmployeeManagement = () => {
//   const [employees, setEmployees] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     position: '',
//     department: '',
//     email: '',
//     phone: '',
//     hireDate: '',
//     salary: '',
//     status: 'Active'
//   });
//   const [editingEmployeeId, setEditingEmployeeId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [employeeToDeleteId, setEmployeeToDeleteId] = useState(null);
//   const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
//   const [activityLog, setActivityLog] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const API_BASE = 'https://employeemanagement-plum.vercel.app/api/employees';

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(API_BASE + '/')
//       .then(res => res.json())
//       .then(data => {
//         setEmployees(data);
//         setIsLoading(false);
//         setActivityLog([{ id: Date.now(), timestamp: new Date().toLocaleString(), description: 'Fetched employees from API.' }]);
//       })
//       .catch(() => {
//         setIsLoading(false);
//         setActivityLog([{ id: Date.now(), timestamp: new Date().toLocaleString(), description: 'Failed to fetch employees from API.' }]);
//       });
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     return formData.name && formData.position && formData.email;
//   };

//   const showToast = (message, type) => {
//     alert(`${type.toUpperCase()}: ${message}`);
//   };

//   const addActivityLogEntry = (description) => {
//     setActivityLog(prev => [
//       { id: Date.now(), timestamp: new Date().toLocaleString(), description },
//       ...prev
//     ]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       showToast('Please correct the errors in the form.', 'error');
//       return;
//     }

//     try {
//       const method = editingEmployeeId ? 'PUT' : 'POST';
//       const url = editingEmployeeId ? `${API_BASE}/${editingEmployeeId}` : API_BASE + '/';

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) throw new Error('Request failed');

//       showToast(
//         editingEmployeeId ? 'Employee updated successfully!' : 'Employee added successfully!',
//         'success'
//       );
//       addActivityLogEntry(
//         editingEmployeeId ? `Updated employee: ${formData.name}` : `Added new employee: ${formData.name}`
//       );

//       const res = await fetch(API_BASE + '/');
//       const updatedData = await res.json();
//       setEmployees(updatedData);

//       setFormData({
//         name: '',
//         position: '',
//         department: '',
//         email: '',
//         phone: '',
//         hireDate: '',
//         salary: '',
//         status: 'Active'
//       });
//       setEditingEmployeeId(null);
//       setShowForm(false);
//     } catch (err) {
//       showToast('Error saving employee', 'error');
//     }
//   };

//   const handleEdit = (employee) => {
//     setEditingEmployeeId(employee._id);
//     setFormData(employee);
//     setShowForm(true);
//   };

//   const handleDelete = (id) => {
//     setEmployeeToDeleteId(id);
//     setShowConfirmDeleteModal(true);
//   };

//   const confirmDeleteEmployee = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/${employeeToDeleteId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Failed to delete employee');
//       showToast('Employee deleted successfully!', 'success');

//       const deletedEmployee = employees.find(emp => emp._id === employeeToDeleteId);
//       if (deletedEmployee) {
//         addActivityLogEntry(`Deleted employee: ${deletedEmployee.name}`);
//       }

//       const res = await fetch(API_BASE + '/');
//       const updatedData = await res.json();
//       setEmployees(updatedData);
//     } catch (err) {
//       showToast('Error deleting employee', 'error');
//     }
//     setShowConfirmDeleteModal(false);
//     setEmployeeToDeleteId(null);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Employee Management</h1>

//       {isLoading ? <p>Loading...</p> : (
//         <>
//           <button
//             onClick={() => {
//               setFormData({
//                 name: '',
//                 position: '',
//                 department: '',
//                 email: '',
//                 phone: '',
//                 hireDate: '',
//                 salary: '',
//                 status: 'Active'
//               });
//               setEditingEmployeeId(null);
//               setShowForm(true);
//             }}
//             className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Add Employee
//           </button>

//           {showForm && (
//             <form onSubmit={handleSubmit} className="mb-6 space-y-2">
//               <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="block border px-2 py-1" />
//               <input name="position" value={formData.position} onChange={handleInputChange} placeholder="Position" className="block border px-2 py-1" />
//               <input name="department" value={formData.department} onChange={handleInputChange} placeholder="Department" className="block border px-2 py-1" />
//               <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="block border px-2 py-1" />
//               <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="block border px-2 py-1" />
//               <input name="hireDate" type="date" value={formData.hireDate} onChange={handleInputChange} className="block border px-2 py-1" />
//               <input name="salary" type="number" value={formData.salary} onChange={handleInputChange} placeholder="Salary" className="block border px-2 py-1" />
//               <select name="status" value={formData.status} onChange={handleInputChange} className="block border px-2 py-1">
//                 <option>Active</option>
//                 <option>Inactive</option>
//               </select>
//               <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded">
//                 {editingEmployeeId ? 'Update' : 'Add'}
//               </button>
//             </form>
//           )}

//           <table className="w-full border text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border px-2 py-1">Name</th>
//                 <th className="border px-2 py-1">Position</th>
//                 <th className="border px-2 py-1">Email</th>
//                 <th className="border px-2 py-1">Status</th>
//                 <th className="border px-2 py-1">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map(emp => (
//                 <tr key={emp._id}>
//                   <td className="border px-2 py-1">{emp.name}</td>
//                   <td className="border px-2 py-1">{emp.position}</td>
//                   <td className="border px-2 py-1">{emp.email}</td>
//                   <td className="border px-2 py-1">{emp.status}</td>
//                   <td className="border px-2 py-1 space-x-2">
//                     <button onClick={() => handleEdit(emp)} className="text-blue-600">Edit</button>
//                     <button onClick={() => handleDelete(emp._id)} className="text-red-600">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {showConfirmDeleteModal && (
//             <div className="mt-4">
//               <p>Are you sure you want to delete this employee?</p>
//               <button onClick={confirmDeleteEmployee} className="px-3 py-1 bg-red-600 text-white mr-2">Yes</button>
//               <button onClick={() => setShowConfirmDeleteModal(false)} className="px-3 py-1 bg-gray-300">Cancel</button>
//             </div>
//           )}

//           <div className="mt-8">
//             <h2 className="text-md font-semibold mb-2">Activity Log</h2>
//             <ul className="list-disc ml-5 text-sm">
//               {activityLog.map(log => (
//                 <li key={log.id}>{log.timestamp} - {log.description}</li>
//               ))}
//             </ul>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default EmployeeManagement;
