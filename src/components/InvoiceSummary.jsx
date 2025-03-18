
import React from 'react';
import { formatCurrency } from '../utils/calculations';

const InvoiceSummary = ({ invoice, onChange }) => {
  const handleDiscountTypeChange = (e) => {
    onChange('discountType', e.target.value);
  };

  const handleDiscountValueChange = (e) => {
    onChange('discountValue', parseFloat(e.target.value) || 0);
  };

  return (
    <div className="row mt-4">
      <div className="col-md-6">
        <div className="invoice-summary">
          <h3 className="fs-5 fw-semibold mb-4">Invoice Summary</h3>
          
          <div className="mb-4">
            <div className="row mb-3">
              <div className="col-6">
                <label className="form-label">Subtotal</label>
                <div className="form-control bg-light" tabIndex={-1}>
                  {formatCurrency(invoice.subTotal || 0)}
                </div>
              </div>
              
              <div className="col-6">
                <label className="form-label">Discount Type</label>
                <select
                  className="form-select"
                  value={invoice.discountType}
                  onChange={handleDiscountTypeChange}
                >
                  <option value="percentage">Percentage</option>
                  <option value="amount">Fixed Amount</option>
                </select>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-6">
                <label className="form-label">Discount Value</label>
                <input
                  type="number"
                  className="form-control"
                  value={invoice.discountValue || 0}
                  onChange={handleDiscountValueChange}
                  min="0"
                />
              </div>
              
              <div className="col-6">
                <label className="form-label">Discount Amount</label>
                <div className="form-control bg-light" tabIndex={-1}>
                  {formatCurrency(invoice.discount || 0)}
                </div>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-6">
                <label className="form-label">Taxable Amount</label>
                <div className="form-control bg-light" tabIndex={-1}>
                  {formatCurrency(invoice.taxableAmount || 0)}
                </div>
              </div>
              
              <div className="col-6">
                <label className="form-label">Total GST</label>
                <div className="form-control bg-light" tabIndex={-1}>
                  {formatCurrency((invoice.cgst || 0) + (invoice.sgst || 0))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="form-label">Total Amount</label>
              <div className="form-control bg-primary bg-opacity-10 text-primary fw-semibold fs-5" tabIndex={-1}>
                {formatCurrency(invoice.total || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="border rounded p-4 mb-4">
          <h3 className="fs-5 fw-semibold mb-3">Notes</h3>
          <textarea
            className="form-control"
            style={{ height: "120px", resize: "none" }}
            placeholder="Any additional notes or information for the client..."
            value={invoice.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
          ></textarea>
        </div>
        
        <div className="border rounded p-4">
          <h3 className="fs-5 fw-semibold mb-3">Terms & Conditions</h3>
          <textarea
            className="form-control"
            style={{ height: "120px", resize: "none" }}
            placeholder="Terms and conditions for this invoice..."
            value={invoice.termsAndConditions || ''}
            onChange={(e) => onChange('termsAndConditions', e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
