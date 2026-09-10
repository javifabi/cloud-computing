import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-kzYfsp9h6SO1R2VhRX1Reb6Bl_0ZPns",
    authDomain: "techstore-5b57e.firebaseapp.com",
    projectId: "techstore-5b57e",
    storageBucket: "techstore-5b57e.firebasestorage.app",
    messagingSenderId: "910312348571",
    appId: "1:910312348571:web:7fd1790dd8515f75a45f3e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");

const correoLogin = document.getElementById("correoLogin");
const contrasenaLogin = document.getElementById("contrasenaLogin");

const correoRegistro = document.getElementById("correoRegistro");
const contrasenaRegistro = document.getElementById("contrasenaRegistro");

const mensaje = document.getElementById("mensaje");

formRegistro.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    try {
        await createUserWithEmailAndPassword(
            auth,
            correoRegistro.value,
            contrasenaRegistro.value
        );

        mensaje.textContent = "Cuenta creada correctamente";
        formRegistro.reset();

    } catch (error) {
        mensaje.textContent = "Error al crear la cuenta: " + error.message;
    }
});

formLogin.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    try {
        await signInWithEmailAndPassword(
            auth,
            correoLogin.value,
            contrasenaLogin.value
        );

        mensaje.textContent = "Inicio de sesión correcto";

        window.location.href = "productos.html";

    } catch (error) {
        mensaje.textContent = "Correo o contraseña incorrectos";
    }
});