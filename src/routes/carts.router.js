// carts.router.js
import { Router } from "express";
import CartManager from "../managers/cart-manager-db.js";

const router = Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const carrito = await cartManager.getCarritoById(req.params.cid);
        res.status(200).json(carrito);
    } catch (error) {
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const carritoActualizado = await cartManager.agregarProductoAlCarrito(cid, pid, quantity);
        res.status(200).json(carritoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carritoActualizado = await cartManager.eliminarProductoDelCarrito(cid, pid);
        res.status(200).json(carritoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
});

// Actualizar todo el carrito
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const carritoActualizado = await cartManager.actualizarCarrito(cid, products);
        res.status(200).json(carritoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const carritoActualizado = await cartManager.actualizarCantidadDeProducto(cid, pid, quantity);
        res.status(200).json(carritoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar cantidad del producto" });
    }
});

// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const carritoVaciado = await cartManager.vaciarCarrito(cid);
        res.status(200).json(carritoVaciado);
    } catch (error) {
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
});

export default router;
