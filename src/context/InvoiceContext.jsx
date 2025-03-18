
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';
import { recalculateInvoice } from '../utils/calculations';

const InvoiceContext = createContext();

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  // Load invoices from localStorage
  const loadInvoices = () => {
    const savedInvoices = localStorage.getItem('invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  };

  const [invoices, setInvoices] = useState(loadInvoices);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  // Generate the next invoice number
  const getNextInvoiceNumber = () => {
    if (invoices.length === 0) {
      return 'INV-0001';
    }
    
    const latestInvoiceNumber = invoices[invoices.length - 1].invoiceNumber;
    const numberPart = latestInvoiceNumber.split('-')[1];
    const nextNumber = parseInt(numberPart, 10) + 1;
    
    return `INV-${nextNumber.toString().padStart(4, '0')}`;
  };

  // Save invoice to localStorage
  const saveInvoice = (invoice) => {
    const completedInvoice = recalculateInvoice(invoice);
    
    if (!completedInvoice.id) {
      // It's a new invoice
      const newInvoice = {
        ...completedInvoice,
        id: Date.now().toString(),
        invoiceNumber: completedInvoice.invoiceNumber || getNextInvoiceNumber(),
        date: completedInvoice.date || new Date().toISOString().split('T')[0],
      };
      
      const updatedInvoices = [...invoices, newInvoice];
      setInvoices(updatedInvoices);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      toast.success('Invoice created successfully');
    } else {
      // Update existing invoice
      const updatedInvoices = invoices.map(inv => 
        inv.id === completedInvoice.id ? completedInvoice : inv
      );
      setInvoices(updatedInvoices);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      toast.success('Invoice updated successfully');
    }
  };

  // Delete invoice
  const deleteInvoice = (id) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    toast.success('Invoice deleted successfully');
  };

  // Update a field in the current invoice and recalculate
  const updateInvoiceField = (field, value) => {
    if (!currentInvoice) return;
    
    const updatedInvoice = {
      ...currentInvoice,
      [field]: value
    };
    
    const recalculated = recalculateInvoice(updatedInvoice);
    setCurrentInvoice(recalculated);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        currentInvoice,
        setCurrentInvoice,
        saveInvoice,
        deleteInvoice,
        getNextInvoiceNumber,
        updateInvoiceField
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
