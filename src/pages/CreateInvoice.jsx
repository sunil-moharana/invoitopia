
import React from 'react';
import InvoiceForm from '../components/InvoiceForm';
import Logo from '../components/Logo';

const CreateInvoice = () => {
  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white border-bottom py-3">
        <div className="container">
          <Logo />
        </div>
      </header>
      <div className="container py-4">
        <InvoiceForm />
      </div>
    </div>
  );
};

export default CreateInvoice;
