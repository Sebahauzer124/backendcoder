import express from "express";
import ProductManager from "../managers/product-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();

// Obtener todos los productos con paginación, orden y filtros
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Convertir los parámetros limit y page a enteros
        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        console.log("Productos obtenidos:", productos);

        res.json({
            status: 'success',
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.prevLink,
            nextLink: productos.nextLink,
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

// Obtener un producto por su ID
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(id);
        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        const producto = await productManager.updateProduct(id, productoActualizado);
        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado para actualizar"
            });
        }

        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.deleteProduct(id);
        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado para eliminar"
            });
        }

        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

export default router;
