import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const productsRouter = Router();

// Ruta absoluta del archivo de productos
const productsFilePath = path.resolve("src", "data", "productos.json");

// Leer el archivo JSON de productos
const readProductsFile = async () => {
    try {
        const data = await fs.readFile(productsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo el archivo:", error);
        return []; // Retorna un arreglo vacío en caso de error
    }
};

// Escribir en el archivo JSON de productos
const writeProductsFile = async (products) => {
    try {
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Error escribiendo el archivo:", error);
    }
};

// ** Ruta GET / - Listar todos los productos con límite opcional **
productsRouter.get("/", async (req, res) => {
    try {
        const products = await readProductsFile();
        const { limit } = req.query;

        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            return res.json(limitedProducts);
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al obtener los productos." });
    }
});

// ** Ruta GET /:pid - Obtener producto por ID **
productsRouter.get("/:pid", async (req, res) => {
    try {
        const products = await readProductsFile();
        const product = products.find((product) => product.id === req.params.pid);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al buscar el producto." });
    }
});

// ** Ruta POST / - Crear un nuevo producto **
productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios excepto thumbnails." });
    }

    try {
        const products = await readProductsFile();

        const newProduct = {
            id: (products.length + 1).toString(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails,
        };

        products.push(newProduct);
        await writeProductsFile(products);

        res.status(201).json({ status: "success", message: "Producto creado", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al crear el producto." });
    }
});

// ** Ruta DELETE /:pid - Eliminar un producto por ID **
productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const products = await readProductsFile();
        const productIndex = products.findIndex((product) => product.id === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        const deletedProduct = products.splice(productIndex, 1);
        await writeProductsFile(products);

        res.json({ message: "Producto eliminado con éxito", product: deletedProduct[0] });
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al eliminar el producto." });
    }
});

// ** Ruta PUT /:pid - Actualizar un producto por ID **
productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updateFields = req.body;

    try {
        const products = await readProductsFile();
        const productIndex = products.findIndex((product) => product.id === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        const updatedProduct = { ...products[productIndex], ...updateFields };
        products[productIndex] = updatedProduct;

        await writeProductsFile(products);

        res.json({ message: "Producto actualizado con éxito", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Hubo un problema al actualizar el producto." });
    }
});

export default productsRouter;
