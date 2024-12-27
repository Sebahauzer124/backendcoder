// main.js

// Función para obtener los productos desde el servidor (sin WebSockets)
async function obtenerProductos() {
    try {
        const response = await fetch('/api/products');  // Ruta que devuelve los productos en formato JSON
        if (!response.ok) {
            throw new Error('No se pudieron obtener los productos');
        }
        return await response.json();  // Retorna los productos obtenidos
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return [];  // Retorna un array vacío en caso de error
    }
}

// Función para cargar los productos en la lista
async function cargarProductos() {
    const listaProductos = document.getElementById("lista-productos");

    try {
        const productos = await obtenerProductos();  // Llama a la función para obtener los productos
        listaProductos.innerHTML = "";  // Limpiar la lista previa

        // Agrega cada producto a la lista
        productos.forEach(producto => {
            listaProductos.innerHTML += `<li>${producto.title}</li>`;
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Llama a la función para cargar los productos cuando la página se cargue
cargarProductos();
