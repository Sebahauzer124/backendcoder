import mongoose from "mongoose";

// Definir el esquema de carrito
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', // Referencia al modelo de productos
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

// Middleware para poblar los productos automáticamente en las consultas de `find` y `findOne`
cartSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  // Realizamos la población para traer detalles del producto (solo _id, title, y price)
  this.populate('products.product', '_id title price');
  next();
});

// Middleware para población de productos cuando se realiza un `save` o `update`
cartSchema.pre('save', async function (next) {
  // Si tienes una lógica adicional cuando se guarda un carrito, puedes colocarla aquí
  next();
});

// Crear el modelo de carrito
const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
