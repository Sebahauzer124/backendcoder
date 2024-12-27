const socket = io();

// Selecciona el formulario
const formulario = document.getElementById("crear-producto-form");
let productosActuales = []; // Variable para almacenar los productos actuales

// Escucha el evento 'updateProducts' para actualizar la lista de productos
socket.on("updateProducts", (products) => {
    productosActuales = products; // Actualiza la lista local de productos
    const listaProductos = document.getElementById("productos-lista");
    listaProductos.innerHTML = ''; // Limpia la lista actual

    // Agrega cada producto a la lista
    products.forEach((product) => {
        const productItem = document.createElement("li");
        productItem.id = `producto-${product.id}`;
        productItem.innerHTML = `
            ${product.title} - ${product.description} - Código: ${product.code} - $${product.price} - Stock: ${product.stock} - Categoría: ${product.category}
            <button onclick="eliminarProducto('${product.id}')">Eliminar</button>
        `;
        listaProductos.appendChild(productItem);
    });
});

// Escucha el evento de envío del formulario
formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtiene los valores del formulario
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const thumbnails = document.getElementById("thumbnails").value.split(',');

    // Calcula el próximo ID
    const maxId = productosActuales.reduce((max, product) => Math.max(max, parseInt(product.id, 10)), 0);
    const nextId = (maxId + 1).toString();

    // Crea el producto
    const newProduct = {
        id: nextId,
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    };

    // Envía el nuevo producto al servidor
    socket.emit("createProduct", newProduct);

    // Limpia el formulario
    formulario.reset();
});

// Función para eliminar un producto
function eliminarProducto(productId) {
    // Emite el evento 'deleteProduct' al servidor con el ID del producto
    socket.emit("deleteProduct", productId);
}
