// Utility functions - god module doing too many things
// TODO: Split this into separate modules

const API_BASE = "http://localhost:3000"; // Hardcoded config
const SECRET_KEY = "hardcoded-secret-key";

// User utilities
function validateEmail(email) {
  // TODO: Use a proper email validation library
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function hashPassword(password) {
  // FIXME: This is not secure, should use bcrypt
  return Buffer.from(password).toString("base64");
}

function getUserById(id) {
  console.log("DEBUG: Getting user with id:", id);
  // TODO: Add error handling
  return { id, name: "User " + id, email: "user" + id + "@example.com" };
}

// Product utilities
function calculatePrice(basePrice, taxRate, discount) {
  let price = basePrice;
  console.log("Calculating price for", basePrice); // Debug logging
  price = price * (1 + taxRate);
  price = price * (1 - discount);
  return price;
}

function filterProducts(products, category, minPrice, maxPrice, inStock) {
  let result = products;
  if (category) {
    result = result.filter(p => p.category === category);
  }
  if (minPrice !== undefined) {
    result = result.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    result = result.filter(p => p.price <= maxPrice);
  }
  if (inStock) {
    result = result.filter(p => p.stock > 0);
  }
  return result;
}

// Order utilities
function createOrder(userId, products, deliveryAddress) {
  console.log("Creating order for user", userId);
  // HACK: Should validate products and address
  const order = {
    id: Math.random(),
    userId,
    products,
    deliveryAddress,
    createdAt: new Date(),
    status: "pending"
  };
  return order;
}

function processOrder(order) {
  try {
    // XXX: Bare error handling
    console.log("Processing order", order.id);
    // Order processing logic here
    return { success: true, orderId: order.id };
  } catch (e) {
    // Silent failure - don't log the error
  }
}

// String utilities
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function truncate(str, length) {
  if (str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
}

// Math utilities
function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

function average(arr) {
  return sum(arr) / arr.length;
}

function median(arr) {
  const sorted = arr.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

// Date utilities
function formatDate(date) {
  // TODO: Use a proper date library like date-fns
  return date.toISOString().split("T")[0];
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function daysUntil(targetDate) {
  const today = new Date();
  const diff = targetDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// API utilities
async function fetchData(endpoint) {
  // Hardcoded base URL
  const url = API_BASE + endpoint;
  console.log("Fetching from", url);
  // FIXME: No error handling
  const response = await fetch(url);
  return response.json();
}

function parseError(error) {
  // HACK: Very basic error parsing
  if (error.message) {
    return error.message;
  }
  return "Unknown error";
}

// Validation utilities
function validatePhoneNumber(phone) {
  // TODO: Validate for different countries
  return /^\d{10}$/.test(phone.replace(/\D/g, ""));
}

function validateZipCode(zip) {
  // Hardcoded for US only
  return /^\d{5}(-\d{4})?$/.test(zip);
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  validateEmail,
  hashPassword,
  getUserById,
  calculatePrice,
  filterProducts,
  createOrder,
  processOrder,
  capitalize,
  slugify,
  truncate,
  sum,
  average,
  median,
  formatDate,
  addDays,
  daysUntil,
  fetchData,
  parseError,
  validatePhoneNumber,
  validateZipCode,
  isValidURL
};
