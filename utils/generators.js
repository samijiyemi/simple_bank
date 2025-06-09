// Utility functions for generating account numbers and BVNs
export const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

export const generateBVN = () => {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString();
};
