
// Calculate CGST and SGST for a single item
export const calculateItemTaxes = (item) => {
  const price = item.price || 0;
  const quantity = item.quantity || 0;
  const gstPercentage = item.gstPercentage || 0;
  
  const totalPrice = price * quantity;
  const gstAmount = totalPrice * (gstPercentage / 100);
  
  // Divide GST equally between CGST and SGST
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  
  return { cgst, sgst };
};

// Calculate the amount for a single item (including taxes)
export const calculateItemAmount = (item) => {
  const price = item.price || 0;
  const quantity = item.quantity || 0;
  const gstPercentage = item.gstPercentage || 0;
  
  const totalPrice = price * quantity;
  const gstAmount = totalPrice * (gstPercentage / 100);
  
  return totalPrice + gstAmount;
};

// Calculate subtotal (sum of all item amounts before discount)
export const calculateSubTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);
};

// Calculate discount amount based on type and value
export const calculateDiscount = (subTotal, discountType, discountValue) => {
  if (discountType === 'percentage') {
    return subTotal * (discountValue / 100);
  } else {
    return discountValue;
  }
};

// Calculate taxable amount (subtotal - discount)
export const calculateTaxableAmount = (subTotal, discount) => {
  return subTotal - discount;
};

// Calculate total CGST and SGST
export const calculateTotalTaxes = (items) => {
  return items.reduce(
    (acc, item) => {
      const { cgst, sgst } = calculateItemTaxes(item);
      return {
        totalCGST: acc.totalCGST + cgst,
        totalSGST: acc.totalSGST + sgst,
      };
    },
    { totalCGST: 0, totalSGST: 0 }
  );
};

// Calculate grand total
export const calculateTotal = (taxableAmount, totalCGST, totalSGST) => {
  return taxableAmount + totalCGST + totalSGST;
};

// Format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Calculate and update all invoice fields
export const recalculateInvoice = (invoice) => {
  const items = invoice.items || [];
  
  // Update item calculations
  const updatedItems = items.map(item => {
    const { cgst, sgst } = calculateItemTaxes(item);
    const amount = calculateItemAmount(item);
    return {
      ...item,
      cgst,
      sgst,
      amount
    };
  });
  
  // Calculate invoice totals
  const subTotal = calculateSubTotal(updatedItems);
  const discount = calculateDiscount(
    subTotal, 
    invoice.discountType || 'amount', 
    invoice.discountValue || 0
  );
  const taxableAmount = calculateTaxableAmount(subTotal, discount);
  const { totalCGST, totalSGST } = calculateTotalTaxes(updatedItems);
  const total = calculateTotal(taxableAmount, totalCGST, totalSGST);
  
  return {
    ...invoice,
    items: updatedItems,
    subTotal,
    discount,
    taxableAmount,
    cgst: totalCGST,
    sgst: totalSGST,
    total
  };
};
