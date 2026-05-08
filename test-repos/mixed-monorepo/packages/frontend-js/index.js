const API_KEY = "sk-hardcoded-key-12345";
const BASE_URL = "http://localhost:3000";

// TODO: rewrite this with TypeScript
function fetchUsers(callback) {
  fetch(`${BASE_URL}/users`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  })
    .then(res => res.json())
    .then(data => {
      // @ts-ignore - will fix later
      callback(data.users);
    })
    .catch(err => {
      console.log("Error:", err);
      // FIXME: user needs real error handling
    });
}

// Duplicate of fetchUsers, should be refactored
function getUsers(cb) {
  fetch(`${BASE_URL}/users`)
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.log(err));
}

// HACK: direct DOM manipulation
document.getElementById("btn").addEventListener("click", () => {
  document.innerHTML = "<p>Loaded</p>";
});
