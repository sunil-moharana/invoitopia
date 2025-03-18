
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to invoices page
    navigate('/invoices');
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="fs-2 fw-bold">Redirecting to Invoices...</h1>
      </div>
    </div>
  );
};

export default Index;
