const formularioProducto = document.getElementById("formularioProducto");

const nombreInput = document.getElementById("nombre");
const categoriaInput = document.getElementById("categoria");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");

const tablaProductos = document.getElementById("tablaProductos");
const buscarInput = document.getElementById("buscar");

let productos =
    JSON.parse(localStorage.getItem("productos")) || [];

let idEditando = null;

function guardarProductos() {
    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );
}

function mostrarProductos(filtro = "") {
    tablaProductos.innerHTML = "";

    const texto = filtro.toLowerCase();

    const productosFiltrados = productos.filter((producto) => {
        return (
            producto.nombre.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
        );
    });

    productosFiltrados.forEach((producto) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>
    <button
        type="button"
        onclick="venderProducto(${producto.id})"
    >
        Vender
    </button>

    <button
        type="button"
        onclick="editarProducto(${producto.id})"
    >
        Editar
    </button>

    <button
        type="button"
        onclick="eliminarProducto(${producto.id})"
    >
        Eliminar
    </button>
</td>
        `;

        tablaProductos.appendChild(fila);
    });
}
    productos.forEach((producto) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio}</td>
            <td>
    ${producto.stock > 0 ? producto.stock : "Sin stock"}
</td>
            <td>
                <button
                    type="button"
                    onclick="editarProducto(${producto.id})"
                >
                    Editar
                </button>

                <button
                    type="button"
                    onclick="eliminarProducto(${producto.id})"
                >
                    Eliminar
                </button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });


formularioProducto.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (idEditando === null) {
        const nuevoProducto = {
            id: Date.now(),
            nombre: nombreInput.value,
            categoria: categoriaInput.value,
            precio: Number(precioInput.value),
            stock: Number(stockInput.value)
        };

        productos.push(nuevoProducto);
    } else {
        const producto = productos.find(
            producto => producto.id === idEditando
        );

        producto.nombre = nombreInput.value;
        producto.categoria = categoriaInput.value;
        producto.precio = Number(precioInput.value);
        producto.stock = Number(stockInput.value);

        idEditando = null;

        formularioProducto.querySelector("button").textContent =
            "Guardar producto";
    }

    guardarProductos();
    mostrarProductos();
    formularioProducto.reset();
});

function editarProducto(id) {
    const producto = productos.find(
        producto => producto.id === id
    );

    nombreInput.value = producto.nombre;
    categoriaInput.value = producto.categoria;
    precioInput.value = producto.precio;
    stockInput.value = producto.stock;

    idEditando = id;

    formularioProducto.querySelector("button").textContent =
        "Guardar cambios";
}

function venderProducto(id) {
    const producto = productos.find(
        producto => producto.id === id
    );

    if (producto.stock > 0) {
        producto.stock--;

        guardarProductos();
        mostrarProductos(buscarInput.value);

        alert("Venta realizada correctamente");
    } else {
        alert("Producto sin stock");
    }
}

function eliminarProducto(id) {
    productos = productos.filter(
        producto => producto.id !== id
    );

    guardarProductos();
    mostrarProductos();
}

buscarInput.addEventListener("input", function() {
    mostrarProductos(buscarInput.value);
});

mostrarProductos();