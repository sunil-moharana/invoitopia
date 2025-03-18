
import React, { useEffect } from 'react';
import { calculateItemTaxes, calculateItemAmount, formatCurrency } from '../utils/calculations';

const InvoiceItem = ({ item, index, onChange, onRemove }) => {
  // Handle change for any field
  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  // Update taxes and amount when price, quantity, or GST changes
  useEffect(() => {
    const { cgst, sgst } = calculateItemTaxes(item);
    const amount = calculateItemAmount(item);
    
    // Only update if the values have changed
    if (cgst !== item.cgst) {
      handleChange('cgst', cgst);
    }
    
    if (sgst !== item.sgst) {
      handleChange('sgst', sgst);
    }
    
    if (amount !== item.amount) {
      handleChange('amount', amount);
    }
  }, [item.price, item.quantity, item.gstPercentage]);

  return (
    <tr className="fade-in">
      <td>
        <input
          type="text"
          className="form-control"
          value={item.itemName}
          onChange={(e) => handleChange('itemName', e.target.value)}
          placeholder="Item name"
        />
      </td>
      <td>
        <select
          className="form-select"
          value={item.serviceType}
          onChange={(e) => handleChange('serviceType', e.target.value)}
        >
          <option value="product">Product</option>
          <option value="service">Service</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={item.gstPercentage}
          onChange={(e) => handleChange('gstPercentage', parseFloat(e.target.value) || 0)}
          placeholder="GST %"
          min="0"
          max="100"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={item.quantity}
          onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || 0)}
          placeholder="Qty"
          min="1"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={item.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          placeholder="Price"
          min="0"
        />
      </td>
      <td>
        <span className="text-secondary">
          {formatCurrency(item.cgst)}
        </span>
      </td>
      <td>
        <span className="text-secondary">
          {formatCurrency(item.sgst)}
        </span>
      </td>
      <td>
        <span className="fw-medium">
          {formatCurrency(item.amount)}
        </span>
      </td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onRemove(index)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default InvoiceItem;
