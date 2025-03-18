
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useInvoice } from '../context/InvoiceContext';
import InvoiceItem from './InvoiceItem';
import InvoiceSummary from './InvoiceSummary';

const InvoiceForm = () => {
  const { currentInvoice, setCurrentInvoice, saveInvoice, updateInvoiceField, getNextInvoiceNumber } = useInvoice();
  const navigate = useNavigate();
  
  // Initialize invoice if it doesn't exist
  useEffect(() => {
    if (!currentInvoice) {
      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 30);
      
      setCurrentInvoice({
        id: '',
        invoiceNumber: getNextInvoiceNumber(),
        date: format(today, 'yyyy-MM-dd'),
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        billFrom: {
          name: 'Your Company',
          address: 'Your Address',
          email: 'your.email@example.com',
          phone: '123-456-7890',
        },
        billTo: {
          name: '',
          address: '',
          email: '',
          phone: '',
        },
        items: [createNewItem()],
        subTotal: 0,
        discountType: 'percentage',
        discountValue: 0,
        discount: 0,
        taxableAmount: 0,
        cgst: 0,
        sgst: 0,
        total: 0,
        notes: '',
        termsAndConditions: 'Payment is due within 30 days. Late payment is subject to fees.',
      });
    }
  }, []);

  // Create a new item
  function createNewItem() {
    return {
      id: uuidv4(),
      itemName: '',
      serviceType: 'product',
      gstPercentage: 18,
      quantity: 1,
      price: 0,
      cgst: 0,
      sgst: 0,
      amount: 0,
      description: '',
    };
  }

  // Add a new item
  const handleAddItem = () => {
    if (!currentInvoice) return;
    
    updateInvoiceField('items', [...(currentInvoice.items || []), createNewItem()]);
  };

  // Update an item field
  const handleItemChange = (index, field, value) => {
    if (!currentInvoice || !currentInvoice.items) return;
    
    const updatedItems = [...currentInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    
    updateInvoiceField('items', updatedItems);
  };

  // Remove an item
  const handleRemoveItem = (index) => {
    if (!currentInvoice || !currentInvoice.items) return;
    if (currentInvoice.items.length <= 1) return; // Don't remove the last item
    
    const updatedItems = currentInvoice.items.filter((_, i) => i !== index);
    updateInvoiceField('items', updatedItems);
  };

  // Update bill from/to fields
  const handleBillInfoChange = (type, field, value) => {
    if (!currentInvoice) return;
    
    if (type === 'from') {
      updateInvoiceField('billFrom', {
        ...currentInvoice.billFrom,
        [field]: value,
      });
    } else {
      updateInvoiceField('billTo', {
        ...currentInvoice.billTo,
        [field]: value,
      });
    }
  };

  // Save the invoice
  const handleSaveInvoice = () => {
    if (!currentInvoice) return;
    
    saveInvoice(currentInvoice);
    navigate('/invoices');
  };

  // Go back to invoice list
  const handleCancel = () => {
    navigate('/invoices');
  };

  if (!currentInvoice) return <div>Loading...</div>;

  return (
    <div className="invoice-container fade-in">
      <div className="invoice-header">
        <button onClick={handleCancel} className="btn btn-outline-secondary btn-sm d-flex align-items-center">
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>
        <h1>Invoice</h1>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleSaveInvoice}
        >
          <i className="bi bi-save me-2"></i> Save Invoice
        </button>
      </div>

      <div className="invoice-form">
        <div className="row mb-4">
          {/* Invoice Details */}
          <div className="col-md-6">
            <div className="mb-4">
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label">Invoice Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentInvoice.invoiceNumber || ''}
                    onChange={(e) => updateInvoiceField('invoiceNumber', e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Invoice Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentInvoice.date || ''}
                    onChange={(e) => updateInvoiceField('date', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={currentInvoice.dueDate || ''}
                  onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
                />
              </div>
            </div>
            <div className="border-top pt-4 mt-4">
              <h3 className="fs-6 text-secondary mb-3">Bill From</h3>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentInvoice.billFrom?.name || ''}
                  onChange={(e) => handleBillInfoChange('from', 'name', e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  value={currentInvoice.billFrom?.address || ''}
                  onChange={(e) => handleBillInfoChange('from', 'address', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={currentInvoice.billFrom?.email || ''}
                    onChange={(e) => handleBillInfoChange('from', 'email', e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentInvoice.billFrom?.phone || ''}
                    onChange={(e) => handleBillInfoChange('from', 'phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Bill To */}
          <div className="col-md-6 border-start ps-4">
            <h3 className="fs-6 text-secondary mb-3">Bill To</h3>
            <div className="mb-3">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                value={currentInvoice.billTo?.name || ''}
                onChange={(e) => handleBillInfoChange('to', 'name', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                value={currentInvoice.billTo?.address || ''}
                onChange={(e) => handleBillInfoChange('to', 'address', e.target.value)}
                rows={2}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={currentInvoice.billTo?.email || ''}
                  onChange={(e) => handleBillInfoChange('to', 'email', e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentInvoice.billTo?.phone || ''}
                  onChange={(e) => handleBillInfoChange('to', 'phone', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="mt-4">
          <div className="table-responsive">
            <table className="table invoice-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Service Type</th>
                  <th>GST %</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.items?.map((item, index) => (
                  <InvoiceItem
                    key={item.id}
                    item={item}
                    index={index}
                    onChange={handleItemChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-3">
            <button
              type="button"
              className="add-item-button d-flex align-items-center"
              onClick={handleAddItem}
            >
              <i className="bi bi-plus me-2"></i> Add Item
            </button>
          </div>
        </div>
        
        {/* Summary and Notes */}
        <InvoiceSummary 
          invoice={currentInvoice} 
          onChange={updateInvoiceField} 
        />
        
        {/* Signature */}
        <div className="invoice-signature">
          <div className="text-end">
            <div className="border-top border-dark-subtle pt-3" style={{width: "200px"}}>
              <span className="text-secondary small">Authorized Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
