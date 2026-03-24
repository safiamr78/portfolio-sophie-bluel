const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (event) => {
event.preventDefault();

errorMessage.innerText = "";

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const loginData = {
email: email,
password: password
};

try {
const response = await fetch("http://localhost:5678/api/users/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(loginData)
});

if (response.ok) {
const data = await response.json();

localStorage.setItem("token", data.token);
window.location.href = "./index.html";
} else {
errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";
}
} catch (error) {
errorMessage.innerText = "Impossible de se connecter au serveur";
console.error("Erreur :", error);
}
});