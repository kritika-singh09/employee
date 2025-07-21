import React, { useState, useEffect, useRef } from 'react';

// Component for Candidate Status Checking
const CandidateStatusChecker = ({ candidates, showToast, setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [statusResult, setStatusResult] = useState(null); // Stores the candidate object or null
  const [searchError, setSearchError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setStatusResult(null); // Clear previous result on new input
    setSearchError(''); // Clear previous error
  };

  const checkStatus = () => {
    if (!email.trim()) {
      setSearchError('Please enter your email address.');
      return;
    }
    const foundCandidate = candidates.find(cand => cand.email.toLowerCase() === email.toLowerCase());
    if (foundCandidate) {
      setStatusResult(foundCandidate);
      setSearchError('');
      showToast('Status found!', 'success');
    } else {
      setStatusResult(null);
      setSearchError('No application found with that email. Please check your email or apply for a role.');
      showToast('Application not found.', 'error');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Check Application Status</h2>

      <div className="mb-4">
        <label htmlFor="candidateEmail" className="block text-sm font-medium text-gray-700 mb-2">Your Email Address</label>
        <input
          type="email"
          id="candidateEmail"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
          required
        />
        {searchError && <p className="text-red-500 text-sm mt-2">{searchError}</p>}
      </div>

      <button
        onClick={checkStatus}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
      >
        Check Status
      </button>

      {statusResult && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Application Details</h3>
          <p className="mb-2"><span className="font-semibold">Name:</span> {statusResult.name}</p>
          <p className="mb-2"><span className="font-semibold">Desired Position:</span> {statusResult.desiredPosition}</p>
          <p className="mb-2"><span className="font-semibold">Application Date:</span> {statusResult.applicationDate}</p>
          <p className="mb-2"><span className="font-semibold">Current Status:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
              statusResult.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
              statusResult.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' :
              statusResult.status === 'Offered' ? 'bg-green-100 text-green-800' :
              statusResult.status === 'Hired' ? 'bg-purple-100 text-purple-800' :
              'bg-red-100 text-red-800'
            }`}>
              {statusResult.status}
            </span>
          </p>
          {statusResult.interviewDate && <p className="mb-2"><span className="font-semibold">Interview Date:</span> {statusResult.interviewDate}</p>}
          {statusResult.resumeFileName && <p className="mb-2"><span className="font-semibold">Resume:</span> {statusResult.resumeFileName}</p>}
        </div>
      )}

      <button
        onClick={() => setCurrentView('dashboard')}
        className="mt-8 w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

// Main Hiring Dashboard App component
const Hiring = () => {
  // State to hold the list of candidates
  const [candidates, setCandidates] = useState([]);
  // State to manage the visibility of the add/edit candidate form
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  // State for the new/edited candidate form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    desiredPosition: '',
    applicationDate: '',
    status: 'Applied', // Default status
    interviewDate: '',
    resumeFileName: ''
  });
  // State to track which candidate is currently being edited (null if not editing)
  const [editingCandidateId, setEditingCandidateId] = useState(null);
  // State to store the candidate being viewed in detail (null if no candidate is being viewed)
  const [viewingCandidate, setViewingCandidate] = useState(null);
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  // State for delete confirmation modal
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  // State to store the ID of the candidate to be deleted
  const [candidateToDeleteId, setCandidateToDeleteId] = useState(null);
  // State for loading indicator (simulated)
  const [isLoading, setIsLoading] = useState(true);
  // State to manage the current view ('dashboard' or 'statusChecker')
  const [currentView, setCurrentView] = useState('dashboard');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(5);

  // Sorting states
  const [sortColumn, setSortColumn] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Toast notification states
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const toastTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // API URL
  const API_URL = 'https://employeemanagement-plum.vercel.app/api/hire/';

  const fetchAndSetCandidates = () => {
    setIsLoading(true);
    fetch(API_URL + 'all')
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) return []; // Gracefully handle 404 as an empty list
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(apiData => {
        if (!Array.isArray(apiData)) {
          console.error("API did not return an array.", apiData);
          apiData = [];
        }
        // Map API data to the structure the component expects
        const mappedCandidates = apiData.map(candidate => {
          const applicationDate = new Date(candidate.createdAt);
          const year = applicationDate.getFullYear();
          const month = String(applicationDate.getMonth() + 1).padStart(2, '0');
          const day = String(applicationDate.getDate()).padStart(2, '0');
          return {
            id: candidate._id, // Map _id to id
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            desiredPosition: candidate.position, // Map position to desiredPosition
            applicationDate: `${year}-${month}-${day}`, // Format createdAt to applicationDate
            status: candidate.status || 'Applied', // Default status as it's missing from API
            interviewDate: candidate.interviewDate || '',
            // Extract filename from URL
            resumeFileName: candidate.resumeUrl ? decodeURIComponent(candidate.resumeUrl.split('/').pop().split('?')[0]) : '',
          };
        });
        setCandidates(mappedCandidates);
      })
      .catch(err => {
        showToast('Failed to fetch candidates from API.', 'error');
        setCandidates([]); // Ensure candidates is an array on error to prevent crashes
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Fetch candidates from API on initial mount
  useEffect(() => {
    fetchAndSetCandidates();
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

  // Handle input changes for the form (add/edit)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error for the field being typed into
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, resumeFileName: file.name });
      showToast(`Selected file: ${file.name}`, 'info');
    } else {
      setFormData({ ...formData, resumeFileName: '' });
    }
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid.';
    }
   if (!formData.phone.trim()) {
  errors.phone = 'Phone number is required.';
} else if (!/^\d{10}$/.test(formData.phone)) {
  errors.phone = 'Phone number must be 10 digits.';
}

    if (!formData.desiredPosition.trim()) errors.desiredPosition = 'Desired Position is required.';
    if (!formData.applicationDate) errors.applicationDate = 'Application Date is required.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle opening the add candidate form (now toggles the application form)
  const handleToggleApplicationForm = () => {
    setShowApplicationForm(prev => !prev);
    setEditingCandidateId(null); // Ensure not in edit mode when opening new application form
    setFormData({ name: '', email: '', phone: '', desiredPosition: '', applicationDate: '', status: 'Applied', interviewDate: '', resumeFileName: '' }); // Clear form
    setValidationErrors({}); // Clear any previous validation errors
    if (fileInputRef.current) { // Clear file input
      fileInputRef.current.value = '';
    }
  };

  // Handle opening the edit candidate form
  const handleEditClick = (candidate) => {
    setEditingCandidateId(candidate.id); // Set the ID of the candidate being edited
    setFormData(candidate); // Populate form with candidate data
    setValidationErrors({}); // Clear any previous validation errors
    setShowApplicationForm(true); // Show the form for editing
    if (fileInputRef.current) { // Clear file input when editing, user can re-upload
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the errors in the form.', 'error');
      return;
    }

    // Map form data back to the structure the API expects for POST/PUT
    const dataToSend = {
      ...formData,
      position: formData.desiredPosition, // Map desiredPosition back to position
    };
    // Clean up properties not expected by the API
    delete dataToSend.desiredPosition;

    if (editingCandidateId) {
      // Update existing candidate via API
      try {
        const response = await fetch(`${API_URL}/${editingCandidateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        if (!response.ok) throw new Error('Failed to update candidate');
        showToast('Candidate updated successfully!', 'success');
        fetchAndSetCandidates(); // Refresh list with mapping
      } catch (err) {
        showToast('Error updating candidate', 'error');


      }
    } else {
      // Add new candidate via API
      try {
        const response = await fetch('https://employeemanagement-plum.vercel.app/api/hire/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        });
        if (!response.ok) throw new Error('Failed to add candidate');
        showToast('Candidate added successfully!', 'success');
        fetchAndSetCandidates(); // Refresh list with mapping
      } catch (err) {
        showToast('Error adding candidate', 'error');
      }
    }
    setFormData({ name: '', email: '', phone: '', desiredPosition: '', applicationDate: '', status: 'Applied', interviewDate: '', resumeFileName: '' }); // Clear form
    setEditingCandidateId(null); // Reset editing state
    setShowApplicationForm(false); // Hide form after submission
    if (fileInputRef.current) { // Clear file input after submission
      fileInputRef.current.value = '';
    }
  };

  // Handle viewing candidate details
  const handleViewClick = (candidate) => {
    setViewingCandidate(candidate);
  };

  // Handle closing the view candidate details modal
  const handleCloseViewModal = () => {
    setViewingCandidate(null);
  };

  // Handle initiating delete action (show confirmation modal)
  const handleDeleteClick = (id) => {
    setCandidateToDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  // Confirm and perform delete
  const confirmDeleteCandidate = async () => {
    try {
      const response = await fetch(`${API_URL}/${candidateToDeleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete candidate');
      showToast('Candidate deleted successfully!', 'success');
      fetchAndSetCandidates(); // Refresh list with mapping
    } catch (err) {
      showToast('Error deleting candidate', 'error');
    }
    setShowConfirmDeleteModal(false);
    setCandidateToDeleteId(null);
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setCandidateToDeleteId(null);
  };

  // Filtered candidates based on search term
  const filteredCandidates = candidates.filter(candidate =>
    (candidate.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidate.desiredPosition || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidate.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidate.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
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
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = sortedCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(sortedCandidates.length / candidatesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-gray-100 p-4 font-sans flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-screen-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Hiring Dashboard</h1>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`py-2 px-6 rounded-lg font-semibold transition duration-300 ease-in-out ${
              currentView === 'dashboard'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Manage Applications
          </button>
          <button
            onClick={() => setCurrentView('statusChecker')}
            className={`py-2 px-6 rounded-lg font-semibold transition duration-300 ease-in-out ${
              currentView === 'statusChecker'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Check My Status
          </button>
        </div>

        {/* Conditional Rendering based on currentView */}
        {currentView === 'dashboard' ? (
          <>
            {/* Action Buttons: Toggle Application Form & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Reset page on search
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/2"
              />
              <button
                onClick={handleToggleApplicationForm}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 w-full md:w-auto"
              >
                {showApplicationForm ? 'Hide Application Form' : 'Add New Application'}
              </button>
            </div>

            {/* Apply for a Role / Edit Candidate Form Section */}
            {showApplicationForm && (
              <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  {editingCandidateId ? 'Edit Candidate Application' : 'Submit New Application'}
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
                      type="text"
                      name="desiredPosition"
                      placeholder="Desired Position"
                      value={formData.desiredPosition}
                      onChange={handleInputChange}
                      className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.desiredPosition ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                      required
                    />
                    {validationErrors.desiredPosition && <p className="text-red-500 text-sm mt-1">{validationErrors.desiredPosition}</p>}
                  </div>
                  <div>
                    <input
                      type="date"
                      name="applicationDate"
                      placeholder="Application Date"
                      value={formData.applicationDate}
                      onChange={handleInputChange}
                      className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${validationErrors.applicationDate ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'}`}
                      required
                    />
                    {validationErrors.applicationDate && <p className="text-red-500 text-sm mt-1">{validationErrors.applicationDate}</p>}
                  </div>
                  {/* Resume Upload Field */}
                  <div>
                    <label htmlFor="resumeUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF, DOCX)</label>
                    <input
                      type="file"
                      id="resumeUpload"
                      name="resumeUpload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      ref={fileInputRef} // Attach ref here
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-50 file:text-purple-700
                        hover:file:bg-purple-100"
                    />
                    {formData.resumeFileName && (
                      <p className="text-xs text-gray-500 mt-1">Current: {formData.resumeFileName}</p>
                    )}
                  </div>

                  {/* Status and Interview Date fields are relevant for editing, but not necessarily for initial application */}
                  {editingCandidateId && (
                    <>
                      <div>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Offered">Offered</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="date"
                          name="interviewDate"
                          placeholder="Interview Date (Optional)"
                          value={formData.interviewDate}
                          onChange={handleInputChange}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowApplicationForm(false); setEditingCandidateId(null); setFormData({ name: '', email: '', phone: '', desiredPosition: '', applicationDate: '', status: 'Applied', interviewDate: '', resumeFileName: '' }); setValidationErrors({}); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                  >
                    {editingCandidateId ? 'Update Application' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}

            {/* Loading Indicator */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading candidates...</p>
              </div>
            ) : (
              /* Candidate List (Table View) */
              filteredCandidates.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No candidates found. Add some!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-gray-200">
                      <tr>
                        {['name', 'desiredPosition', 'status', 'applicationDate', 'interviewDate', 'email', 'phone', 'resumeFileName'].map((column) => (
                          <th
                            key={column}
                            className="py-3 px-4 text-left text-gray-700 font-semibold uppercase text-sm cursor-pointer hover:bg-gray-300 transition duration-150 ease-in-out"
                            onClick={() => handleSort(column)}
                          >
                            {column === 'resumeFileName' ? 'Resume' : column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim()}
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
                      {currentCandidates.map((candidate) => (
                        <tr key={candidate.id || candidate.email} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                          <td className="py-3 px-4 text-gray-800">{candidate.name}</td>
                          <td className="py-3 px-4 text-gray-800">{candidate.desiredPosition}</td>
                          <td className="py-3 px-4 text-gray-800">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              candidate.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                              candidate.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' :
                              candidate.status === 'Offered' ? 'bg-green-100 text-green-800' :
                              candidate.status === 'Hired' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {candidate.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-800">{candidate.applicationDate}</td>
                          <td className="py-3 px-4 text-gray-800">{candidate.interviewDate || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-800">{candidate.email}</td>
                          <td className="py-3 px-4 text-gray-800">{candidate.phone}</td>
                          <td className="py-3 px-4 text-gray-800">
                            {candidate.resumeFileName ? (
                              <span className="text-purple-600 hover:underline cursor-pointer text-sm">
                                {candidate.resumeFileName}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <button
                              onClick={() => handleViewClick(candidate)}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditClick(candidate)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(candidate.id)}
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
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <CandidateStatusChecker candidates={candidates} showToast={showToast} setCurrentView={setCurrentView} />
        )}

        {/* View Candidate Details Modal */}
        {viewingCandidate && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Candidate Details</h2>
              <p className="mb-2"><span className="font-semibold">Name:</span> {viewingCandidate.name}</p>
              <p className="mb-2"><span className="font-semibold">Email:</span> {viewingCandidate.email}</p>
              <p className="mb-2"><span className="font-semibold">Phone:</span> {viewingCandidate.phone}</p>
              <p className="mb-2"><span className="font-semibold">Desired Position:</span> {viewingCandidate.desiredPosition}</p>
              <p className="mb-2"><span className="font-semibold">Application Date:</span> {viewingCandidate.applicationDate}</p>
              <p className="mb-2"><span className="font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
                  viewingCandidate.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                  viewingCandidate.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' :
                  viewingCandidate.status === 'Offered' ? 'bg-green-100 text-green-800' :
                  viewingCandidate.status === 'Hired' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {viewingCandidate.status}
                </span>
              </p>
              <p className="mb-2"><span className="font-semibold">Interview Date:</span> {viewingCandidate.interviewDate || 'N/A'}</p>
              <p className="mb-4"><span className="font-semibold">Resume:</span>
                {viewingCandidate.resumeFileName ? (
                  <span className="ml-2 text-purple-600 hover:underline cursor-pointer">
                    {viewingCandidate.resumeFileName}
                  </span>
                ) : (
                  'N/A'
                )}
              </p>
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
              <p className="mb-6 text-gray-700">Are you sure you want to delete this candidate?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCandidate}
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
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${toastType === 'success' ? 'bg-green-500' : toastType === 'error' ? 'bg-red-500' : 'bg-blue-500'} transition-opacity duration-300 ease-in-out opacity-100`}>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hiring;
