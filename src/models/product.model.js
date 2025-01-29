
// models/products.model.js
import mongoose from "mongoose";

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: [{ type: String }]  // Asegúrate de incluir esta propiedad si es relevante
});

// Crear y exportar el modelo de producto
const Product = mongoose.model('products', productSchema);
export default Product;
