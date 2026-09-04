const formulario = document.getElementById("formulario");

const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const rutInput = document.getElementById("rut");
const correoInput = document.getElementById("correo");
const carreraInput = document.getElementById("carrera");

const tablaDatos = document.getElementById("tablaDatos");

let estudiantes =
    JSON.parse(localStorage.getItem("estudiantes")) || [];


function mostrarEstudiantes() {

    tablaDatos.innerHTML = "";

    estudiantes.forEach((estudiante) => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${estudiante.id}</td>
            <td>${estudiante.nombre}</td>
            <td>${estudiante.edad}</td>
            <td>${estudiante.rut}</td>
            <td>${estudiante.correo}</td>
            <td>${estudiante.carrera}</td>
            <td>
                <button
                    type="button"
                    onclick="eliminarEstudiante(${estudiante.id})"
                >
                    Eliminar
                </button>
            </td>
        `;

        tablaDatos.appendChild(fila);
    });
}


formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nuevoEstudiante = {

        id: Date.now(),

        nombre: nombreInput.value,
        edad: edadInput.value,
        rut: rutInput.value,
        correo: correoInput.value,
        carrera: carreraInput.value

    };

    estudiantes.push(nuevoEstudiante);

    localStorage.setItem(
        "estudiantes",
        JSON.stringify(estudiantes)
    );

    mostrarEstudiantes();

    formulario.reset();
});


function eliminarEstudiante(id) {

    estudiantes = estudiantes.filter(
        estudiante => estudiante.id !== id
    );

    localStorage.setItem(
        "estudiantes",
        JSON.stringify(estudiantes)
    );

    mostrarEstudiantes();
}


mostrarEstudiantes();