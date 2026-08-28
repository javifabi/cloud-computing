const formulario = document.getElementById("formulario");
const nombreInput = document.getElementById("nombre");
const fechaInput = document.getElementById("fecha");
const tablaDatos = document.getElementById("tablaDatos");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function mostrarUsuarios() {
    tablaDatos.innerHTML = "";

    usuarios.forEach((usuario) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.fecha}</td>
            <td>
                <button onclick="eliminarUsuario(${usuario.id})">
                    Eliminar
                </button>
            </td>
        `;

        tablaDatos.appendChild(fila);
    });
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombreInput.value,
        fecha: fechaInput.value
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    mostrarUsuarios();

    formulario.reset();
});

function eliminarUsuario(id) {
    usuarios = usuarios.filter(
        usuario => usuario.id !== id
    );

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    mostrarUsuarios();
}

mostrarUsuarios();