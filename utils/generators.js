// Utility functions for generating account numbers and BVNs
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

const generateBVN = () => {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString();
};

module.exports = { generateAccountNumber, generateBVN };
