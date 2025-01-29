import ProductModel from "../models/product.model.js";

class ProductManager {

    // Agregar nuevo producto
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existeProducto = await ProductModel.findOne({ code: code });
            if (existeProducto) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
            console.log("Producto agregado exitosamente");
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    // Obtener productos con paginación y filtros
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            // Consulta de productos
            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Información de paginación
            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id);
            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto encontrado!");
            return producto;
        } catch (error) {
            console.log("Error al traer un producto por id", error);
            throw error;
        }
    }

    // Actualizar un producto por ID
    async updateProduct(id, productoActualizado) {
        try {
            const updateado = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            if (!updateado) {
                console.log("Producto no encontrado para actualizar");
                return null;
            }
            console.log("Producto actualizado exitosamente");
            return updateado;
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(id) {
        try {
            const deleteado = await ProductModel.findByIdAndDelete(id);
            if (!deleteado) {
                console.log("Producto no encontrado para eliminar");
                return null;
            }
            console.log("Producto eliminado exitosamente");
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;
