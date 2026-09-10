import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
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

const db = getFirestore(app);
const auth = getAuth(app);


const formularioProducto =
    document.getElementById("formularioProducto");

const nombreInput =
    document.getElementById("nombre");

const categoriaInput =
    document.getElementById("categoria");

const precioInput =
    document.getElementById("precio");

const stockInput =
    document.getElementById("stock");

const tablaProductos =
    document.getElementById("tablaProductos");

const buscarInput =
    document.getElementById("buscar");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

let productos = [];

let idEditando = null;


onAuthStateChanged(auth, (usuario) => {

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    cargarProductos();
});


async function cargarProductos() {

    try {

        const consulta =
            await getDocs(collection(db, "productos"));

        productos = [];

        consulta.forEach((documento) => {

            productos.push({
                id: documento.id,
                ...documento.data()
            });

        });

        mostrarProductos(buscarInput.value);

    } catch (error) {

        alert("Error al cargar productos");

        console.error(error);
    }
}


function mostrarProductos(filtro = "") {

    tablaProductos.innerHTML = "";

    const texto = filtro.toLowerCase();

    const productosFiltrados =
        productos.filter((producto) => {

            return (
                producto.nombre
                    .toLowerCase()
                    .includes(texto) ||

                producto.categoria
                    .toLowerCase()
                    .includes(texto)
            );
        });


    productosFiltrados.forEach((producto) => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.id}</td>

            <td>${producto.nombre}</td>

            <td>${producto.categoria}</td>

            <td>$${producto.precio}</td>

            <td>
                ${producto.stock > 0
                    ? producto.stock
                    : "Sin stock"}
            </td>

            <td>

                <button
                    type="button"
                    data-accion="vender"
                    data-id="${producto.id}"
                >
                    Vender
                </button>

                <button
                    type="button"
                    data-accion="editar"
                    data-id="${producto.id}"
                >
                    Editar
                </button>

                <button
                    type="button"
                    data-accion="eliminar"
                    data-id="${producto.id}"
                >
                    Eliminar
                </button>

            </td>
        `;

        tablaProductos.appendChild(fila);
    });
}


formularioProducto.addEventListener(
    "submit",
    async function(evento) {

        evento.preventDefault();


        if (
            nombreInput.value.trim() === "" ||
            categoriaInput.value.trim() === ""
        ) {

            alert("Complete todos los campos");

            return;
        }


        if (Number(precioInput.value) <= 0) {

            alert("El precio debe ser mayor a 0");

            return;
        }


        if (Number(stockInput.value) < 0) {

            alert("El stock no puede ser negativo");

            return;
        }


        const nombreNormalizado =
            nombreInput.value
                .trim()
                .toLowerCase();


        const productoDuplicado =
            productos.find((producto) => {

                return (
                    producto.nombre
                        .trim()
                        .toLowerCase()
                        === nombreNormalizado
                    &&
                    producto.id !== idEditando
                );
            });


        if (productoDuplicado) {

            alert(
                "Ya existe un producto con ese nombre"
            );

            return;
        }


        try {

            if (idEditando === null) {

                await addDoc(
                    collection(db, "productos"),
                    {
                        nombre:
                            nombreInput.value.trim(),

                        categoria:
                            categoriaInput.value.trim(),

                        precio:
                            Number(precioInput.value),

                        stock:
                            Number(stockInput.value)
                    }
                );

            } else {

                const referencia =
                    doc(
                        db,
                        "productos",
                        idEditando
                    );


                await updateDoc(
                    referencia,
                    {
                        nombre:
                            nombreInput.value.trim(),

                        categoria:
                            categoriaInput.value.trim(),

                        precio:
                            Number(precioInput.value),

                        stock:
                            Number(stockInput.value)
                    }
                );


                idEditando = null;

                formularioProducto
                    .querySelector("button")
                    .textContent =
                    "Guardar producto";
            }


            formularioProducto.reset();

            await cargarProductos();

        } catch (error) {

            alert("Error al guardar producto");

            console.error(error);
        }
    }
);


async function venderProducto(id) {

    const producto =
        productos.find(
            producto =>
                producto.id === id
        );


    if (!producto) {
        return;
    }


    if (producto.stock <= 0) {

        alert("Producto sin stock");

        return;
    }


    try {

        const referencia =
            doc(
                db,
                "productos",
                id
            );


        await updateDoc(
            referencia,
            {
                stock:
                    producto.stock - 1
            }
        );


        alert(
            "Venta realizada correctamente"
        );


        await cargarProductos();

    } catch (error) {

        alert(
            "Error al realizar la venta"
        );

        console.error(error);
    }
}


function editarProducto(id) {

    const producto =
        productos.find(
            producto =>
                producto.id === id
        );


    if (!producto) {
        return;
    }


    nombreInput.value =
        producto.nombre;

    categoriaInput.value =
        producto.categoria;

    precioInput.value =
        producto.precio;

    stockInput.value =
        producto.stock;


    idEditando = id;


    formularioProducto
        .querySelector("button")
        .textContent =
        "Guardar cambios";
}


async function eliminarProducto(id) {

    const confirmar =
        confirm(
            "¿Seguro que desea eliminar este producto?"
        );


    if (!confirmar) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "productos",
                id
            )
        );


        await cargarProductos();

    } catch (error) {

        alert(
            "Error al eliminar producto"
        );

        console.error(error);
    }
}


tablaProductos.addEventListener(
    "click",
    function(evento) {

        const boton =
            evento.target.closest("button");


        if (!boton) {
            return;
        }


        const accion =
            boton.dataset.accion;

        const id =
            boton.dataset.id;


        if (accion === "vender") {

            venderProducto(id);
        }


        if (accion === "editar") {

            editarProducto(id);
        }


        if (accion === "eliminar") {

            eliminarProducto(id);
        }
    }
);


buscarInput.addEventListener(
    "input",
    function() {

        mostrarProductos(
            buscarInput.value
        );
    }
);

btnCerrarSesion.addEventListener(
    "click",
    async function() {

        try {

            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {

            alert("Error al cerrar sesión");

            console.error(error);
        }
    }
);