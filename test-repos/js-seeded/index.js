const utils = require("./utils");
const _ = require("lodash");
const axios = require("axios");

// Main application
function main() {
  console.log("Starting application...");

  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];

  const products = [
    { id: 1, name: "Widget", category: "tools", price: 29.99, stock: 10 },
    { id: 2, name: "Gadget", category: "tools", price: 49.99, stock: 0 },
    { id: 3, name: "Doohickey", category: "parts", price: 9.99, stock: 100 }
  ];

  // TODO: Refactor this logic into separate functions
  for (let i = 0; i < users.length; i++) {
    console.log("Processing user:", users[i].name);
    const userProducts = utils.filterProducts(products, "tools", 20, 50, true);
    console.log("Available products for user:", userProducts);

    // HACK: Temporary order creation
    const order = utils.createOrder(users[i].id, userProducts, "123 Main St");
    console.log("Created order:", order);

    utils.processOrder(order);
  }

  // Debug code left in
  console.log("DEBUG MODE: All users:", users);
  console.log("DEBUG MODE: All products:", products);

  // Unused variable
  const unused = "This variable is never used";

  // Magic numbers without explanation
  const discountRate = 0.15;
  const taxRate = 0.08;
  for (let p of products) {
    const finalPrice = utils.calculatePrice(p.price, taxRate, discountRate);
    console.log(p.name + " final price: $" + finalPrice.toFixed(2));
  }
}

// FIXME: This function has no error handling
async function fetchUserData() {
  try {
    const data = await utils.fetchData("/users");
    console.log("User data:", data);
    return data;
  } catch {
    // Silent failure - just return undefined
  }
}

// Unused function
function deprecatedFunction() {
  console.log("This function is deprecated but still in the code");
}

if (require.main === module) {
  main();
}

module.exports = { main, fetchUserData };
