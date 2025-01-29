// cart-manager-db.js
import CartModel from "../models/cart.model.js";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId).populate("products.product");
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = carrito.products.filter(item => item.product._id.toString() !== productId);
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
        }
    }

    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = updatedProducts;
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
        }
    }

    async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const productIndex = carrito.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                carrito.products[productIndex].quantity = newQuantity;
                carrito.markModified("products");
                await carrito.save();
                return carrito;
            } else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto:", error);
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const carrito = await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            return carrito;
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
        }
    }
}

export default CartManager;
