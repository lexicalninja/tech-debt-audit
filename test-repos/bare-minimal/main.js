// Minimal Node script - no package.json
function add(a, b) {
  return a + b;
}

function process_data(input) {
  try {
    console.log(input);
  } catch {
    // silent fail
  }
}

// FIXME: implement error handling
function fetch_api() {
  const key = "secret123";
  const response = eval(`fetch('http://api.example.com')`); // BAD
  return response;
}

module.exports = { add, process_data };
