import React, { useState, useEffect } from 'react';
import { Home, Users, Briefcase, BarChart2, Settings, Bell, UserCircle, PlusCircle, Search } from 'lucide-react';

// Shadcn/ui components (simplified for direct use without full shadcn setup)
const Card = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className, onClick }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Input = ({ type = 'text', placeholder, className, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    value={value}
    onChange={onChange}
  />
);

const Table = ({ children, className }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full bg-white rounded-lg overflow-hidden">
      {children}
    </table>
  </div>
);

const TableHead = ({ children, className }) => (
  <thead className={`bg-gray-100 ${className}`}>
    {children}
  </thead>
);

const TableBody = ({ children, className }) => (
  <tbody className={`divide-y divide-gray-200 ${className}`}>
    {children}
  </tbody>
);

const TableRow = ({ children, className }) => (
  <tr className={`hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

const TableHeader = ({ children, className }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 ${className}`}>
    {children}
  </td>
);

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    status: 'Active',
  });
  const [searchTerm, setSearchTerm] = useState('');
  // Edit modal state
  const [editModal, setEditModal] = useState({ open: false, employee: null });

  // Fetch employees from API
  const fetchEmployees = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees/`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch employees');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add employee via API
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.position || !newEmployee.department || !newEmployee.status) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(newEmployee.name),
          position: String(newEmployee.position),
          department: String(newEmployee.department),
          status: String(newEmployee.status)
        })
      });
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        setError('Server error: Could not parse response');
        console.error('Raw response:', response);
        return;
      }
      if (!response.ok) {
        setError((data && (data.error || data.message)) || 'Failed to add employee');
        console.error('Backend error:', data);
        return;
      }
      setShowAddModal(false);
      setNewEmployee({ name: '', position: '', department: '', status: 'Active' });
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (employeeIdOrId) => {
    setLoading(true);
    setError(null);
    // Find the correct _id for the employee
    const emp = employees.find(e => e.employeeId === employeeIdOrId || e.id === employeeIdOrId);
    const idToDelete = emp?._id || employeeIdOrId;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${idToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete employee');
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit open
  const openEditModal = (employee) => {
    setEditModal({ open: true, employee: { ...employee, _id: employee._id } });
  };

  // Handle edit update
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { _id, name, position, department, status } = editModal.employee;
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, department, status })
      });
      if (!response.ok) throw new Error('Failed to update employee');
      setEditModal({ open: false, employee: null });
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <main className="px-2 sm:px-4 md:px-8 py-4 w-full max-w-screen-2xl mx-auto">
        {loading && <div className="text-center text-blue-600 font-semibold">Loading...</div>}
        {error && <div className="text-center text-red-600 font-semibold">{error}</div>}
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">Employee Dashboard</h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button className="bg-white text-gray-700 hover:bg-gray-100 p-3 rounded-full shadow-sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button className="bg-white text-gray-700 hover:bg-gray-100 p-3 rounded-full shadow-sm">
              <UserCircle className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</h3>
            </div>
            <Users className="h-10 w-10 text-blue-500 opacity-70" />
          </Card>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Employees</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {employees.filter(emp => emp.status === 'Active').length}
              </h3>
            </div>
            <Home className="h-10 w-10 text-green-500 opacity-70" />
          </Card>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Departments</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {new Set(employees.map(emp => emp.department)).size}
              </h3>
            </div>
            <Briefcase className="h-10 w-10 text-purple-500 opacity-70" />
          </Card>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">On Leave</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {employees.filter(emp => emp.status === 'On Leave').length}
              </h3>
            </div>
            <BarChart2 className="h-10 w-10 text-orange-500 opacity-70" />
          </Card>
        </div>

        {/* Employee List Section */}
        <Card>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-2xl font-bold text-gray-900">Employee List</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center w-full sm:w-auto justify-center" onClick={() => setShowAddModal(true)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">Add Employee</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Add Employee Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold" onClick={() => setShowAddModal(false)}>&times;</button>
                <h3 className="text-xl font-bold mb-4">Add Employee</h3>
                <form onSubmit={handleAddEmployee} className="flex flex-col gap-4">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={newEmployee.name}
                    onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Position"
                    value={newEmployee.position}
                    onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    className="w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Department"
                    value={newEmployee.department}
                    onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full"
                    required
                  />
                  <select
                    value={newEmployee.status}
                    onChange={e => setNewEmployee({ ...newEmployee, status: e.target.value })}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Add</Button>
                </form>
              </div>
            </div>
          )}

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="min-w-[80px]">Employee ID</TableHeader>
                <TableHeader className="min-w-[120px]">Name</TableHeader>
                <TableHeader className="min-w-[120px]">Position</TableHeader>
                <TableHeader className="min-w-[120px]">Department</TableHeader>
                <TableHeader className="min-w-[100px]">Status</TableHeader>
                <TableHeader className="min-w-[100px]">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee._id || employee.employeeId || employee.id}>
                  <TableCell>{employee.employeeId || employee.id}</TableCell>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'On Leave' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button className="text-blue-600 hover:text-blue-800 p-1" onClick={() => openEditModal(employee)}>Edit</Button>
                      <Button className="text-red-600 hover:text-red-800 p-1" onClick={() => handleDelete(employee._id || employee.employeeId || employee.id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          {/* Edit Employee Modal */}
          {editModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold" onClick={() => setEditModal({ open: false, employee: null })}>&times;</button>
                <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
                <form onSubmit={handleUpdateEmployee} className="flex flex-col gap-4">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={editModal.employee.name}
                    onChange={e => setEditModal({ ...editModal, employee: { ...editModal.employee, name: e.target.value } })}
                    className="w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Position"
                    value={editModal.employee.position}
                    onChange={e => setEditModal({ ...editModal, employee: { ...editModal.employee, position: e.target.value } })}
                    className="w-full"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Department"
                    value={editModal.employee.department}
                    onChange={e => setEditModal({ ...editModal, employee: { ...editModal.employee, department: e.target.value } })}
                    className="w-full"
                    required
                  />
                  <select
                    value={editModal.employee.status}
                    onChange={e => setEditModal({ ...editModal, employee: { ...editModal.employee, status: e.target.value } })}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Update</Button>
                </form>
              </div>
            </div>
          )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;