import Invoice from '../models/invoice.js';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single invoice by ID
// @route   GET /api/invoices/:id
// @access  Public
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Public
export const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Public
export const updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Public
export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
