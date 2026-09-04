const formulario = document.getElementById("formulario");

const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const rutInput = document.getElementById("rut");
const correoInput = document.getElementById("correo");
const carreraInput = document.getElementById("carrera");

const tablaDatos = document.getElementById("tablaDatos");

let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

let idEditando = null;

function guardarEnLocalStorage() {
    localStorage.setItem(
        "estudiantes",
        JSON.stringify(estudiantes)
    );
}

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
                    onclick="editarEstudiante(${estudiante.id})"
                >
                    Editar
                </button>

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

    if (idEditando === null) {

        const nuevoEstudiante = {
            id: Date.now(),
            nombre: nombreInput.value,
            edad: edadInput.value,
            rut: rutInput.value,
            correo: correoInput.value,
            carrera: carreraInput.value
        };

        estudiantes.push(nuevoEstudiante);

    } else {

        const estudiante = estudiantes.find(
            estudiante => estudiante.id === idEditando
        );

        estudiante.nombre = nombreInput.value;
        estudiante.edad = edadInput.value;
        estudiante.rut = rutInput.value;
        estudiante.correo = correoInput.value;
        estudiante.carrera = carreraInput.value;

        idEditando = null;

        formulario.querySelector("button[type='submit']").textContent =
            "Guardar estudiante";
    }

    guardarEnLocalStorage();

    mostrarEstudiantes();

    formulario.reset();
});

function editarEstudiante(id) {
    const estudiante = estudiantes.find(
        estudiante => estudiante.id === id
    );

    if (!estudiante) {
        return;
    }

    nombreInput.value = estudiante.nombre;
    edadInput.value = estudiante.edad;
    rutInput.value = estudiante.rut;
    correoInput.value = estudiante.correo;
    carreraInput.value = estudiante.carrera;

    idEditando = id;

    formulario.querySelector("button[type='submit']").textContent =
        "Guardar cambios";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function eliminarEstudiante(id) {
    estudiantes = estudiantes.filter(
        estudiante => estudiante.id !== id
    );

    guardarEnLocalStorage();

    mostrarEstudiantes();
}

mostrarEstudiantes();