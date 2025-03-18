
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { formatCurrency } from '../utils/calculations';
import Logo from '../components/Logo';

const InvoiceList = () => {
  const { invoices, deleteInvoice, setCurrentInvoice } = useInvoice();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.billTo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create a new invoice
  const handleCreateInvoice = () => {
    setCurrentInvoice(null); // Reset current invoice
    navigate('/create-invoice');
  };

  // Edit an existing invoice
  const handleEditInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    navigate('/create-invoice');
  };

  // Delete an invoice with confirmation
  const handleDeleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  return (
    <div className="min-vh-100 bg-light fade-in">
      {/* Header */}
      <header className="bg-white border-bottom py-3 sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <Logo />
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={handleCreateInvoice}
          >
            <i className="bi bi-plus me-2"></i> Create Invoice
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fs-2 fw-bold text-dark">Invoices</h1>
          <div className="position-relative">
            <input
              type="text"
              placeholder="Search invoices..."
              className="form-control ps-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded shadow slide-up">
          {filteredInvoices.length === 0 ? (
            <div className="p-5 text-center text-secondary">
              {searchTerm ? (
                <p>No invoices match your search. Try a different search term.</p>
              ) : (
                <div>
                  <i className="bi bi-file-earmark-text fs-1 d-block mb-3 text-secondary"></i>
                  <p className="mb-4">No invoices found</p>
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateInvoice}
                  >
                    <i className="bi bi-plus me-2"></i> Create your first invoice
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-4 py-3">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-3">{invoice.date}</td>
                      <td className="px-4 py-3">{invoice.billTo.name}</td>
                      <td className="px-4 py-3 fw-bold">{formatCurrency(invoice.total)}</td>
                      <td className="px-4 py-3">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvoiceList;
