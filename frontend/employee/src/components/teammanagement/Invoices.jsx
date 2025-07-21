import React, { useState, useMemo } from 'react';
import {
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  PlusCircle, // Added for a potential "Add Invoice" button
} from 'lucide-react';

// Mock data for invoices
const mockInvoices = [
  {
    id: 'INV-001',
    customer: 'Tech Solutions Inc.',
    amount: 2500.0,
    issueDate: '2023-10-01',
    dueDate: '2023-10-31',
    status: 'Paid',
  },
  {
    id: 'INV-002',
    customer: 'Creative Minds LLC',
    amount: 1800.5,
    issueDate: '2023-10-05',
    dueDate: '2023-11-04',
    status: 'Pending',
  },
  {
    id: 'INV-003',
    customer: 'Innovate Co.',
    amount: 3200.0,
    issueDate: '2023-09-15',
    dueDate: '2023-10-15',
    status: 'Overdue',
  },
  {
    id: 'INV-004',
    customer: 'Global Exports',
    amount: 500.75,
    issueDate: '2023-11-01',
    dueDate: '2023-11-30',
    status: 'Paid',
  },
  {
    id: 'INV-005',
    customer: 'Future Systems Ltd.',
    amount: 1250.0,
    issueDate: '2023-11-10',
    dueDate: '2023-12-10',
    status: 'Pending',
  },
  {
    id: 'INV-006',
    customer: 'Data Dynamics Corp.',
    amount: 750.20,
    issueDate: '2023-08-20',
    dueDate: '2023-09-20',
    status: 'Overdue',
  },
];

const Invoices = () => {
  // State for the search term
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtering of invoices based on search term
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((inv) =>
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) // Also search by invoice ID
    );
  }, [searchTerm]);

  // Tailwind CSS classes for status colors
  const statusColor = {
    Paid: 'bg-green-100 text-green-700 ring-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
    Overdue: 'bg-red-100 text-red-700 ring-red-200',
  };

  // Icons for different statuses
  const statusIcon = {
    Paid: <CheckCircle className="w-4 h-4" />,
    Pending: <Clock className="w-4 h-4" />,
    Overdue: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 shadow-lg rounded-b-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <FileText className="w-8 h-8" /> Invoice Dashboard
          </h1>
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer or ID..."
              className="pl-12 pr-4 py-3 w-full rounded-full border border-gray-300 shadow-md focus:ring-4 focus:ring-yellow-300 focus:outline-none transition-all duration-300 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6 max-w-6xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Invoices</h2>
          <button className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300">
            <PlusCircle className="w-5 h-5" /> Add New Invoice
          </button>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 uppercase tracking-wider font-semibold">Invoice ID</th>
                <th className="text-left px-6 py-4 text-gray-600 uppercase tracking-wider font-semibold">Customer</th>
                <th className="text-left px-6 py-4 text-gray-600 uppercase tracking-wider font-semibold">Amount</th>
                <th className="text-left px-6 py-4 text-gray-600 uppercase tracking-wider font-semibold">Issue Date</th>
                <th className="text-left px-6 py-4 text-gray-600 uppercase tracking-wider font-semibold">Due Date</th>
                <th className="text-left px-6 py-4 text-gray-600 uppercase tracking-wider font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500 text-lg">
                    No invoices found matching your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-200 ease-in-out"
                  >
                    <td className="px-6 py-4 font-medium text-yellow-600">{invoice.id}</td>
                    <td className="px-6 py-4 text-gray-700">{invoice.customer}</td>
                    <td className="px-6 py-4 flex items-center gap-1 text-gray-700">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{invoice.issueDate}</td>
                    <td className="px-6 py-4 text-gray-600">{invoice.dueDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs shadow-sm ring-1 ${statusColor[invoice.status]}`}
                      >
                        {statusIcon[invoice.status]}
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// Main App component to render the Invoices component
const App = () => {
  return <Invoices />;
};

export default App;
